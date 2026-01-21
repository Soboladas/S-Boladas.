
import { Product, LayoutSettings } from './types';

export const CATEGORIES = [
  'Todos',
  'Smartphones',
  'Laptops',
  'Consoles',
  'Áudio',
  'Câmeras',
  'Acessórios'
];

export const DEFAULT_LAYOUT: LayoutSettings = {
  primaryColor: '#1e293b',
  backgroundColor: '#ffffff',
  brandName: 'SÓ BOLADAS',
  bannerText: '🇲🇿 Qualidade e Confiança em Eletrônicos Usados | Entregas em toda Maputo e Províncias',
  bannerFontSize: 10,
  heroImage: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=1200',
  heroBadge: 'Outlet Premium Moçambique',
  heroTitle: 'Eletrônicos Selecionados de Elite.',
  heroTitleSize: 64,
  heroSubtitle: 'Curadoria técnica rigorosa em Maputo. Aparelhos revisados e garantidos com o melhor preço do mercado.',
  heroSubtitleSize: 18,
  headerBgImage: '',
  fontFamily: 'Inter',
  whatsappNumber: '258840000000',
  showAiTips: true,
  homeSections: [
    {
      id: 'sec_1',
      title: 'Smartphones de Elite',
      subtitle: 'Aparelhos selecionados com bateria acima de 85% e garantia de 3 meses.',
      imageUrl: 'https://images.unsplash.com/photo-1556656793-062ff987b50d?auto=format&fit=crop&q=80&w=800',
      buttonText: 'Ver Smartphones'
    },
    {
      id: 'sec_2',
      title: 'Laptops para Produtividade',
      subtitle: 'Encontre MacBooks e ThinkPads em estado impecável para o seu trabalho ou estudo.',
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
      buttonText: 'Explorar Laptops'
    }
  ]
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'iPhone 13 Pro 128GB - Grafite',
    description: 'Estado de novo, saúde da bateria 92%. Testado tecnicamente.',
    price: 45000.00,
    originalPrice: 52000.00,
    category: 'Smartphones',
    condition: 'Excelente',
    images: [
      'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=600'
    ],
    rating: 4.8,
    reviewsCount: 124
  },
  {
    id: '2',
    name: 'MacBook Air M1 2020',
    description: '8GB RAM, 256GB SSD. Performance incrível para trabalho.',
    price: 65000.00,
    originalPrice: 75000.00,
    category: 'Laptops',
    condition: 'Excelente',
    images: [
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600'
    ],
    rating: 4.9,
    reviewsCount: 45
  }
];
