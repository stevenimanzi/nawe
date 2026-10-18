export interface Place {
    name: string
    lat: number
    lng: number
}

/** Districts and towns used by filters, forms and the map. */
export const PLACES: Place[] = [
    { name: 'Musanze', lat: -1.4994, lng: 29.6335 },
    { name: 'Kigali', lat: -1.9441, lng: 30.0619 },
    { name: 'Huye', lat: -2.5967, lng: 29.7394 },
    { name: 'Rubavu', lat: -1.6779, lng: 29.2606 },
    { name: 'Muhanga', lat: -2.0846, lng: 29.7569 },
    { name: 'Rwamagana', lat: -1.9486, lng: 30.4347 },
]

export const PLACE_NAMES = PLACES.map((p) => p.name)

export const RWANDA_CENTER = { lat: -1.9403, lng: 29.8739, zoom: 8 }

export const placeByName = (name?: string | null) => PLACES.find((p) => p.name === name)

const COORDS_KEY = 'nawe_coords'

export interface Coords {
    lat: number
    lng: number
}

/** Remembered for the session only, so coordinates never have to appear in the address bar. */
export function saveCoords(coords: Coords) {
    try {
        sessionStorage.setItem(COORDS_KEY, JSON.stringify(coords))
    } catch {
        /* private mode: the position simply is not remembered */
    }
}

export function loadCoords(): Coords | null {
    try {
        const raw = sessionStorage.getItem(COORDS_KEY)
        return raw ? (JSON.parse(raw) as Coords) : null
    } catch {
        return null
    }
}

/** Asks the browser for the visitor's position (rounded to about 100 m). */
export function locateMe(): Promise<Coords> {
    return new Promise((resolve, reject) => {
        if (!('geolocation' in navigator)) {
            reject(new Error('Your browser does not support location.'))
            return
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const coords = {
                    lat: Number(pos.coords.latitude.toFixed(3)),
                    lng: Number(pos.coords.longitude.toFixed(3)),
                }
                saveCoords(coords)
                resolve(coords)
            },
            (err) =>
                reject(
                    new Error(
                        err.code === err.PERMISSION_DENIED
                            ? 'Location is blocked. Allow it in your browser, or pick a town instead.'
                            : 'We could not find your location. Pick a town instead.',
                    ),
                ),
            { timeout: 10000, maximumAge: 300_000 },
        )
    })
}
