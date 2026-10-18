export type Role = 'member' | 'student' | 'landlord' | 'admin';

export interface User {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: Role;
    is_verified: boolean;
    is_kyc_verified: boolean;
    kyc_verification?: KycVerification | null;
    created_at?: string;
}

/** What other people may see about someone. */
export interface PublicUser {
    id: number;
    name: string;
    role: Role;
    is_kyc_verified: boolean;
    phone: string | null;
    member_since?: string;
}

export type KycStatus = 'pending' | 'in_review' | 'approved' | 'rejected';

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
    status: KycStatus;
    rejection_reason?: string | null;
    submitted_at?: string;
}

export interface ItemImage {
    id: number;
    path: string;
    disk: string;
    url: string;
    sort_order: number;
}

export type ItemCategory =
    | 'phones'
    | 'electronics'
    | 'furniture'
    | 'appliances'
    | 'vehicles'
    | 'tools'
    | 'clothing'
    | 'books'
    | 'essentials'
    | 'other'
    | 'tvet_tools';

export type Condition = 'new' | 'like_new' | 'good' | 'fair';
export type RentPeriod = 'day' | 'week' | 'month';

export interface MarketplaceItem {
    id: number;
    title: string;
    description: string;
    price: number;
    category: ItemCategory;
    condition: Condition;
    listing_type: 'sale' | 'rent';
    rent_period: RentPeriod | null;
    location: string | null;
    latitude: number | null;
    longitude: number | null;
    is_urgent: boolean;
    status: 'active' | 'pending' | 'sold' | 'archived';
    distance_km: number | null;
    seller?: PublicUser;
    images?: ItemImage[];
    created_at?: string;
}

export interface HousingAmenity {
    has_water: boolean;
    has_wifi: boolean;
    has_electricity: boolean;
    has_parking: boolean;
    is_furnished: boolean;
    distance_to_campus_meters?: number | null;
}

export type PropertyType = 'room' | 'studio' | 'house' | 'apartment';

export interface HousingListing {
    id: number;
    title: string;
    description: string;
    monthly_rent: number;
    deposit: number;
    rooms: number;
    latitude: number | null;
    longitude: number | null;
    address: string | null;
    location: string | null;
    property_type: PropertyType;
    status: 'available' | 'rented' | 'paused';
    distance_km: number | null;
    landlord?: PublicUser;
    amenities?: HousingAmenity;
    images?: ItemImage[];
    created_at?: string;
}

export interface Paginated<T> {
    data: T[];
    meta: { current_page: number; last_page: number; per_page: number; total: number };
}

export type EntityType = 'marketplace_item' | 'housing_listing';

export interface Message {
    id: number;
    sender_id: number;
    receiver_id: number;
    content: string;
    read_at?: string | null;
    is_read: boolean;
    created_at?: string;
}

export interface Conversation {
    other_user: PublicUser;
    entity_type: EntityType;
    entity_id: number;
    entity_title: string;
    entity_image: string | null;
    last_message: string;
    last_message_at: string;
    last_from_me: boolean;
    unread_count: number;
}

export interface FavoriteRef {
    type: EntityType;
    id: number;
}

export interface AdminKycRecord extends KycVerification {
    user: { id: number; name: string; email: string; phone: string | null };
}

export interface AdminReport {
    id: number;
    reason: string;
    details: string | null;
    status: 'open' | 'reviewed' | 'dismissed';
    created_at: string;
    reporter: { id: number; name: string };
    entity_type: EntityType;
    entity_id: number;
    entity_title: string;
}
