'use client';

import React, { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { apiRequest } from '@/lib/config';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    setConnectionStatus('connecting');
    
    try {
      console.log('🔐 Intentando login con:', { email: formData.email });
      
      const data = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      console.log('✅ Respuesta del login:', data);

      if (data.success && data.token && data.user) {
        setConnectionStatus('success');
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          if (formData.remember) {
            localStorage.setItem('rememberUser', 'true');
          }
        }
        
        console.log('✅ Login exitoso, redirigiendo al dashboard');
        
        // Pequeño delay para mostrar el estado de éxito
        setTimeout(() => {
          handleClose();
          if (typeof window !== 'undefined') {
            window.location.href = '/dashboard';
          }
        }, 500);
        
      } else {
        setConnectionStatus('error');
        console.warn('⚠️ Login fallido:', data);
        setErrors({ 
          general: data.error || data.message || 'Error al iniciar sesión' 
        });
      }

    } catch (error: unknown) {
      console.error('❌ Error en login:', error);
      
      let errorMessage = 'Error de conexión. Verifica que el servidor esté funcionando.';
      
      if (typeof error === 'object' && error !== null && 'message' in error) {
        const message = (error as { message: string }).message;
        if (message.includes('401')) {
          errorMessage = 'Credenciales incorrectas. Verifica tu email y contraseña.';
        } else if (message.includes('500')) {
          errorMessage = 'Error interno del servidor. Intenta más tarde.';
        } else if (message.includes('fetch')) {
          errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
        } else if (message.includes('timeout')) {
          errorMessage = 'La conexión tardó demasiado. Intenta nuevamente.';
        }
      }
      
      setConnectionStatus('error');
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ email: '', password: '', remember: false });
    setErrors({});
    setShowPassword(false);
    setConnectionStatus('idle');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Iniciar Sesión</h2>
            <p className="text-sm text-gray-600">Accede a tu cuenta de MoocAmbiental</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Estado de conexión */}
            {connectionStatus === 'connecting' && (
              <div className="bg-blue-50 border border-blue-200 text-blue-600 px-3 py-2 rounded-md text-sm flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Conectando con el servidor...
              </div>
            )}
            
            {connectionStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-3 py-2 rounded-md text-sm flex items-center">
                <div className="w-4 h-4 mr-2 text-green-600">✓</div>
                ¡Login exitoso! Redirigiendo...
              </div>
            )}

            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-sm">
                {errors.general}
              </div>
            )}

            <div>
              <label htmlFor="modal-email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="modal-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`block w-full pl-9 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } ${isLoading ? 'bg-gray-100' : ''}`}
                  placeholder="tu@ejemplo.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="modal-password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="modal-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`block w-full pl-9 pr-9 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } ${isLoading ? 'bg-gray-100' : ''}`}
                  placeholder="Ingresa tu contraseña"
                />
                <button
                  type="button"
                  disabled={isLoading}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="modal-remember"
                  name="remember"
                  type="checkbox"
                  checked={formData.remember}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="modal-remember" className="ml-2 block text-xs text-gray-700">
                  Recordarme
                </label>
              </div>
              <div className="text-xs">
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || connectionStatus === 'success'}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading || connectionStatus === 'success'
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : connectionStatus === 'error'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {connectionStatus === 'connecting' ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Conectando...
                </div>
              ) : connectionStatus === 'success' ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-2 text-white">✓</div>
                  ¡Éxito!
                </div>
              ) : isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Iniciando sesión...
                </div>
              ) : connectionStatus === 'error' ? (
                'Reintentar'
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>
        </div>

        <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
          <p className="text-center text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <button
              onClick={onSwitchToRegister}
              disabled={isLoading}
              className="text-blue-600 hover:text-blue-500 font-medium disabled:opacity-50"
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;