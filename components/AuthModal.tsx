import React, { useState, useEffect } from 'react';
import CloseIcon from './icons/CloseIcon';
import EyeIcon from './icons/EyeIcon';
import EyeOffIcon from './icons/EyeOffIcon';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (credentials: { username: string; password?: string }) => boolean;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset form on close after animation
      setTimeout(() => {
        setUsername('');
        setPassword('');
        setError('');
        setShowPassword(false);
      }, 300);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password) {
        setError('Please enter username and password.');
        return;
    }
    const success = onLogin({ username, password });
    if (!success) {
      setError('Invalid username or password.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[60] p-4 transition-opacity duration-300" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md m-auto transform transition-transform duration-300 scale-95" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-slate-200 relative">
          <h2 className="text-lg font-bold text-slate-800 text-center">Login to Your Account</h2>
          <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors">
            <CloseIcon />
          </button>
        </div>
        
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username-auth" className="block text-sm font-medium text-slate-700">Username</label>
              <input type="text" name="username" id="username-auth" value={username} onChange={e => setUsername(e.target.value)} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm" />
            </div>

            <div>
              <label htmlFor="password-auth" className="block text-sm font-medium text-slate-700">Password</label>
              <div className="relative mt-1">
                <input type={showPassword ? 'text' : 'password'} name="password" id="password-auth" value={password} onChange={e => setPassword(e.target.value)} required className="block w-full rounded-md border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500">
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
            
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-rose-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-rose-700 transition-colors"
              >
                Login
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => alert('Forgot password functionality is coming soon!')}
              className="font-semibold text-sm text-rose-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;