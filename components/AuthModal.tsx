
import React, { useState } from 'react';
import { X, Shield, Mail, Phone, ArrowRight, Lock, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: User) => void;
  registeredUsers: User[];
  theme: 'light' | 'dark';
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess, registeredUsers, theme }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    identifier: '', // email or phone
    password: ''
  });
  const [error, setError] = useState('');

  const ADMIN_EMAIL = 'soboladas52@gmail.com';
  const ADMIN_PASS = 'CDE2007#';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const { identifier, password, name } = formData;

    // Verificação Admin Global
    if (identifier.toLowerCase() === ADMIN_EMAIL) {
      if (password === ADMIN_PASS) {
        onSuccess({
          id: 'ADMIN',
          fullName: 'Administrador Só Boladas',
          email: ADMIN_EMAIL,
          phone: '',
          role: 'admin',
          createdAt: new Date().toISOString(),
          settings: { theme: 'light', language: 'pt', notifications: true }
        });
      } else {
        setError('Palavra-passe de administrador incorreta.');
      }
      return;
    }

    // Fluxo Cliente Individual
    if (isLogin) {
      const user = registeredUsers.find(u => 
        (u.email === identifier || u.phone === identifier) && 
        u.password === password
      );
      
      if (user) {
        onSuccess(user);
      } else {
        setError('Dados de acesso não encontrados. Verifique ou registe-se.');
      }
    } else {
      if (!name || !identifier || !password) {
        setError('Todos os campos são obrigatórios para registo.');
        return;
      }
      const exists = registeredUsers.find(u => u.email === identifier || u.phone === identifier);
      if (exists) {
        setError('Este e-mail/telefone já está registado.');
        return;
      }

      const newUser: User = {
        id: Date.now().toString(),
        fullName: name,
        email: identifier.includes('@') ? identifier : '',
        phone: !identifier.includes('@') ? identifier : '',
        password: password,
        role: 'customer',
        createdAt: new Date().toISOString(),
        orders: [],
        settings: { theme: 'light', language: 'pt', notifications: true }
      };
      onSuccess(newUser);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className={`relative w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-100'}`}>
        <div className="p-10">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter">{isLogin ? 'Login Só Boladas' : 'Novo Perfil'}</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Sua conta individual premium</p>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"><X className="w-6 h-6 text-gray-400" /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome Completo</label>
                <div className="relative">
                  <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input 
                    type="text" 
                    required
                    className={`w-full pl-14 pr-5 py-5 rounded-2xl text-sm font-bold border outline-none transition-all ${theme === 'dark' ? 'bg-slate-900 border-slate-700 focus:border-blue-500' : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-blue-500'}`}
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">E-mail ou Telefone</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input 
                  type="text" 
                  required
                  className={`w-full pl-14 pr-5 py-5 rounded-2xl text-sm font-bold border outline-none transition-all ${theme === 'dark' ? 'bg-slate-900 border-slate-700 focus:border-blue-500' : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-blue-500'}`}
                  placeholder="Ex: soboladas52@gmail.com"
                  value={formData.identifier}
                  onChange={(e) => setFormData({...formData, identifier: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Palavra-passe</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input 
                  type="password" 
                  required
                  className={`w-full pl-14 pr-5 py-5 rounded-2xl text-sm font-bold border outline-none transition-all ${theme === 'dark' ? 'bg-slate-900 border-slate-700 focus:border-blue-500' : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-blue-500'}`}
                  placeholder="********"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-bold text-red-500 uppercase text-center">{error}</div>}

            <button type="submit" className="w-full bg-slate-900 dark:bg-blue-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:brightness-110 active:scale-95 transition-all">
              {isLogin ? 'Entrar Agora' : 'Criar Perfil'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-blue-500 transition-colors"
            >
              {isLogin ? 'Não tem conta? Crie o seu perfil' : 'Já tem um perfil? Faça Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
