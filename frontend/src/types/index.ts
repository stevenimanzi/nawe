export interface User {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: 'student' | 'landlord' | 'admin';
    is_verified: boolean;
    is_kyc_verified: boolean;
    created_at?: string;
}

export interface Verification {
    id: number;
    user_id: number;
    registration_number: string | null;
    id_document_path: string | null;
    status: 'pending' | 'verified' | 'rejected';
    rejection_reason?: string | null;
}

export interface KycVerification {
    id: number;
    user_id: number;
    document_type: 'national_id' | 'student_id' | 'passport' | 'driving_license';
    id_number: string;
    full_name: string;
    date_of_birth?: string | null;
    id_front_image_url?: string | null;
    id_back_image_url?: string | null;
    selfie_with_id_url?: string | null;
    status: 'pending' | 'in_review' | 'approved' | 'rejected';
    rejection_reason?: string | null;
    submitted_at?: string;
}

export interface HousingAmenity {
    has_water: boolean;
    has_wifi: boolean;
    has_electricity: boolean;
    has_parking: boolean;
    is_furnished: boolean;
    distance_to_campus_meters?: number | null;
}

export interface ItemImage {
    id: number;
    path: string;
    disk: string;
    sort_order: number;
}

export interface HousingListing {
    id: number;
    title: string;
    description: string;
    monthly_rent: number;
    deposit: number;
    rooms: number;
    latitude?: number | null;
    longitude?: number | null;
    address?: string | null;
    status: 'available' | 'rented' | 'paused';
    landlord?: User;
    amenities?: HousingAmenity;
    images?: ItemImage[];
    created_at?: string;
}

export interface MarketplaceItem {
    id: number;
    title: string;
    description: string;
    price: number;
    category: 'essentials' | 'electronics' | 'tvet_tools' | 'books' | 'clothing' | 'other';
    condition: 'new' | 'like_new' | 'good' | 'fair';
    status: 'active' | 'pending' | 'sold' | 'archived';
    seller?: User;
    images?: ItemImage[];
    created_at?: string;
}

export interface Message {
    id: number;
    sender_id: number;
    receiver_id: number;
    sender?: User;
    receiver?: User;
    messageable_type: string;
    messageable_id: number;
    content: string;
    read_at?: string | null;
    is_read: boolean;
    created_at?: string;
}
