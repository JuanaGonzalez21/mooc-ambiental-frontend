// src/components/sections/CTASection.tsx
'use client';

import React, { useState } from 'react';
import RegisterModal from '@/components/auth/RegisterModal';
import LoginModal from '@/components/auth/LoginModal';

const CTASection = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const openRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const openLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  const closeModals = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
  };

  return (
    <>
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            ¡Únete al movimiento ambiental hoy!
          </h2>
          <p className="mt-4 text-xl text-blue-100">
            Forma parte de la comunidad que está construyendo un futuro 
            más sostenible para nuestro planeta.
          </p>
          <div className="mt-8">
            <button 
              onClick={openRegister}
              className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-3 rounded-md text-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Registrarse Gratis
            </button>
          </div>
        </div>
      </section>

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

export default CTASection;