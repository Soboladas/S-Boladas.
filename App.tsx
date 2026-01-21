
import React, { useState, useEffect, useMemo } from 'react';
import { Product, CartItem, ViewType, LayoutSettings, User, Order, UserSettings } from './types';
import { MOCK_PRODUCTS, CATEGORIES, DEFAULT_LAYOUT } from './constants';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import AdminPanel from './components/AdminPanel';
import AuthModal from './components/AuthModal';
import SettingsView from './components/SettingsView';
import { ShieldCheck, Truck, RotateCcw, Sparkles, ArrowLeft, ArrowRight, ShoppingBag, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [layout, setLayout] = useState<LayoutSettings>(DEFAULT_LAYOUT);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [showAuthReminder, setShowAuthReminder] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [view, setView] = useState<ViewType>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Recuperação de Dados do LocalStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('sb-cart-v11');
    const savedProducts = localStorage.getItem('sb-products-v11');
    const savedLayout = localStorage.getItem('sb-layout-v11');
    const savedUsers = localStorage.getItem('sb-users-v11');
    const savedCurrentUser = localStorage.getItem('sb-current-user-v11');
    const savedTheme = localStorage.getItem('sb-theme-v11');
    
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedLayout) setLayout({ ...DEFAULT_LAYOUT, ...JSON.parse(savedLayout) });
    if (savedUsers) setRegisteredUsers(JSON.parse(savedUsers));
    
    if (savedCurrentUser) {
      const user = JSON.parse(savedCurrentUser);
      setCurrentUser(user);
      setIsAdmin(user.role === 'admin');
      if (user.settings?.theme) setTheme(user.settings.theme);
    } else if (savedTheme) {
      setTheme(savedTheme as 'light' | 'dark');
    }
  }, []);

  // Sincronização de Dados
  useEffect(() => {
    localStorage.setItem('sb-cart-v11', JSON.stringify(cart));
    localStorage.setItem('sb-products-v11', JSON.stringify(products));
    localStorage.setItem('sb-layout-v11', JSON.stringify(layout));
    localStorage.setItem('sb-users-v11', JSON.stringify(registeredUsers));
    localStorage.setItem('sb-theme-v11', theme);
    if (currentUser) {
      localStorage.setItem('sb-current-user-v11', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('sb-current-user-v11');
    }
  }, [cart, products, layout, registeredUsers, currentUser, theme]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = selectedCategory === 'Todos' || p.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchTerm, selectedCategory, products]);

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAdmin(user.role === 'admin');
    
    if (user.role === 'customer') {
      const exists = registeredUsers.find(u => u.id === user.id || u.email === user.email || (u.phone && u.phone === user.phone));
      if (!exists) {
        setRegisteredUsers(prev => [...prev, user]);
      } else {
        setRegisteredUsers(prev => prev.map(u => (u.email === user.email || u.phone === user.phone) ? user : u));
      }
    }
    
    setIsAuthOpen(false);
    setShowAuthReminder(false);
    if (user.role === 'admin') setView('admin');
    else setView('settings');
  };

  const recordOrder = (items: CartItem[]) => {
    if (!currentUser) return;
    const newOrder: Order = {
      id: `SB-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      date: new Date().toISOString(),
      items: items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
      total: items.reduce((acc, i) => acc + (i.price * i.quantity), 0)
    };
    const updatedUser = { ...currentUser, orders: [...(currentUser.orders || []), newOrder] };
    setRegisteredUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    setCart([]);
  };

  const updateSettings = (settings: UserSettings) => {
    setTheme(settings.theme);
    if (currentUser) {
      const updated = { ...currentUser, settings };
      setCurrentUser(updated);
      setRegisteredUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    setView('home');
  };

  const navigateToCategory = (cat: string) => {
    setSelectedCategory(cat);
    setView('category');
    window.scrollTo(0, 0);
  };

  return (
    <div 
      className={`min-h-screen flex flex-col transition-colors duration-500 ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}
      style={{ fontFamily: `'${layout.fontFamily}', sans-serif` }}
    >
      <Navbar 
        brandName={layout.brandName}
        bannerText={layout.bannerText}
        bannerFontSize={layout.bannerFontSize}
        headerBgImage={layout.headerBgImage}
        primaryColor={layout.primaryColor}
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
        isAdmin={isAdmin}
        isLoggedIn={!!currentUser}
        selectedCategory={selectedCategory}
        onCartClick={() => setIsCartOpen(true)}
        onAdminClick={() => isAdmin ? setView('admin') : setIsAuthOpen(true)}
        onSettingsClick={() => setView('settings')}
        onSearch={(term) => setSearchTerm(term)}
        onLogoClick={() => { setView('home'); setSelectedCategory('Todos'); }}
        onCategorySelect={navigateToCategory}
        theme={theme}
      />

      <main className="flex-grow max-w-[1440px] mx-auto px-4 sm:px-10 py-10 w-full">
        {view === 'home' && (
          <div className="space-y-12 animate-in fade-in duration-500 pb-16">
            {/* Hero Section Premium */}
            <div className="relative rounded-[2rem] overflow-hidden h-[450px] sm:h-[650px] shadow-2xl group border border-white/10">
              <img src={layout.heroImage} className="w-full h-full object-cover transition-transform duration-[20s] group-hover:scale-110" alt="Banner" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent flex flex-col justify-center p-8 sm:p-20 text-white">
                <div className="max-w-3xl">
                  <span className="inline-block px-4 py-1.5 rounded-full text-[11px] font-black mb-8 uppercase tracking-[0.3em] backdrop-blur-md bg-white/10 border border-white/20">{layout.heroBadge}</span>
                  <h1 
                    className="font-black mb-8 tracking-tighter leading-[0.95]"
                    style={{ fontSize: `${layout.heroTitleSize}px` }}
                  >
                    {layout.heroTitle}
                  </h1>
                  <p 
                    className="text-white/70 mb-12 max-w-xl font-medium leading-relaxed"
                    style={{ fontSize: `${layout.heroSubtitleSize}px` }}
                  >
                    {layout.heroSubtitle}
                  </p>
                  <button onClick={() => setView('category')} className="bg-white text-black px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-gray-100 hover:scale-105 transition-all">Começar Boladas</button>
                </div>
              </div>
            </div>

            {/* Destaques de Serviço */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: ShieldCheck, title: "Qualidade MZ", desc: "Aparelhos revisados" },
                { icon: Truck, title: "Envios", desc: "Todo o País" },
                { icon: RotateCcw, title: "Confiança", desc: "90 dias Garantia" },
                { icon: Sparkles, title: "Premium", desc: "Só as melhores marcas" }
              ].map((f, i) => (
                <div key={i} className={`p-8 rounded-[2rem] border flex items-center gap-6 transition-all hover:shadow-xl ${theme === 'dark' ? 'bg-slate-800 border-slate-700/50' : 'bg-white border-gray-100 shadow-sm'}`}>
                  <div className="w-14 h-14 rounded-2xl text-white flex items-center justify-center shrink-0 shadow-lg" style={{ backgroundColor: layout.primaryColor }}><f.icon className="w-7 h-7" /></div>
                  <div><h4 className="text-xs font-black uppercase tracking-widest leading-none">{f.title}</h4><p className="text-[11px] text-gray-500 mt-2 font-medium">{f.desc}</p></div>
                </div>
              ))}
            </div>

            {/* Seções Dinâmicas Customizadas */}
            <div className="grid md:grid-cols-2 gap-8">
              {layout.homeSections.map((section) => (
                <div key={section.id} className="relative h-[380px] rounded-[2rem] overflow-hidden group shadow-lg border border-gray-100 dark:border-slate-800">
                  <img src={section.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={section.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10 text-white">
                    <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">{section.title}</h3>
                    <p className="text-sm text-white/70 mb-6 font-medium max-w-xs">{section.subtitle}</p>
                    <button onClick={() => navigateToCategory(section.title.split(' ')[0])} className="w-fit flex items-center gap-3 bg-white text-black px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all">
                      {section.buttonText} <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Grid de Novidades na Home */}
            <div className="space-y-8 pt-8">
              <div className="flex items-center justify-between border-b pb-8 border-gray-100 dark:border-slate-800">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase">Recém Chegados</h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-2">Novos produtos adicionados hoje</p>
                </div>
                <button onClick={() => setView('category')} className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">Ver Todos</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                {filteredProducts.slice(0, 10).map(p => (
                  <ProductCard key={p.id} theme={theme} product={p} onAddToCart={(prod) => {
                    setCart(prev => {
                      const exists = prev.find(i => i.id === prod.id);
                      if (exists) return prev.map(i => i.id === prod.id ? {...i, quantity: i.quantity + 1} : i);
                      return [...prev, {...prod, quantity: 1}];
                    });
                    setIsCartOpen(true);
                  }} onViewDetail={(p) => { setSelectedProduct(p); setView('product-detail'); window.scrollTo(0,0); }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'category' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[60vh]">
             <div className="flex items-center justify-between mb-12 bg-blue-600 text-white p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
               <div className="relative z-10">
                <h1 className="text-5xl font-black tracking-tighter uppercase">{selectedCategory}</h1>
                <p className="text-xs font-bold uppercase tracking-[0.3em] mt-3 opacity-80">{filteredProducts.length} itens encontrados em estoque</p>
               </div>
               <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 bg-white/20 -skew-x-12 translate-x-1/2" />
               <button onClick={() => setView('home')} className="relative z-10 bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-2xl transition-all"><ArrowLeft className="w-6 h-6"/></button>
             </div>

             {filteredProducts.length === 0 ? (
               <div className="text-center py-20">
                 <ShoppingBag className="w-20 h-20 text-gray-200 mx-auto mb-6" />
                 <p className="text-xl font-black text-gray-400 uppercase">Nenhum produto em {selectedCategory} no momento.</p>
                 <button onClick={() => setSelectedCategory('Todos')} className="mt-8 text-blue-600 font-black uppercase tracking-widest">Explorar Outras Categorias</button>
               </div>
             ) : (
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                {filteredProducts.map(p => (
                  <ProductCard key={p.id} theme={theme} product={p} onAddToCart={(prod) => {
                    setCart(prev => {
                      const exists = prev.find(i => i.id === prod.id);
                      if (exists) return prev.map(i => i.id === prod.id ? {...i, quantity: i.quantity + 1} : i);
                      return [...prev, {...prod, quantity: 1}];
                    });
                    setIsCartOpen(true);
                  }} onViewDetail={(p) => { setSelectedProduct(p); setView('product-detail'); window.scrollTo(0,0); }} />
                ))}
              </div>
             )}
          </div>
        )}

        {view === 'settings' && (
          <SettingsView 
            currentUser={currentUser} 
            theme={theme} 
            onUpdateSettings={updateSettings}
            onAuthClick={() => setIsAuthOpen(true)}
            onLogout={handleLogout}
          />
        )}

        {view === 'admin' && isAdmin && (
          <AdminPanel 
            products={products} 
            onAddProduct={(p) => setProducts([p, ...products])} 
            onDeleteProduct={(id) => setProducts(products.filter(p => p.id !== id))} 
            layout={layout} 
            onUpdateLayout={setLayout} 
            onClose={() => setView('home')} 
            registeredUsers={registeredUsers} 
          />
        )}

        {view === 'product-detail' && selectedProduct && (
          <div className={`rounded-[3rem] shadow-2xl overflow-hidden border max-w-6xl mx-auto animate-in zoom-in-95 duration-300 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
            <div className="grid md:grid-cols-2">
              <div className="p-12 flex items-center justify-center bg-gray-50/5 relative">
                <img src={selectedProduct.images[0]} className="max-h-[600px] w-full object-contain rounded-3xl drop-shadow-2xl" alt={selectedProduct.name} />
              </div>
              <div className="p-10 lg:p-24 flex flex-col justify-center">
                 <div className="flex gap-3 mb-8">
                    <span className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest">{selectedProduct.category}</span>
                    <span className="bg-gray-100 dark:bg-slate-700 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest">{selectedProduct.condition}</span>
                 </div>
                 <h1 className="text-5xl font-black mb-8 uppercase leading-[1] tracking-tighter">{selectedProduct.name}</h1>
                 <div className="text-6xl font-black mb-12 tracking-tight">MT {selectedProduct.price.toLocaleString('pt-PT')}</div>
                 <p className="text-gray-500 dark:text-slate-400 text-lg mb-16 font-medium leading-relaxed">{selectedProduct.description}</p>
                 <div className="flex gap-6">
                   <button onClick={() => {
                      setCart(prev => {
                        const exists = prev.find(i => i.id === selectedProduct.id);
                        if (exists) return prev.map(i => i.id === selectedProduct.id ? {...i, quantity: i.quantity + 1} : i);
                        return [...prev, {...selectedProduct, quantity: 1}];
                      });
                      setIsCartOpen(true);
                   }} className="flex-[2] text-white py-6 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:brightness-110 active:scale-95 transition-all" style={{ backgroundColor: layout.primaryColor }}>Adicionar ao Carrinho</button>
                   <button onClick={() => setView('home')} className="flex-1 py-6 border border-gray-200 dark:border-slate-700 text-gray-400 font-black rounded-2xl text-[10px] uppercase tracking-widest">Voltar</button>
                 </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart} 
        onRemove={(id) => setCart(prev => prev.filter(i => i.id !== id))} 
        onUpdateQty={(id, delta) => setCart(prev => prev.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + delta)} : i))} 
        whatsappNumber={layout.whatsappNumber} 
        currentUser={currentUser} 
        onRegister={handleAuthSuccess} 
        onCheckoutSuccess={recordOrder} 
        theme={theme}
        onRequestLogin={() => {
          setIsCartOpen(false);
          setShowAuthReminder(true);
        }}
      />

      {isAuthOpen && (
        <AuthModal 
          onClose={() => setIsAuthOpen(false)} 
          onSuccess={handleAuthSuccess} 
          registeredUsers={registeredUsers}
          theme={theme}
        />
      )}

      {/* Reminder de Autenticação Centralizado */}
      {showAuthReminder && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowAuthReminder(false)} />
          <div className={`relative w-full max-w-sm p-10 rounded-[3rem] shadow-2xl text-center animate-in zoom-in-95 duration-300 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-100'}`}>
             <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <AlertCircle className="w-10 h-10 text-blue-600" />
             </div>
             <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Autenticação Necessária</h3>
             <p className="text-sm text-gray-400 font-medium mb-10 leading-relaxed">Para garantir a segurança da sua bolada e registar o seu histórico, por favor identifique-se antes de finalizar.</p>
             <div className="space-y-4">
                <button 
                  onClick={() => { setShowAuthReminder(false); setIsAuthOpen(true); }}
                  className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:brightness-110 active:scale-95 transition-all"
                >
                  Entrar ou Registar
                </button>
                <button 
                  onClick={() => setShowAuthReminder(false)}
                  className="w-full py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
                >
                  Continuar a Explorar
                </button>
             </div>
          </div>
        </div>
      )}

      <footer className={`py-16 border-t mt-20 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-10 grid md:grid-cols-3 gap-12 text-center md:text-left">
          <div className="space-y-6">
            <h4 className="text-2xl font-black uppercase tracking-tighter" style={{ color: layout.primaryColor }}>{layout.brandName}</h4>
            <p className="text-xs text-gray-400 font-medium leading-relaxed uppercase tracking-widest">A melhor loja de eletrônicos usados de Moçambique. Qualidade técnica e preços imbatíveis em Maputo.</p>
          </div>
          <div className="space-y-4">
            <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Categorias Rápidas</h5>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              {CATEGORIES.slice(1, 5).map(c => (
                <button key={c} onClick={() => navigateToCategory(c)} className="text-[9px] font-black uppercase tracking-widest hover:text-blue-600 transition-colors">{c}</button>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end justify-center">
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">© {new Date().getFullYear()} PREMIUM MZ</p>
             <div className="mt-4 flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-800" />
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-800" />
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-800" />
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
