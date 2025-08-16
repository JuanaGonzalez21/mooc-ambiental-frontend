// src/components/sections/HeroSection.tsx
import React from 'react';

const HeroSection = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
              Aprende nuevas habilidades
              <br />
              <span className="text-gray-700">con nuestros cursos online</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl">
              Accede a más de 1,000 cursos de alta calidad impartidos por 
              expertos en diversas áreas. Aprende a tu propio ritmo y desde 
              cualquier lugar.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a href="/cursos"  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md text-lg font-medium">
                Explorar Cursos
              </a>
      
            </div>
          </div>
          <div className="mt-10 lg:mt-0">
            <img 
              className="w-full rounded-lg shadow-lg" 
              src="https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg" 
              alt="Estudiante con tablet" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;