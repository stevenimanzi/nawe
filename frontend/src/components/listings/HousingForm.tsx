import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/context/ToastContext'
import api, { errorMessage, fieldErrors } from '@/services/api'
import { PLACE_NAMES, type Coords } from '@/lib/locations'
import type { HousingListing, ItemImage, PropertyType } from '@/types'
import { Button } from '@/components/ui/Button'
import { CheckField, SelectField, TextArea, TextField } from '@/components/ui/Field'
import { LocationPicker } from '@/components/map/LocationPicker'
import { ImageUploader } from './ImageUploader'

const TYPES = [
    { value: 'room', label: 'Room' },
    { value: 'studio', label: 'Studio' },
    { value: 'house', label: 'House' },
    { value: 'apartment', label: 'Apartment' },
]

const PLACES = [{ value: '', label: 'Choose a town' }, ...PLACE_NAMES.map((n) => ({ value: n, label: n }))]

export const HousingForm: React.FC<{ listing?: HousingListing }> = ({ listing }) => {
    const navigate = useNavigate()
    const toast = useToast()
    const queryClient = useQueryClient()
    const editing = Boolean(listing)
    const a = listing?.amenities

    const [title, setTitle] = useState(listing?.title ?? '')
    const [propertyType, setPropertyType] = useState<PropertyType>(listing?.property_type ?? 'room')
    const [rooms, setRooms] = useState(String(listing?.rooms ?? 1))
    const [rent, setRent] = useState(listing ? String(listing.monthly_rent) : '')
    const [deposit, setDeposit] = useState(listing ? String(listing.deposit) : '')
    const [description, setDescription] = useState(listing?.description ?? '')
    const [town, setTown] = useState(listing?.location ?? '')
    const [address, setAddress] = useState(listing?.address ?? '')
    const [pin, setPin] = useState<Coords | null>(
        listing?.latitude != null && listing?.longitude != null ? { lat: listing.latitude, lng: listing.longitude } : null,
    )
    const [amenities, setAmenities] = useState({
        has_water: a?.has_water ?? false,
        has_electricity: a?.has_electricity ?? false,
        has_wifi: a?.has_wifi ?? false,
        is_furnished: a?.is_furnished ?? false,
        has_parking: a?.has_parking ?? false,
    })

    const [files, setFiles] = useState<File[]>([])
    const [existing, setExisting] = useState<ItemImage[]>(listing?.images ?? [])
    const [removed, setRemoved] = useState<ItemImage[]>([])

    const [busy, setBusy] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [formError, setFormError] = useState('')

    const toggle = (key: keyof typeof amenities) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setAmenities((s) => ({ ...s, [key]: e.target.checked }))

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})
        setFormError('')
        setBusy(true)

        const payload = {
            title: title.trim(),
            description: description.trim(),
            monthly_rent: Number(rent),
            deposit: Number(deposit || 0),
            rooms: Number(rooms),
            property_type: propertyType,
            location: town || null,
            address: address.trim() || null,
            ...amenities,
            ...(pin && !editing ? { latitude: pin.lat, longitude: pin.lng } : {}),
        }

        let saved: HousingListing
        try {
            const res = editing
                ? await api.patch(`/v1/dwell/listings/${listing!.id}`, payload)
                : await api.post('/v1/dwell/listings', payload)
            saved = res.data.data as HousingListing
        } catch (err) {
            setErrors(fieldErrors(err))
            setFormError(errorMessage(err))
            setBusy(false)
            return
        }

        try {
            for (const img of removed) await api.delete(`/v1/dwell/listings/${saved.id}/images/${img.id}`)
            if (files.length > 0) {
                const body = new FormData()
                files.forEach((f) => body.append('images[]', f))
                await api.post(`/v1/dwell/listings/${saved.id}/images`, body)
            }
        } catch (err) {
            toast.error(`Your listing was saved, but photos failed: ${errorMessage(err)}`)
            queryClient.invalidateQueries()
            navigate(`/account/edit/housing/${saved.id}`, { replace: true })
            return
        } finally {
            setBusy(false)
        }

        queryClient.invalidateQueries()
        toast.success(editing ? 'Listing updated' : 'Your place is listed')
        navigate(`/dwell/${saved.id}`)
    }

    return (
        <form onSubmit={submit} noValidate className="space-y-8">
            <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Furnished room with private bathroom in Nyakinama"
                maxLength={255}
                error={errors.title}
                required
            />

            <div className="grid gap-5 sm:grid-cols-2">
                <SelectField label="Type of place" value={propertyType} options={TYPES} onChange={(e) => setPropertyType(e.target.value as PropertyType)} error={errors.property_type} />
                <TextField label="Number of rooms" type="number" min={1} max={20} value={rooms} onChange={(e) => setRooms(e.target.value)} error={errors.rooms} required />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                    label="Rent per month"
                    prefix="RWF"
                    type="number"
                    inputMode="numeric"
                    min={5000}
                    step={5000}
                    value={rent}
                    onChange={(e) => setRent(e.target.value)}
                    error={errors.monthly_rent}
                    hint="Minimum RWF 5,000."
                    required
                />
                <TextField
                    label="Deposit"
                    prefix="RWF"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={5000}
                    value={deposit}
                    onChange={(e) => setDeposit(e.target.value)}
                    error={errors.deposit}
                    hint="Leave empty if there is none."
                />
            </div>

            <fieldset>
                <legend className="mb-3 text-sm font-medium text-slate-200">What is included?</legend>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <CheckField label="Water" checked={amenities.has_water} onChange={toggle('has_water')} />
                    <CheckField label="Electricity" checked={amenities.has_electricity} onChange={toggle('has_electricity')} />
                    <CheckField label="Wi-Fi" checked={amenities.has_wifi} onChange={toggle('has_wifi')} />
                    <CheckField label="Furnished" checked={amenities.is_furnished} onChange={toggle('is_furnished')} />
                    <CheckField label="Parking" checked={amenities.has_parking} onChange={toggle('has_parking')} />
                </div>
            </fieldset>

            <TextArea
                label="Description"
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the place, the neighbourhood, house rules and who it suits."
                maxLength={5000}
                error={errors.description}
                required
            />

            <ImageUploader
                files={files}
                onFilesChange={setFiles}
                existing={existing}
                onRemoveExisting={(img) => {
                    setExisting((all) => all.filter((x) => x.id !== img.id))
                    setRemoved((all) => [...all, img])
                }}
                error={errors.images}
            />

            <div className="space-y-4">
                <div className="grid gap-5 sm:grid-cols-2">
                    <SelectField label="Town" value={town} options={PLACES} onChange={(e) => setTown(e.target.value)} error={errors.location} />
                    <TextField label="Area or street" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g. Nyakinama, near the market" error={errors.address} />
                </div>
                {!editing && (
                    <div>
                        <p className="mb-2 text-sm font-medium text-slate-200">
                            Pin the exact spot <span className="font-normal text-slate-400">(this is what puts it on the map for people nearby)</span>
                        </p>
                        <LocationPicker value={pin} onChange={setPin} town={town} />
                    </div>
                )}
            </div>

            {formError && (
                <p role="alert" className="text-sm text-[#f0827a]">
                    {Object.keys(errors).length > 0 ? 'Please fix the highlighted fields.' : formError}
                </p>
            )}

            <div className="flex flex-wrap gap-3">
                <Button type="submit" size="lg" loading={busy} disabled={!title || !rent || !description}>
                    {editing ? 'Save changes' : 'Publish place'}
                </Button>
                <Button variant="ghost" size="lg" onClick={() => navigate(-1)}>
                    Cancel
                </Button>
            </div>
        </form>
    )
}
