// src/components/layout/Header.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, User, Settings, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import LoginModal from '@/components/auth/LoginModal';
import RegisterModal from '@/components/auth/RegisterModal';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const openLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
    setIsMobileMenuOpen(false); // Cerrar menú móvil al abrir modal
  };

  const openRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
    setIsMobileMenuOpen(false); // Cerrar menú móvil al abrir modal
  };

  const closeModals = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const closeUserMenu = () => {
    setIsUserMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeUserMenu();
    window.location.href = '/';
  };

  // Construir nombre completo del usuario
  const getUserName = () => {
    if (!user) return 'Usuario';
    const firstName = user.firstName || user.first_name || '';
    const lastName = user.lastName || user.last_name || '';
    return `${firstName} ${lastName}`.trim() || user.email || 'Usuario';
  };

  // Generar avatar URL
  const getAvatarUrl = () => {
    const name = getUserName();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff&size=40`;
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-40">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="flex items-center">
                <h1 className="text-2xl font-bold text-blue-600">MoocAmbiental</h1>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a 
                  href="/" 
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Inicio
                </a>
                <a 
                  href="/cursos" 
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Cursos
                </a>
                <Link 
                  href="/contacto" 
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Contacto
                </Link>
              </div>
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                /* User Menu */
                <div className="relative">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-gray-50"
                  >
                    <Image
                      src={getAvatarUrl()}
                      alt={getUserName()}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm font-medium">{getUserName()}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{getUserName()}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                      
                      <Link
                        href="/dashboard"
                        onClick={closeUserMenu}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4 mr-3" />
                        Mi Dashboard
                      </Link>
                      
                      <Link
                        href="/dashboard"
                        onClick={closeUserMenu}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User className="h-4 w-4 mr-3" />
                        Mi Perfil
                      </Link>
                      
                      <Link
                        href="/dashboard"
                        onClick={closeUserMenu}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Configuración
                      </Link>
                      
                      <hr className="my-2" />
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Login/Register Buttons */
                <>
                  <button 
                    onClick={openLogin}
                    className="text-blue-600 border border-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Iniciar Sesión
                  </button>
                  <button 
                    onClick={openRegister}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Registrarse
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
                aria-expanded="false"
              >
                <span className="sr-only">Abrir menú principal</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200 shadow-lg">
            
            {/* Mobile Navigation Links */}
            <a
              href="/"
              onClick={closeMobileMenu}
              className="text-gray-700 hover:text-blue-600 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              Inicio
            </a>
            
            <a
              href="/cursos"
              onClick={closeMobileMenu}
              className="text-gray-700 hover:text-blue-600 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              Cursos
            </a>
            
            <Link
              href="/contacto"
              onClick={closeMobileMenu}
              className="text-gray-700 hover:text-blue-600 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              Contacto
            </Link>

            {/* Mobile Auth Section */}
            <div className="pt-4 pb-3 border-t border-gray-200">
              {isAuthenticated ? (
                /* Mobile User Menu */
                <div className="space-y-2">
                  <div className="flex items-center px-3 py-2">
                    <Image
                      src={getAvatarUrl()}
                      alt={getUserName()}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{getUserName()}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  
                  <Link
                    href="/dashboard"
                    onClick={closeMobileMenu}
                    className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <LayoutDashboard className="h-5 w-5 mr-3" />
                    Mi Dashboard
                  </Link>
                  
                  <Link
                    href="/dashboard"
                    onClick={closeMobileMenu}
                    className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <User className="h-5 w-5 mr-3" />
                    Mi Perfil
                  </Link>
                  
                  <Link
                    href="/dashboard"
                    onClick={closeMobileMenu}
                    className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <Settings className="h-5 w-5 mr-3" />
                    Configuración
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                /* Mobile Login/Register Buttons */
                <div className="space-y-2">
                  <button 
                    onClick={openLogin}
                    className="w-full text-blue-600 border border-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Iniciar Sesión
                  </button>
                  <button 
                    onClick={openRegister}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Registrarse
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Overlay para cerrar menús al hacer clic fuera */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-30 bg-black bg-opacity-25"
          onClick={closeMobileMenu}
        />
      )}
      
      {isUserMenuOpen && (
        <div 
          className="hidden md:block fixed inset-0 z-30"
          onClick={closeUserMenu}
        />
      )}

      {/* Modales */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={closeModals}
        onSwitchToRegister={openRegister}
      />
      
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={closeModals}
        onSwitchToLogin={openLogin}
      />
    </>
  );
};

export default Header;