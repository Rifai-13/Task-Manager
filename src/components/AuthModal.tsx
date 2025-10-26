
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { X, Eye, EyeOff, User, Mail, Lock, Calendar, Check } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  defaultMode = 'register' 
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { signUp, signIn } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
    }
  }, [isOpen, defaultMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let result;
      if (mode === 'register') {
        result = await signUp(email, password, fullName);
      } else {
        result = await signIn(email, password);
      }

      if (result.error) throw result.error;
      
      onClose();
      resetForm();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setError(null);
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError(null);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-md relative my-8 shadow-2xl border border-white/20">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl"
        >
          <X size={20} />
        </button>

        {/* Header dengan gradient yang menarik */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white rounded-t-2xl">
          <div className="flex items-center justify-center mb-3">
            <div className="bg-white/20 p-3 rounded-2xl mr-3">
              <Calendar size={28} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              TaskFlow
            </h1>
          </div>
          <p className="text-blue-100 text-center text-lg font-medium">
            {mode === 'register' 
              ? 'Mulai Perjalanan Produktif Anda' 
              : 'Selamat Datang Kembali!'}
          </p>
        </div>

        <div className="p-8">
          {/* Mode Toggle yang stylish */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-1 border border-blue-100">
              <button
                onClick={() => setMode('login')}
                className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  mode === 'login'
                    ? 'bg-white text-blue-600 shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Masuk
              </button>
              <button
                onClick={() => setMode('register')}
                className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  mode === 'register'
                    ? 'bg-white text-blue-600 shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Daftar
              </button>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {mode === 'register' ? 'Buat Akun Baru' : 'Masuk ke Akun'}
            </h2>
            <p className="text-gray-600">
              {mode === 'register' 
                ? 'Bergabung dengan ribuan pengguna produktif' 
                : 'Lanjutkan produktivitas Anda'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 animate-pulse">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <X size={20} className="text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'register' && (
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={20} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-12 py-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    placeholder="Masukkan nama lengkap Anda"
                    required
                  />
                </div>
              </div>
            )}

            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Alamat Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={20} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-12 py-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  placeholder="email@contoh.com"
                  required
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-12 py-4 pr-12 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  placeholder="Minimal 6 karakter"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors p-1 rounded-lg hover:bg-blue-50"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="flex items-center mt-2">
                <div className={`w-3 h-3 rounded-full mr-2 ${password.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`}>
                  {password.length >= 6 && <Check size={12} className="text-white" />}
                </div>
                <span className={`text-xs ${password.length >= 6 ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                  Minimal 6 karakter
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] font-bold text-lg shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  {mode === 'register' ? 'Membuat Akun...' : 'Masuk...'}
                </div>
              ) : (
                mode === 'register' ? '🚀 Buat Akun Sekarang' : '🔑 Masuk ke Akun'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  {mode === 'register' ? 'Sudah punya akun?' : 'Belum punya akun?'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={switchMode}
              className="mt-4 text-blue-600 hover:text-blue-800 font-bold text-lg transition-colors duration-300 transform hover:scale-105"
            >
              {mode === 'register' ? '📝 Masuk di Sini' : '🎉 Daftar di Sini'}
            </button>
          </div>

          {mode === 'register' && (
            <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
              <p className="text-xs text-gray-600 text-center">
                Dengan mendaftar, Anda menyetujui{' '}
                <button className="text-blue-600 hover:text-blue-800 font-semibold underline">Syarat & Ketentuan</button>{' '}
                dan{' '}
                <button className="text-blue-600 hover:text-blue-800 font-semibold underline">Kebijakan Privasi</button>{' '}
                kami
              </p>
            </div>
          )}
        </div>

        {/* Footer dengan gradient */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-4 border-t border-gray-200 rounded-b-2xl">
          <div className="flex items-center justify-center text-gray-500 text-sm">
            <span>✨ TaskFlow - Tingkatkan Produktivitas Anda</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;