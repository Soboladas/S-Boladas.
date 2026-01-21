
import React, { useState } from 'react';
import { Search, ShoppingCart, Settings, User as UserIcon, Smartphone, Laptop, Gamepad2, Headphones, Camera, Watch, LayoutGrid, X } from 'lucide-react';
import { CATEGORIES } from '../constants';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onSearch: (term: string) => void;
  onCategorySelect: (cat: string) => void;
  onLogoClick: () => void;
  onAdminClick: () => void;
  onSettingsClick: () => void;
  brandName: string;
  bannerText: string;
  bannerFontSize: number;
  headerBgImage: string;
  primaryColor: string;
  theme: 'light' | 'dark';
  isAdmin: boolean;
  isLoggedIn: boolean;
  selectedCategory: string;
}

const categoryIcons: Record<string, any> = {
  'Todos': LayoutGrid,
  'Smartphones': Smartphone,
  'Laptops': Laptop,
  'Consoles': Gamepad2,
  'Áudio': Headphones,
  'Câmeras': Camera,
  'Acessórios': Watch
};

const Navbar: React.FC<NavbarProps> = ({ 
  cartCount, 
  onCartClick, 
  onSearch, 
  onCategorySelect, 
  onLogoClick, 
  onAdminClick,
  onSettingsClick,
  brandName,
  bannerText,
  bannerFontSize,
  headerBgImage,
  primaryColor,
  theme,
  isAdmin,
  isLoggedIn,
  selectedCategory
}) => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const headerStyle: React.CSSProperties = headerBgImage ? {
    backgroundImage: `url(${headerBgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative'
  } : {};

  return (
    <nav className={`shadow-sm sticky top-0 z-50 ${theme === 'dark' ? 'bg-slate-900 border-b border-slate-800' : 'bg-white'}`}>
      {/* Banner Superior Informativo */}
      <div 
        className="text-white text-center py-1.5 font-bold px-4 uppercase tracking-[0.3em] overflow-hidden whitespace-nowrap"
        style={{ backgroundColor: primaryColor, fontSize: `${bannerFontSize}px` }}
      >
        <div className="animate-marquee inline-block">
          {bannerText}
        </div>
      </div>
      
      {/* Header Principal */}
      <div 
        style={headerStyle}
        className="max-w-7xl mx-auto px-4 sm:px-10 border-b border-gray-100 dark:border-slate-800"
      >
        {headerBgImage && <div className="absolute inset-0 bg-black/40 dark:bg-black/60 pointer-events-none" />}
        <div className="relative z-10 flex items-center justify-between h-16 sm:h-20 gap-4 sm:gap-8">
          <div className="flex-shrink-0 flex items-center cursor-pointer group" onClick={onLogoClick}>
            <span className="text-xl sm:text-3xl font-black tracking-tighter uppercase transition-transform group-hover:scale-105" style={{ color: (headerBgImage || theme === 'dark') ? '#fff' : primaryColor }}>
              {brandName}
            </span>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <input
                type="text"
                className={`w-full rounded-2xl py-3 pl-12 pr-4 focus:outline-none text-sm font-bold border transition-all ${theme === 'dark' ? 'bg-slate-800/80 border-slate-700 text-white focus:border-blue-500' : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-blue-500'}`}
                placeholder="O que você está procurando?"
                onChange={(e) => onSearch(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Search Toggle */}
            <button 
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-blue-500 rounded-xl transition-all"
            >
              <Search className={`w-6 h-6 ${(headerBgImage || theme === 'dark') ? 'text-white' : ''}`} />
            </button>

            {isAdmin && (
              <button onClick={onAdminClick} className="p-2.5 text-slate-400 hover:text-blue-500 hover:bg-white/10 rounded-xl transition-all" title="Painel Admin">
                <Settings className={`w-5 h-5 ${(headerBgImage || theme === 'dark') ? 'text-white' : ''}`} />
              </button>
            )}
            
            <button 
              onClick={onSettingsClick} 
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest ${
                isLoggedIn 
                ? 'text-slate-400 hover:bg-white/10' 
                : 'bg-blue-600 text-white shadow-lg hover:brightness-110 active:scale-95'
              }`}
            >
              <UserIcon className="w-5 h-5" />
              <span className="hidden sm:inline">{isLoggedIn ? 'Perfil' : 'Entrar'}</span>
            </button>

            <button onClick={onCartClick} className="relative p-2.5 text-slate-400 hover:text-green-500 hover:bg-white/10 rounded-xl transition-all group">
              <ShoppingCart className={`w-5 h-5 ${(headerBgImage || theme === 'dark') ? 'text-white' : 'text-slate-700'}`} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 text-white text-[9px] font-black min-w-[16px] h-4 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900" style={{ backgroundColor: primaryColor }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Expandable */}
        {mobileSearchOpen && (
          <div className="md:hidden pb-4 animate-in slide-in-from-top duration-300 relative z-20">
            <div className="relative w-full">
              <input
                autoFocus
                type="text"
                className={`w-full rounded-xl py-4 pl-12 pr-10 focus:outline-none text-sm font-bold border ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-100 border-gray-200'}`}
                placeholder="Pesquisar boladas..."
                onChange={(e) => onSearch(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <button onClick={() => setMobileSearchOpen(false)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Barra de Categorias Aparentes */}
      <div className={`overflow-x-auto no-scrollbar border-b ${theme === 'dark' ? 'border-slate-800 bg-slate-900/50' : 'border-gray-50 bg-gray-50/30'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-10 flex items-center justify-start sm:justify-center gap-2 sm:gap-8 py-3">
          {CATEGORIES.map((cat) => {
            const Icon = categoryIcons[cat] || LayoutGrid;
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onCategorySelect(cat)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all text-[10px] font-black uppercase tracking-widest ${
                  isActive 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
