export type PricingType = 'Free' | 'Freemium' | 'Paid' | 'Free Trial' | 'Unknown';

export interface AiTool {
  id: string;
  name_en: string;
  name_bn: string;
  logo_url: string;
  website_url: string;
  category_id: string;
  short_description_en: string;
  short_description_bn: string;
  full_description_en: string;
  full_description_bn: string;
  tags: string[];
  features_en?: string[];
  features_bn?: string[];
  languages?: string[];
  featured: boolean;
  popular: boolean;
  active: boolean;
  sponsored?: boolean;
  pricing_type: PricingType;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name_en: string;
  name_bn: string;
  description_en: string;
  description_bn: string;
  icon: string;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  name?: string;
  created_at: string;
}

export interface SiteSettings {
  site_name: string;
  tagline_en: string;
  tagline_bn: string;
  description_en: string;
  description_bn: string;
  contact_email: string;
  social_links: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    facebook?: string;
    youtube?: string;
  };
  default_language: 'en' | 'bn';
  footer_text_en: string;
  footer_text_bn: string;
  ad_placeholders_enabled: boolean;
  privacy_policy_en: string;
  privacy_policy_bn: string;
  terms_of_service_en: string;
  terms_of_service_bn: string;
  disclaimer_en: string;
  disclaimer_bn: string;
}

export interface AdminStats {
  total_tools: number;
  total_categories: number;
  featured_count: number;
  popular_count: number;
  active_count: number;
  recent_tools: AiTool[];
}

export type SupportedLanguage = 'en' | 'bn';
