import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/context/ToastContext'
import api, { errorMessage, fieldErrors } from '@/services/api'
import { PLACE_NAMES, type Coords } from '@/lib/locations'
import type { ItemImage, MarketplaceItem, RentPeriod } from '@/types'
import { Button } from '@/components/ui/Button'
import { CheckField, SelectField, TextArea, TextField } from '@/components/ui/Field'
import { LocationPicker } from '@/components/map/LocationPicker'
import { ImageUploader } from './ImageUploader'

const CATEGORIES = [
    { value: 'phones', label: 'Phones' },
    { value: 'electronics', label: 'Laptops & Electronics' },
    { value: 'furniture', label: 'Furniture & Beds' },
    { value: 'appliances', label: 'Room Appliances' },
    { value: 'vehicles', label: 'Motos & Bikes' },
    { value: 'tools', label: 'Workshop Tools' },
    { value: 'clothing', label: 'Clothing & Shoes' },
    { value: 'books', label: 'Books' },
    { value: 'essentials', label: 'Household Essentials' },
    { value: 'other', label: 'Other' },
]

const CONDITIONS = [
    { value: 'new', label: 'New' },
    { value: 'like_new', label: 'Like new' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
]

const PERIODS = [
    { value: 'day', label: 'per day' },
    { value: 'week', label: 'per week' },
    { value: 'month', label: 'per month' },
]

const PLACES = [{ value: '', label: 'Choose a town' }, ...PLACE_NAMES.map((n) => ({ value: n, label: n }))]

interface ItemFormProps {
    /** Present when editing an existing listing. */
    item?: MarketplaceItem
}

export const ItemForm: React.FC<ItemFormProps> = ({ item }) => {
    const navigate = useNavigate()
    const toast = useToast()
    const queryClient = useQueryClient()
    const editing = Boolean(item)

    const [type, setType] = useState<'sale' | 'rent'>(item?.listing_type ?? 'sale')
    const [title, setTitle] = useState(item?.title ?? '')
    const [category, setCategory] = useState(item?.category === 'tvet_tools' ? 'tools' : (item?.category ?? 'phones'))
    const [condition, setCondition] = useState(item?.condition ?? 'good')
    const [price, setPrice] = useState(item ? String(item.price) : '')
    const [period, setPeriod] = useState<RentPeriod>(item?.rent_period ?? 'day')
    const [description, setDescription] = useState(item?.description ?? '')
    const [town, setTown] = useState(item?.location ?? '')
    const [pin, setPin] = useState<Coords | null>(item?.latitude != null && item?.longitude != null ? { lat: item.latitude, lng: item.longitude } : null)
    const [urgent, setUrgent] = useState(item?.is_urgent ?? false)

    const [files, setFiles] = useState<File[]>([])
    const [existing, setExisting] = useState<ItemImage[]>(item?.images ?? [])
    const [removed, setRemoved] = useState<ItemImage[]>([])

    const [busy, setBusy] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [formError, setFormError] = useState('')

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})
        setFormError('')
        setBusy(true)

        const payload = {
            title: title.trim(),
            description: description.trim(),
            price: Number(price),
            category,
            condition,
            listing_type: type,
            rent_period: type === 'rent' ? period : null,
            location: town || null,
            is_urgent: urgent,
            ...(pin && !editing ? { latitude: pin.lat, longitude: pin.lng } : {}),
        }

        let saved: MarketplaceItem
        try {
            const res = editing
                ? await api.patch(`/v1/trade/items/${item!.id}`, payload)
                : await api.post('/v1/trade/items', payload)
            saved = res.data.data as MarketplaceItem
        } catch (err) {
            setErrors(fieldErrors(err))
            setFormError(errorMessage(err))
            setBusy(false)
            return
        }

        // The listing exists now. Photos are separate requests, so report their problems without losing the listing.
        try {
            for (const img of removed) await api.delete(`/v1/trade/items/${saved.id}/images/${img.id}`)
            if (files.length > 0) {
                const body = new FormData()
                files.forEach((f) => body.append('images[]', f))
                await api.post(`/v1/trade/items/${saved.id}/images`, body)
            }
        } catch (err) {
            toast.error(`Your listing was saved, but photos failed: ${errorMessage(err)}`)
            queryClient.invalidateQueries()
            navigate(`/account/edit/item/${saved.id}`, { replace: true })
            return
        } finally {
            setBusy(false)
        }

        queryClient.invalidateQueries()
        toast.success(editing ? 'Listing updated' : 'Your listing is live')
        navigate(`/trade/${saved.id}`)
    }

    return (
        <form onSubmit={submit} noValidate className="space-y-8">
            <fieldset>
                <legend className="mb-2 text-sm font-medium text-slate-200">What are you doing?</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                    {(
                        [
                            { value: 'sale', title: 'Selling it', text: 'A one-time sale for a fixed price.' },
                            { value: 'rent', title: 'Renting it out', text: 'Lend it to neighbours for a fee per day, week or month.' },
                        ] as const
                    ).map((o) => (
                        <label
                            key={o.value}
                            className={`cursor-pointer rounded-2xl p-4 ring-1 transition-colors ${
                                type === o.value ? 'bg-panel-2 ring-2 ring-white' : 'bg-canvas/60 ring-white/10 hover:ring-white/30'
                            }`}
                        >
                            <input type="radio" name="type" className="sr-only" checked={type === o.value} onChange={() => setType(o.value)} />
                            <span className="block text-[15px] font-semibold text-white">{o.title}</span>
                            <span className="mt-1 block text-sm text-slate-400">{o.text}</span>
                        </label>
                    ))}
                </div>
            </fieldset>

            <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={type === 'rent' ? 'e.g. Navy suit for rent' : 'e.g. Samsung Galaxy A12, 64GB'}
                maxLength={255}
                error={errors.title}
                required
            />

            <div className="grid gap-5 sm:grid-cols-2">
                <SelectField label="Category" value={category} options={CATEGORIES} onChange={(e) => setCategory(e.target.value as typeof category)} error={errors.category} />
                <SelectField label="Condition" value={condition} options={CONDITIONS} onChange={(e) => setCondition(e.target.value as typeof condition)} error={errors.condition} />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                    label={type === 'rent' ? 'Rental price' : 'Price'}
                    prefix="RWF"
                    type="number"
                    inputMode="numeric"
                    min={100}
                    step={500}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    error={errors.price}
                    required
                />
                {type === 'rent' && (
                    <SelectField label="Charged" value={period} options={PERIODS} onChange={(e) => setPeriod(e.target.value as RentPeriod)} error={errors.rent_period} />
                )}
            </div>

            <TextArea
                label="Description"
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Condition, size, what is included, why you are selling, how to collect…"
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
                <SelectField label="Where is it?" value={town} options={PLACES} onChange={(e) => setTown(e.target.value)} error={errors.location} />
                {!editing && (
                    <div>
                        <p className="mb-2 text-sm font-medium text-slate-200">
                            Pin the area <span className="font-normal text-slate-400">(optional, helps buyers find items near them)</span>
                        </p>
                        <LocationPicker value={pin} onChange={setPin} town={town} />
                    </div>
                )}
            </div>

            <CheckField
                label="Mark as urgent"
                description="Use this if you are moving or need to sell or rent quickly. It shows on the Urgent Deals page."
                checked={urgent}
                onChange={(e) => setUrgent(e.target.checked)}
            />

            {formError && Object.keys(errors).length === 0 && (
                <p role="alert" className="text-sm text-[#f0827a]">
                    {formError}
                </p>
            )}
            {Object.keys(errors).length > 0 && (
                <p role="alert" className="text-sm text-[#f0827a]">
                    Please fix the highlighted fields.
                </p>
            )}

            <div className="flex flex-wrap gap-3">
                <Button type="submit" size="lg" loading={busy} disabled={!title || !price || !description}>
                    {editing ? 'Save changes' : type === 'rent' ? 'Publish rental' : 'Publish listing'}
                </Button>
                <Button variant="ghost" size="lg" onClick={() => navigate(-1)}>
                    Cancel
                </Button>
            </div>
        </form>
    )
}
