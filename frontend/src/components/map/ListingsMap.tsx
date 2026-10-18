import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { RWANDA_CENTER, type Coords } from '@/lib/locations'

export interface MapMarker {
    id: number
    lat: number
    lng: number
    title: string
    subtitle: string
    image?: string
    href: string
}

interface ListingsMapProps {
    markers: MapMarker[]
    /** The visitor's position, shown as a dot with an optional radius ring. */
    me?: Coords | null
    radiusKm?: number | null
    selectedId?: number | null
    onSelect?: (id: number | null) => void
    onOpen: (href: string) => void
    className?: string
}

const TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

const pinIcon = (active: boolean) =>
    L.divIcon({
        className: 'nawe-pin-wrap',
        html: `<span class="nawe-pin${active ? ' nawe-pin--active' : ''}"></span>`,
        iconSize: [0, 0],
    })

/** Builds the popup as real DOM so no listing text is ever treated as HTML. */
function popupContent(m: MapMarker, onOpen: (href: string) => void) {
    const root = document.createElement('div')
    root.className = 'nawe-popup'

    if (m.image) {
        const img = document.createElement('img')
        img.src = m.image
        img.alt = ''
        root.appendChild(img)
    }

    const title = document.createElement('strong')
    title.textContent = m.title
    const sub = document.createElement('span')
    sub.textContent = m.subtitle
    const link = document.createElement('button')
    link.type = 'button'
    link.textContent = 'View details'
    link.addEventListener('click', () => onOpen(m.href))

    root.append(title, sub, link)
    return root
}

export const ListingsMap: React.FC<ListingsMapProps> = ({
    markers,
    me,
    radiusKm,
    selectedId,
    onSelect,
    onOpen,
    className = '',
}) => {
    const hostRef = useRef<HTMLDivElement>(null)
    const mapRef = useRef<L.Map | null>(null)
    const layerRef = useRef<L.LayerGroup | null>(null)
    const meLayerRef = useRef<L.LayerGroup | null>(null)
    const markerById = useRef(new Map<number, L.Marker>())
    const fittedFor = useRef('')

    // Keep the latest callbacks without rebuilding the map.
    const onOpenRef = useRef(onOpen)
    const onSelectRef = useRef(onSelect)
    useEffect(() => {
        onOpenRef.current = onOpen
        onSelectRef.current = onSelect
    })

    // Create the map once.
    useEffect(() => {
        if (!hostRef.current || mapRef.current) return

        const map = L.map(hostRef.current, { scrollWheelZoom: true }).setView(
            [RWANDA_CENTER.lat, RWANDA_CENTER.lng],
            RWANDA_CENTER.zoom,
        )
        L.tileLayer(TILES, {
            maxZoom: 19,
            className: 'nawe-dark-tiles',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map)

        layerRef.current = L.layerGroup().addTo(map)
        meLayerRef.current = L.layerGroup().addTo(map)
        mapRef.current = map

        const resize = new ResizeObserver(() => map.invalidateSize())
        resize.observe(hostRef.current)
        const pins = markerById.current

        return () => {
            resize.disconnect()
            map.remove()
            mapRef.current = null
            layerRef.current = null
            meLayerRef.current = null
            pins.clear()
        }
    }, [])

    // Draw the listing pins.
    useEffect(() => {
        const map = mapRef.current
        const layer = layerRef.current
        if (!map || !layer) return

        layer.clearLayers()
        markerById.current.clear()

        markers.forEach((m) => {
            const marker = L.marker([m.lat, m.lng], { icon: pinIcon(false), title: m.title, keyboard: true })
            marker.bindPopup(() => popupContent(m, (href) => onOpenRef.current(href)), { closeButton: false, maxWidth: 240 })
            marker.on('click', () => onSelectRef.current?.(m.id))
            marker.addTo(layer)
            markerById.current.set(m.id, marker)
        })

        // Frame the pins (and the visitor) when the set of results changes.
        const key = markers.map((m) => m.id).join(',') + (me ? `|${me.lat},${me.lng}` : '')
        if (key !== fittedFor.current) {
            fittedFor.current = key
            const points: L.LatLngTuple[] = markers.map((m) => [m.lat, m.lng])
            if (me) points.push([me.lat, me.lng])
            if (points.length > 1) map.fitBounds(L.latLngBounds(points), { padding: [48, 48], maxZoom: 14 })
            else if (points.length === 1) map.setView(points[0], 13)
        }
    }, [markers, me])

    // Highlight the selected pin.
    useEffect(() => {
        markerById.current.forEach((marker, id) => {
            marker.setIcon(pinIcon(id === selectedId))
            marker.setZIndexOffset(id === selectedId ? 1000 : 0)
        })
        if (selectedId != null) {
            const marker = markerById.current.get(selectedId)
            if (marker) mapRef.current?.panTo(marker.getLatLng(), { animate: true })
        }
    }, [selectedId, markers])

    // The visitor's dot and search radius.
    useEffect(() => {
        const layer = meLayerRef.current
        if (!layer) return
        layer.clearLayers()
        if (!me) return

        L.marker([me.lat, me.lng], {
            icon: L.divIcon({ className: 'nawe-pin-wrap', html: '<span class="nawe-me"></span>', iconSize: [0, 0] }),
            interactive: false,
            keyboard: false,
        }).addTo(layer)

        if (radiusKm) {
            L.circle([me.lat, me.lng], {
                radius: radiusKm * 1000,
                color: '#ffffff',
                weight: 1.5,
                dashArray: '6 6',
                fillColor: '#ffffff',
                fillOpacity: 0.06,
                interactive: false,
            }).addTo(layer)
        }
    }, [me, radiusKm])

    return <div ref={hostRef} className={`nawe-map ${className}`} role="region" aria-label="Map of listings" />
}
