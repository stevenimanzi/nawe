import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { LocateFixed } from 'lucide-react'
import { PLACES, RWANDA_CENTER, locateMe, placeByName, type Coords } from '@/lib/locations'

interface LocationPickerProps {
    value: Coords | null
    onChange: (coords: Coords | null) => void
    /** Town currently chosen in the form: the map opens there. */
    town?: string
    className?: string
}

const TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const pin = L.divIcon({ className: 'nawe-pin-wrap', html: '<span class="nawe-pin nawe-pin--active"></span>', iconSize: [0, 0] })

/** Click the map or drag the pin to set exactly where a listing is. */
export const LocationPicker: React.FC<LocationPickerProps> = ({ value, onChange, town, className = '' }) => {
    const hostRef = useRef<HTMLDivElement>(null)
    const mapRef = useRef<L.Map | null>(null)
    const markerRef = useRef<L.Marker | null>(null)
    const onChangeRef = useRef(onChange)
    const [error, setError] = useState('')
    const [locating, setLocating] = useState(false)

    useEffect(() => {
        onChangeRef.current = onChange
    })

    const place = (map: L.Map, lat: number, lng: number) => {
        const coords = { lat: Number(lat.toFixed(5)), lng: Number(lng.toFixed(5)) }
        if (!markerRef.current) {
            markerRef.current = L.marker([coords.lat, coords.lng], { icon: pin, draggable: true }).addTo(map)
            markerRef.current.on('dragend', () => {
                const p = markerRef.current!.getLatLng()
                onChangeRef.current({ lat: Number(p.lat.toFixed(5)), lng: Number(p.lng.toFixed(5)) })
            })
        } else {
            markerRef.current.setLatLng([coords.lat, coords.lng])
        }
        onChangeRef.current(coords)
    }

    useEffect(() => {
        if (!hostRef.current || mapRef.current) return
        const start = value ?? placeByName(town) ?? PLACES[0]
        const map = L.map(hostRef.current).setView([start.lat, start.lng], value || town ? 13 : RWANDA_CENTER.zoom)
        L.tileLayer(TILES, {
            maxZoom: 19,
            className: 'nawe-dark-tiles',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map)
        map.on('click', (e: L.LeafletMouseEvent) => place(map, e.latlng.lat, e.latlng.lng))
        if (value) place(map, value.lat, value.lng)
        mapRef.current = map

        const resize = new ResizeObserver(() => map.invalidateSize())
        resize.observe(hostRef.current)
        return () => {
            resize.disconnect()
            map.remove()
            mapRef.current = null
            markerRef.current = null
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Move to the chosen town when nothing has been pinned yet.
    useEffect(() => {
        const target = placeByName(town)
        if (target && !markerRef.current) mapRef.current?.setView([target.lat, target.lng], 13)
    }, [town])

    // Clearing the value from outside removes the pin.
    useEffect(() => {
        if (!value && markerRef.current) {
            markerRef.current.remove()
            markerRef.current = null
        }
    }, [value])

    const useMyLocation = async () => {
        setError('')
        setLocating(true)
        try {
            const c = await locateMe()
            if (mapRef.current) {
                place(mapRef.current, c.lat, c.lng)
                mapRef.current.setView([c.lat, c.lng], 15)
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Could not get your location.')
        } finally {
            setLocating(false)
        }
    }

    return (
        <div className={className}>
            <div ref={hostRef} className="nawe-map h-72 w-full rounded-2xl" role="region" aria-label="Pick the location on the map" />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-400">
                    {value ? `Pinned at ${value.lat}, ${value.lng}. Drag the pin to adjust.` : 'Click the map to drop a pin.'}
                </p>
                <div className="flex items-center gap-4">
                    {value && (
                        <button
                            type="button"
                            onClick={() => onChange(null)}
                            className="cursor-pointer text-sm text-slate-400 underline underline-offset-2 hover:text-white"
                        >
                            Remove pin
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={useMyLocation}
                        disabled={locating}
                        className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-white hover:underline disabled:opacity-60"
                    >
                        <LocateFixed className="size-4" aria-hidden />
                        {locating ? 'Locating…' : 'Use my location'}
                    </button>
                </div>
            </div>
            {error && (
                <p role="alert" className="mt-2 text-sm text-[#f0827a]">
                    {error}
                </p>
            )}
        </div>
    )
}
