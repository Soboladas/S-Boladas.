
import React, { useState, useMemo } from 'react';
import { X, Plus, Trash2, Box, Save, Phone, Layers, Palette, Users, Upload, Image as ImageIcon, Search, ChevronDown, ChevronUp, Type, Sliders, Sparkles } from 'lucide-react';
import { Product, LayoutSettings, HomeSection, User } from '../types';
import { CATEGORIES } from '../constants';

interface AdminPanelProps {
  products: Product[];
  onAddProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  layout: LayoutSettings;
  onUpdateLayout: (l: LayoutSettings) => void;
  onClose: () => void;
  registeredUsers: User[];
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  products, 
  onAddProduct, 
  onDeleteProduct, 
  layout, 
  onUpdateLayout, 
  onClose,
  registeredUsers
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'layout' | 'sections' | 'customers'>('products');
  const [customerSearch, setCustomerSearch] = useState('');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const [newProd, setNewProd] = useState<Partial<Product>>({
    name: '',
    price: 0,
    originalPrice: 0,
    category: 'Smartphones',
    condition: 'Excelente',
    description: '',
    images: [],
    rating: 5,
    reviewsCount: 0
  });

  const [tempLayout, setTempLayout] = useState<LayoutSettings>({...layout});

  const filteredUsers = useMemo(() => {
    const term = customerSearch.toLowerCase();
    return registeredUsers.filter(u => 
      u.fullName.toLowerCase().includes(term) || 
      u.phone.includes(term) || 
      (u.email && u.email.toLowerCase().includes(term))
    );
  }, [customerSearch, registeredUsers]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          setNewProd(prev => ({
            ...prev,
            images: [...(prev.images || []), base64]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price || !newProd.images || newProd.images.length === 0) {
      alert('Preencha os dados e adicione pelo menos uma imagem!');
      return;
    }
    onAddProduct({
      ...newProd as Product,
      id: Date.now().toString()
    });
    setNewProd({
      name: '',
      price: 0,
      originalPrice: 0,
      category: 'Smartphones',
      condition: 'Excelente',
      description: '',
      images: [],
      rating: 5,
      reviewsCount: 0
    });
    alert('Produto adicionado ao estoque!');
  };

  const handleAddSection = () => {
    const newSection: HomeSection = {
      id: Date.now().toString(),
      title: 'Nova Seção',
      subtitle: 'Subtítulo do bloco.',
      imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
      buttonText: 'Ver Agora'
    };
    setTempLayout({ ...tempLayout, homeSections: [...tempLayout.homeSections, newSection] });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-6xl h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden text-slate-900">
        
        <div className="p-8 border-b flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">Painel de Controlo</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Gestão Central Só Boladas MZ</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="flex bg-white border-b sticky top-0 z-10 overflow-x-auto no-scrollbar">
          {[
            { id: 'products', label: 'Estoque', icon: Box },
            { id: 'customers', label: 'Clientes', icon: Users },
            { id: 'sections', label: 'Seções Home', icon: Layers },
            { id: 'layout', label: 'Aparência', icon: Palette },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-5 px-8 text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 border-b-2 transition-all ${activeTab === tab.id ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-10 bg-white">
          {activeTab === 'products' && (
            <div className="grid lg:grid-cols-5 gap-10">
              <form onSubmit={handleAddProduct} className="lg:col-span-2 space-y-6 bg-gray-50 p-8 rounded-3xl border border-gray-100 h-fit">
                <h3 className="font-black text-xs uppercase tracking-widest text-gray-700 flex items-center gap-2 border-b pb-4"><Plus className="w-4 h-4" /> Novo Artigo</h3>
                <input type="text" placeholder="Nome do Produto" className="w-full p-4 text-sm font-bold border rounded-2xl outline-none focus:border-blue-500" value={newProd.name} onChange={e => setNewProd({...newProd, name: e.target.value})} required />
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" placeholder="MT Preço" className="p-4 text-sm font-bold border rounded-2xl outline-none focus:border-blue-500" onChange={e => setNewProd({...newProd, price: Number(e.target.value)})} required />
                  <input type="number" placeholder="MT De" className="p-4 text-sm font-bold border rounded-2xl outline-none focus:border-blue-500" onChange={e => setNewProd({...newProd, originalPrice: Number(e.target.value)})} />
                </div>
                <select className="w-full p-4 text-sm font-bold border rounded-2xl outline-none" value={newProd.category} onChange={e => setNewProd({...newProd, category: e.target.value})}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <textarea placeholder="Ficha Técnica" className="w-full p-4 text-sm font-bold border rounded-2xl h-32 outline-none focus:border-blue-500" value={newProd.description} onChange={e => setNewProd({...newProd, description: e.target.value})} />
                
                <label className="block border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center cursor-pointer hover:bg-white transition-all group">
                   <Upload className="w-8 h-8 text-gray-300 mx-auto group-hover:text-blue-500 transition-colors" />
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-4">Fotos do Produto</p>
                   <input type="file" className="hidden" multiple accept="image/*" onChange={handleProductImageUpload} />
                </label>

                <button type="submit" className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl hover:brightness-110 transition-all uppercase tracking-widest text-xs">Adicionar ao Estoque</button>
              </form>

              <div className="lg:col-span-3 space-y-6">
                <h3 className="font-black text-xs uppercase tracking-widest text-gray-700 border-b pb-4 flex justify-between">Artigos em Loja <span>({products.length})</span></h3>
                <div className="grid gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scroll">
                  {products.map(p => (
                    <div key={p.id} className="flex items-center gap-5 p-4 bg-white border border-gray-100 rounded-2xl hover:border-blue-500 transition-all group">
                      <img src={p.images?.[0] || ''} className="w-16 h-16 rounded-xl object-cover border" alt={p.name} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-gray-900 truncate uppercase tracking-tight">{p.name}</p>
                        <p className="text-xs font-black text-blue-600 mt-1">MT {p.price.toLocaleString('pt-PT')}</p>
                      </div>
                      <button onClick={() => onDeleteProduct(p.id)} className="p-3 text-gray-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-xs uppercase tracking-widest text-gray-700 flex items-center gap-2"><Users className="w-5 h-5" /> Base de Clientes</h3>
                <div className="relative w-72">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                   <input type="text" placeholder="Filtrar clientes..." className="w-full pl-11 pr-5 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none" value={customerSearch} onChange={(e) => setCustomerSearch(e.target.value)} />
                </div>
              </div>

              <div className="border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-8 py-5 font-black text-[10px] uppercase tracking-widest text-gray-400 pr-0">Cliente</th>
                      <th className="px-8 py-5 font-black text-[10px] uppercase tracking-widest text-gray-400">Contacto</th>
                      <th className="px-8 py-5 font-black text-[10px] uppercase tracking-widest text-gray-400 text-center">Boladas</th>
                      <th className="px-8 py-5 font-black text-[10px] uppercase tracking-widest text-gray-400 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredUsers.map(user => (
                      <React.Fragment key={user.id}>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                                {user.fullName.charAt(0)}
                              </div>
                              <div>
                                <p className="font-black text-gray-900 uppercase tracking-tight">{user.fullName}</p>
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{user.email || 'Identificado por Telefone'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2 text-gray-600 font-bold">
                              <Phone className="w-4 h-4 opacity-40" />
                              {user.phone}
                            </div>
                          </td>
                          <td className="px-8 py-6 text-center">
                             <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black">{user.orders?.length || 0}</span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <button 
                              onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                              className="text-[10px] font-black text-gray-400 hover:text-blue-600 uppercase tracking-widest flex items-center gap-2 ml-auto"
                            >
                              {expandedUser === user.id ? <><ChevronUp className="w-4 h-4" /> Fechar</> : <><ChevronDown className="w-4 h-4" /> Histórico</>}
                            </button>
                          </td>
                        </tr>
                        {expandedUser === user.id && (
                          <tr className="bg-gray-50/50">
                            <td colSpan={4} className="px-12 py-8">
                               <div className="grid gap-4">
                                  {user.orders?.map(order => (
                                    <div key={order.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm">
                                      <div>
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{new Date(order.date).toLocaleDateString()}</p>
                                        <p className="text-sm font-black">ID {order.id}</p>
                                        <div className="flex gap-2 mt-2">
                                          {order.items.map((i,idx) => <span key={idx} className="text-[9px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded border">{i.quantity}x {i.name}</span>)}
                                        </div>
                                      </div>
                                      <p className="text-lg font-black">MT {order.total.toLocaleString('pt-PT')}</p>
                                    </div>
                                  ))}
                                  {(!user.orders || user.orders.length === 0) && <p className="text-center text-[10px] font-bold text-gray-400 uppercase">Sem pedidos realizados ainda.</p>}
                               </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'layout' && (
            <div className="max-w-4xl mx-auto space-y-10">
              <div className="bg-gray-50 p-10 rounded-[2.5rem] border space-y-8">
                <h3 className="font-black text-xs text-gray-700 uppercase tracking-widest flex items-center gap-2 border-b pb-6"><Palette className="w-5 h-5 text-blue-500" /> Identidade Visual e Fontes</h3>
                
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest">Marca</label>
                      <input type="text" className="w-full p-4 border rounded-2xl font-black text-sm outline-none" value={tempLayout.brandName} onChange={e => setTempLayout({...tempLayout, brandName: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest">WhatsApp MZ</label>
                      <input type="text" className="w-full p-4 border rounded-2xl font-bold text-sm outline-none" value={tempLayout.whatsappNumber} onChange={e => setTempLayout({...tempLayout, whatsappNumber: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest">Fonte Global</label>
                      <select className="w-full p-4 border rounded-2xl font-black text-sm outline-none" value={tempLayout.fontFamily} onChange={e => setTempLayout({...tempLayout, fontFamily: e.target.value as any})}>
                        <option value="Inter">Inter (Padrão)</option>
                        <option value="Poppins">Poppins</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Lexend">Lexend</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest">Imagem de Fundo Cabeçalho (Header)</label>
                      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center cursor-pointer hover:bg-white transition-all">
                        {tempLayout.headerBgImage ? (
                          <div className="relative h-24 rounded-lg overflow-hidden group">
                            <img src={tempLayout.headerBgImage} className="w-full h-full object-cover" />
                            <button onClick={() => setTempLayout({...tempLayout, headerBgImage: ''})} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center h-24 gap-2 text-gray-300">
                             <ImageIcon className="w-6 h-6" />
                             <span className="text-[8px] font-black uppercase">Fundo do Header</span>
                             <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (b) => setTempLayout({...tempLayout, headerBgImage: b}))} />
                          </label>
                        )}
                      </div>
                    </div>
                    <div>
                       <label className="block text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest">Cor Principal (Accent)</label>
                       <div className="flex gap-4">
                        <input type="color" className="w-16 h-14 rounded-2xl cursor-pointer border p-1" value={tempLayout.primaryColor} onChange={e => setTempLayout({...tempLayout, primaryColor: e.target.value})} />
                        <div className="flex-1 flex items-center px-4 bg-white rounded-2xl border text-xs font-bold">{tempLayout.primaryColor}</div>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 border-t pt-8">
                  <h4 className="font-black text-[10px] text-blue-600 uppercase tracking-[0.3em] mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4" /> Destaque Principal (Hero)</h4>
                  
                  <div className="grid lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest">Título do Hero</label>
                        <input type="text" className="w-full p-4 border rounded-2xl text-sm font-black outline-none" value={tempLayout.heroTitle} onChange={e => setTempLayout({...tempLayout, heroTitle: e.target.value})} />
                        <div className="mt-4">
                          <label className="flex justify-between text-[8px] font-black text-gray-400 uppercase mb-2">Tamanho Título: <span>{tempLayout.heroTitleSize}px</span></label>
                          <input type="range" min="24" max="96" className="w-full accent-blue-600" value={tempLayout.heroTitleSize} onChange={e => setTempLayout({...tempLayout, heroTitleSize: Number(e.target.value)})} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest">Subtítulo do Hero</label>
                        <textarea className="w-full p-4 border rounded-2xl text-xs font-medium outline-none h-24" value={tempLayout.heroSubtitle} onChange={e => setTempLayout({...tempLayout, heroSubtitle: e.target.value})} />
                        <div className="mt-4">
                          <label className="flex justify-between text-[8px] font-black text-gray-400 uppercase mb-2">Tamanho Subtítulo: <span>{tempLayout.heroSubtitleSize}px</span></label>
                          <input type="range" min="12" max="32" className="w-full accent-blue-600" value={tempLayout.heroSubtitleSize} onChange={e => setTempLayout({...tempLayout, heroSubtitleSize: Number(e.target.value)})} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                       <label className="block text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest">Imagem Principal do Home (Hero Image)</label>
                       <div className="aspect-video bg-gray-100 rounded-[2rem] border-2 border-dashed border-gray-200 overflow-hidden relative group/hero">
                         <img src={tempLayout.heroImage} className="w-full h-full object-cover" alt="Hero Preview" />
                         <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover/hero:opacity-100 transition-opacity cursor-pointer text-white">
                           <Upload className="w-8 h-8 mb-2" />
                           <span className="text-[10px] font-black uppercase tracking-widest">Alterar Imagem Hero</span>
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (b) => setTempLayout({...tempLayout, heroImage: b}))} />
                         </label>
                       </div>
                       <div className="space-y-4">
                         <div>
                           <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Badge (Etiqueta superior)</label>
                           <input type="text" className="w-full p-3 border rounded-xl text-[10px] font-black uppercase outline-none" value={tempLayout.heroBadge} onChange={e => setTempLayout({...tempLayout, heroBadge: e.target.value})} />
                         </div>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 border-t pt-8">
                  <h4 className="font-black text-[10px] text-blue-600 uppercase tracking-[0.3em] mb-4 flex items-center gap-2"><Type className="w-4 h-4" /> Informações do Site</h4>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest">Barra Informativa (Topo)</label>
                      <input type="text" className="w-full p-4 border rounded-2xl text-xs font-bold outline-none" value={tempLayout.bannerText} onChange={e => setTempLayout({...tempLayout, bannerText: e.target.value})} />
                      <div className="mt-4">
                        <label className="flex justify-between text-[8px] font-black text-gray-400 uppercase mb-2">Tamanho Fonte Banner: <span>{tempLayout.bannerFontSize}px</span></label>
                        <input type="range" min="8" max="24" className="w-full accent-blue-600" value={tempLayout.bannerFontSize} onChange={e => setTempLayout({...tempLayout, bannerFontSize: Number(e.target.value)})} />
                      </div>
                    </div>
                  </div>
                </div>

                <button onClick={() => { onUpdateLayout(tempLayout); alert('Configurações salvas com sucesso!'); }} className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl text-xs uppercase tracking-widest"><Save className="w-4 h-4" /> Salvar Todas as Alterações</button>
              </div>
            </div>
          )}

          {activeTab === 'sections' && (
            <div className="max-w-4xl mx-auto space-y-10">
              <div className="flex items-center justify-between border-b pb-8">
                <h3 className="font-black text-xs text-gray-700 uppercase tracking-widest flex items-center gap-2"><Layers className="w-5 h-5 text-blue-500" /> Banners e Seções Home</h3>
                <button onClick={handleAddSection} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black text-[10px] flex items-center gap-2 hover:brightness-110 transition-all uppercase tracking-widest shadow-lg"><Plus className="w-4 h-4" /> Adicionar Bloco</button>
              </div>

              <div className="grid gap-10">
                {tempLayout.homeSections.map((s) => (
                  <div key={s.id} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl relative group">
                    <button onClick={() => setTempLayout({ ...tempLayout, homeSections: tempLayout.homeSections.filter(sec => sec.id !== s.id) })} className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all shadow-xl z-10"><X className="w-4 h-4" /></button>
                    <div className="grid lg:grid-cols-2 gap-10">
                      <div className="space-y-6">
                        <input type="text" className="w-full p-4 border rounded-2xl font-black text-sm uppercase outline-none" value={s.title} placeholder="Título do Bloco" onChange={e => setTempLayout({ ...tempLayout, homeSections: tempLayout.homeSections.map(sec => sec.id === s.id ? { ...sec, title: e.target.value } : sec) })} />
                        <textarea className="w-full p-4 border rounded-2xl h-32 text-xs font-medium text-gray-600 outline-none" value={s.subtitle} placeholder="Subtítulo descritivo" onChange={e => setTempLayout({ ...tempLayout, homeSections: tempLayout.homeSections.map(sec => sec.id === s.id ? { ...sec, subtitle: e.target.value } : sec) })} />
                        <input type="text" className="w-full p-4 border rounded-2xl text-[10px] font-black uppercase outline-none" value={s.buttonText} placeholder="Texto do Botão" onChange={e => setTempLayout({ ...tempLayout, homeSections: tempLayout.homeSections.map(sec => sec.id === s.id ? { ...sec, buttonText: e.target.value } : sec) })} />
                      </div>
                      <div className="aspect-video bg-gray-50 rounded-[2rem] overflow-hidden border relative group/img">
                        <img src={s.imageUrl} className="w-full h-full object-cover" alt="" />
                        <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover/img:opacity-100 cursor-pointer transition-opacity text-white font-black text-[10px] uppercase tracking-[0.2em] gap-3">
                          <Upload className="w-6 h-6" /> Trocar Imagem
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (base64) => setTempLayout({ ...tempLayout, homeSections: tempLayout.homeSections.map(sec => sec.id === s.id ? { ...sec, imageUrl: base64 } : sec) }))} />
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {tempLayout.homeSections.length > 0 && (
                <button onClick={() => { onUpdateLayout(tempLayout); alert('Home atualizada!'); }} className="w-full bg-blue-600 text-white font-black py-6 rounded-3xl flex items-center justify-center gap-3 hover:brightness-110 transition-all shadow-2xl text-xs uppercase tracking-[0.3em]"><Save className="w-5 h-5" /> Salvar Conteúdo da Home</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
