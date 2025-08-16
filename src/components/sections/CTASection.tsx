// src/components/sections/CTASection.tsx
import React from 'react';

const CTASection = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          ¡Comienza tu viaje de aprendizaje hoy!
        </h2>
        <p className="mt-4 text-xl text-blue-100">
          Únete a nuestra comunidad de estudiantes y 
          transforma tu futuro con nuevas habilidades.
        </p>
        <div className="mt-8">
          <button className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-3 rounded-md text-lg font-medium">
            Registrarse Gratis
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;