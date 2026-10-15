export interface Category {
    key: string;
    label: string;
    to: string;
    hint: string;
}

/** Single source for the header menu, search filter and home page. */
export const CATEGORIES: Category[] = [
    { key: 'rentals', label: 'Rent from Neighbours', to: '/trade?category=rentals', hint: 'Shoes, suits, washing machines & more' },
    { key: 'shelter', label: 'Shelter & Gueto', to: '/dwell', hint: 'Rooms, studios, houses' },
    { key: 'phones', label: 'Used Phones', to: '/trade?category=phones', hint: 'Smartphones & tablets' },
    { key: 'electronics', label: 'Laptops & Electronics', to: '/trade?category=electronics', hint: 'Computers, TVs, audio' },
    { key: 'furniture', label: 'Furniture & Beds', to: '/trade?category=furniture', hint: 'Sofas, beds, tables' },
    { key: 'appliances', label: 'Room Appliances', to: '/trade?category=appliances', hint: 'Fridges, cookers, fans' },
    { key: 'vehicles', label: 'Motos & Bikes', to: '/trade?category=vehicles', hint: 'Motorcycles & bicycles' },
    { key: 'tools', label: 'Workshop Tools', to: '/trade?category=tools', hint: 'Hand & power tools' },
];
