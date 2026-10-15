/**
 * Photos are served straight from Unsplash's image CDN (free to use, hotlinking is permitted).
 * Keys match the category keys in `categories.ts`.
 */
const BASE = 'https://images.unsplash.com/';

export const unsplash = (id: string, width = 800, quality = 80) =>
    `${BASE}${id}?auto=format&fit=crop&w=${width}&q=${quality}`;

/** `srcset` string so each screen downloads the sharpest size it actually needs. */
export const srcSet = (id: string, widths: number[], quality = 80) =>
    widths.map((w) => `${unsplash(id, w, quality)} ${w}w`).join(', ');

export const NEIGHBOURHOOD_ID = 'photo-1708772565599-2c4e4b3ed9db';
export const SECOND_HAND_ID = 'photo-1779643302127-0d0bbfa19524';

export interface Photo {
    id: string;
    alt: string;
    credit: string;
}

export const PHOTOS: Record<string, Photo> = {
    rentals: { id: 'photo-1617137984095-74e4e5e3613f', alt: 'A man in a blue suit', credit: 'Mohamad Khosravi' },
    shelter: { id: 'photo-1522708323590-d24dbb6b0267', alt: 'A tidy furnished room', credit: 'deborah cortelazzi' },
    phones: { id: 'photo-1592890288564-76628a30a657', alt: 'A person holding a smartphone', credit: 'Jonas Leupe' },
    electronics: { id: 'photo-1496181133206-80ce9b88a853', alt: 'A laptop on a wooden table', credit: 'Kari Shea' },
    furniture: { id: 'photo-1759722665629-29df6ee4f9a5', alt: 'A light grey sofa in a living room', credit: 'Costa Live' },
    appliances: { id: 'photo-1626806787461-102c1bfaaea1', alt: 'A white front-load washing machine', credit: 'PlanetCare' },
    vehicles: { id: 'photo-1641295437743-2ea0b8453392', alt: 'A person riding a motorcycle', credit: 'Dieuvain Musaghi' },
    tools: { id: 'photo-1606676539940-12768ce0e762', alt: 'A cordless drill and a hammer', credit: 'Sam Clarke' },
};

/** Everyone to credit in the footer, including the two photos stored locally. */
export const PHOTO_CREDITS = [
    'Protais Benjamin Mugenzi',
    'Margo Evardson',
    ...Object.values(PHOTOS).map((p) => p.credit),
];
