
import React from 'react';
import { User, UserSettings } from '../types';
import { History, Moon, Sun, Globe, Bell, LogOut, ChevronRight, ShoppingBag, ShieldCheck } from 'lucide-react';

interface SettingsViewProps {
  currentUser: User | null;
  theme: 'light' | 'dark';
  onUpdateSettings: (s: UserSettings) => void;
  onAuthClick: () => void;
  onLogout: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ currentUser, theme, onUpdateSettings, onAuthClick, onLogout }) => {
  const settings: UserSettings = currentUser?.settings || { theme, language: 'pt', notifications: true };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-gray-100 dark:border-slate-800 pb-10 gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">A Minha Conta</h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-4">
            {currentUser ? `Bem-vindo de volta, ${currentUser.fullName}` : 'Faça login para gerir o seu perfil'}
          </p>
        </div>
        {currentUser && (
          <button onClick={onLogout} className="text-red-500 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:underline bg-red-50 dark:bg-red-500/10 px-4 py-2 rounded-lg">
            <LogOut className="w-4 h-4" /> Terminar Sessão
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Painel de Preferências */}
        <div className={`lg:col-span-2 p-10 rounded-[2.5rem] border transition-all ${theme === 'dark' ? 'bg-slate-800 border-slate-700/50' : 'bg-white border-gray-100 shadow-xl'}`}>
          <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-10">Preferências do Site</h3>
          
          <div className="space-y-10">
            {/* Tema */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${theme === 'dark' ? 'bg-slate-900 text-yellow-400' : 'bg-gray-100 text-slate-400'}`}>
                  {theme === 'dark' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-widest">Tema Visual</p>
                  <p className="text-xs text-gray-500 font-medium mt-1">Alternar entre claro ou escuro</p>
                </div>
              </div>
              <button 
                onClick={() => onUpdateSettings({...settings, theme: theme === 'light' ? 'dark' : 'light'})}
                className={`w-16 h-8 rounded-full relative transition-all duration-300 ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1.5 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-300 ${theme === 'dark' ? 'left-9' : 'left-2'}`} />
              </button>
            </div>

            {/* Idioma */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-100'}`}>
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-widest">Idioma</p>
                  <p className="text-xs text-gray-500 font-medium mt-1">Português ou Inglês</p>
                </div>
              </div>
              <select 
                value={settings.language}
                onChange={(e) => onUpdateSettings({...settings, language: e.target.value as 'pt' | 'en'})}
                className={`bg-transparent text-[10px] font-black uppercase border-none focus:ring-0 cursor-pointer ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
              >
                <option value="pt">Português (MZ)</option>
                <option value="en">English (US)</option>
              </select>
            </div>

            {/* Notificações */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-100'}`}>
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-widest">Notificações</p>
                  <p className="text-xs text-gray-500 font-medium mt-1">Alertas de novas boladas no site</p>
                </div>
              </div>
              <button 
                onClick={() => onUpdateSettings({...settings, notifications: !settings.notifications})}
                className={`w-16 h-8 rounded-full relative transition-all duration-300 ${settings.notifications ? 'bg-green-500' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1.5 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-300 ${settings.notifications ? 'left-9' : 'left-2'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Histórico Individual */}
        <div className={`p-10 rounded-[2.5rem] border flex flex-col ${theme === 'dark' ? 'bg-slate-800 border-slate-700/50' : 'bg-white border-gray-100 shadow-xl'}`}>
          <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-10">Histórico Pessoal</h3>
          
          {!currentUser ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 bg-gray-50 dark:bg-slate-900 rounded-full flex items-center justify-center">
                <History className="w-8 h-8 text-gray-200" />
              </div>
              <p className="text-xs text-gray-500 font-medium max-w-[220px]">Faça login para aceder livremente ao seu histórico e conta pessoal.</p>
              <button onClick={onAuthClick} className="w-full bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl">Entrar ou Registar</button>
            </div>
          ) : (
            <div className="space-y-4 flex-1 overflow-y-auto max-h-[450px] pr-2 custom-scroll">
              {(!currentUser.orders || currentUser.orders.length === 0) ? (
                <div className="text-center py-16">
                   <ShoppingBag className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                   <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Ainda não fez boladas.</p>
                </div>
              ) : (
                currentUser.orders.map(order => (
                  <div key={order.id} className="p-6 rounded-2xl border border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50 flex items-center justify-between group hover:border-blue-500 transition-all cursor-pointer">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{new Date(order.date).toLocaleDateString()}</p>
                      <p className="text-sm font-black uppercase tracking-tighter">Pedido #{order.id.slice(-5)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black">MT {order.total.toLocaleString('pt-PT')}</p>
                      <div className="flex items-center gap-1 justify-end text-[8px] font-black text-green-500 uppercase mt-1">
                         <ShieldCheck className="w-3 h-3" /> Concluído
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
