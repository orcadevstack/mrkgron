// ─── Auth ──────────────────────────────────────────────────────────────────
export interface User {
    id: string;
    email: string;
    full_name: string;
    is_staff: boolean;
    is_active: boolean;
    date_joined: string;
}

export interface AuthTokens {
    access: string;
    refresh: string;
}

// ─── Tenant ─────────────────────────────────────────────────────────────────
export interface Tenant {
    id: string;
    name: string;
    slug: string;
    plan: string;
    is_active: boolean;
    created_at: string;
}

// ─── CRM ────────────────────────────────────────────────────────────────────
export type CustomerStatus = "lead" | "prospect" | "active" | "churned" | "inactive";
export type CustomerSource = "web" | "import" | "api" | "referral" | "social";

export interface Customer {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    status: CustomerStatus;
    source: CustomerSource;
    opted_in_email: boolean;
    opted_in_sms: boolean;
    tenant: string;
    created_at: string;
    updated_at: string;
}

// ─── Communications ─────────────────────────────────────────────────────────
export type ChannelType = "email" | "sms" | "push" | "whatsapp" | "in_app" | "webhook";
export type CampaignStatus = "draft" | "scheduled" | "active" | "paused" | "completed" | "cancelled";

export interface Campaign {
    id: string;
    name: string;
    channel_type: ChannelType;
    status: CampaignStatus;
    scheduled_at?: string;
    sent_count: number;
    open_rate: number;
    click_rate: number;
    created_at: string;
}

// ─── Analytics ──────────────────────────────────────────────────────────────
export interface Metric {
    id: string;
    name: string;
    value: number;
    period: string;
    period_start: string;
    period_end: string;
}

export interface Dashboard {
    id: string;
    name: string;
    is_default: boolean;
}

export interface Widget {
    id: string;
    title: string;
    widget_type: string;
    config: Record<string, unknown>;
    position: number;
}

// ─── Commerce ────────────────────────────────────────────────────────────────
export interface Product {
    id: string;
    name: string;
    sku: string;
    price: string;
    category: string;
    is_active: boolean;
    stock: number;
}

export interface Order {
    id: string;
    order_number: string;
    status: string;
    total_amount: string;
    customer: string;
    created_at: string;
}

// ─── Pagination ──────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}
