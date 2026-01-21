
import React from 'react';
import { X, Trash2, MessageCircle, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { CartItem, User } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
  whatsappNumber: string;
  currentUser: User | null;
  onRegister: (user: User) => void;
  onCheckoutSuccess?: (items: CartItem[]) => void;
  onRequestLogin: () => void;
  theme: 'light' | 'dark';
}

const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onRemove, 
  onUpdateQty, 
  whatsappNumber,
  currentUser,
  onCheckoutSuccess,
  onRequestLogin,
  theme
}) => {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (items.length === 0) return;
    
    if (!currentUser) {
      onRequestLogin();
      return;
    }

    const message = encodeURIComponent(
      `Olá! Gostaria de finalizar o pedido na Só Boladas (Moçambique):\n\n` +
      `Cliente: ${currentUser.fullName}\n` +
      `Contacto: ${currentUser.phone || currentUser.email}\n\n` +
      `Itens:\n` +
      items.map(item => `- ${item.name} (${item.quantity}x) - MT ${item.price.toLocaleString('pt-PT')}`).join('\n') +
      `\n\n*Total: MT ${subtotal.toLocaleString('pt-PT')}*\n\nComo posso proceder com o pagamento?`
    );

    if (onCheckoutSuccess) {
      onCheckoutSuccess(items);
    }
    
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className={`w-screen max-w-md shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 border-l ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-100'}`}>
          
          <div className="flex-1 overflow-y-auto py-8 px-6 sm:px-10">
            <div className="flex items-start justify-between border-b border-gray-100 dark:border-slate-700 pb-6">
              <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">O Meu Carrinho</h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Stock em Maputo</p>
              </div>
              <button onClick={onClose} className="p-3 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mt-10">
              {items.length === 0 ? (
                <div className="text-center py-24 flex flex-col items-center">
                  <ShoppingCart className="w-16 h-16 text-gray-100 dark:text-slate-700 mx-auto mb-6" />
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">O carrinho está vazio</p>
                </div>
              ) : (
                <ul className="space-y-6">
                  {items.map((item) => (
                    <li key={item.id} className="flex items-center gap-5 p-4 rounded-2xl bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700 group transition-all hover:border-blue-500">
                      <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-gray-100 dark:border-slate-800 shadow-sm">
                        <img src={item.images?.[0] || ''} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xs font-black text-gray-900 dark:text-white truncate uppercase tracking-tight pr-4">{item.name}</h3>
                          <button onClick={() => onRemove(item.id)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        <div className="flex justify-between items-end">
                           <p className="text-xs font-black text-blue-600">MT {item.price.toLocaleString('pt-PT')}</p>
                           <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700 overflow-hidden shadow-sm">
                            <button onClick={() => onUpdateQty(item.id, -1)} className="px-3 py-1 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">-</button>
                            <span className="px-4 font-black text-[10px]">{item.quantity}</span>
                            <button onClick={() => onUpdateQty(item.id, 1)} className="px-3 py-1 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">+</button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {currentUser && items.length > 0 && (
                <div className="mt-10 p-5 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-4 shadow-sm">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  <div>
                    <p className="text-[10px] font-black text-green-500 uppercase tracking-widest leading-none mb-1">Pronto para Finalizar</p>
                    <p className="text-sm font-black text-green-900 dark:text-green-400">{currentUser.fullName}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={`border-t py-10 px-8 sm:px-12 ${theme === 'dark' ? 'border-slate-700 bg-slate-900/50' : 'border-gray-100 bg-gray-50/80'}`}>
            <div className="flex justify-between text-base font-black text-gray-900 dark:text-white mb-10">
              <p className="uppercase tracking-[0.3em] text-[10px] text-gray-400">Total de Boladas</p>
              <p className="text-2xl tracking-tighter">MT {subtotal.toLocaleString('pt-PT')}</p>
            </div>
            <button
              onClick={handleCheckout}
              disabled={items.length === 0}
              className={`w-full flex items-center justify-center gap-4 px-8 py-6 rounded-[2rem] shadow-2xl text-xs font-black text-white transition-all transform active:scale-95 uppercase tracking-[0.2em] ${
                items.length > 0 
                ? 'bg-green-600 hover:bg-green-700 hover:shadow-green-900/20' 
                : 'bg-gray-300 dark:bg-slate-700 cursor-not-allowed opacity-50 text-gray-500'
              }`}
            >
              <MessageCircle className="w-6 h-6" />
              {currentUser ? 'Finalizar no WhatsApp' : 'Identificar para Comprar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
