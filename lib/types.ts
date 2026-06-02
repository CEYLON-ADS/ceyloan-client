export type Category = {
  id: string;
  name: string;
  slug?: string | null;
};

export type City = {
  id: string;
  name: string;
};

export type District = {
  id: string;
  district: string;
  cities: City[];
};

export type AdvertiseType = {
  id: string;
  type: string;
  price: string | number | null;
};

export type User = {
  id: string;
  email?: string | null;
  mobileNumber?: string | null;
  role?: string;
  activeState?: boolean;
  lastLoginAt?: string | null;
};

export type Advertisement = {
  id: string;
  title: string;
  description: string;
  image_url?: string | null;
  image_urls?: string[] | null;
  listing_price?: string | number | null;
  views_count?: number;
  likes_count?: number;
  contact_phone: string;
  contact_whatsapp?: boolean;
  contact_whatsapp_number?: string | null;
  telegram?: boolean;
  telegram_number?: string | null;
  imo?: boolean;
  imo_number?: string | null;
  viber?: boolean;
  viber_number?: string | null;
  cashback?: boolean;
  status?: string;
  ad_tier?: string | null;
  is_pinned?: boolean;
  created_at?: string;
  category?: Category | null;
  city?: City | null;
  cities?: City[];
  advertiseType?: AdvertiseType | null;
  user?: {
    id: string;
    mobile_number?: string | null;
  } | null;
};

export type Paginated<T> = {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
};

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};
