
export interface Order {
  id: string;
  date: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  category: string;
  condition: 'Excelente' | 'Bom' | 'Aceitável';
  images: string[];
  rating: number;
  reviewsCount: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface HomeSection {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  buttonText: string;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  language: 'pt' | 'en';
  notifications: boolean;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  role: 'admin' | 'customer';
  createdAt: string;
  orders?: Order[];
  settings?: UserSettings;
}

export interface LayoutSettings {
  primaryColor: string;
  backgroundColor: string;
  brandName: string;
  bannerText: string;
  bannerFontSize: number;
  heroImage: string;
  heroBadge: string;
  heroTitle: string;
  heroTitleSize: number;
  heroSubtitle: string;
  heroSubtitleSize: number;
  headerBgImage: string;
  fontFamily: 'Inter' | 'Roboto' | 'Poppins' | 'Montserrat' | 'Lexend';
  whatsappNumber: string;
  showAiTips: boolean;
  homeSections: HomeSection[];
}

export type ViewType = 'home' | 'product-detail' | 'category' | 'admin' | 'settings';
