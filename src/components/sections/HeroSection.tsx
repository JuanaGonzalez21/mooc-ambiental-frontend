// src/components/sections/HeroSection.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
              Transforma el futuro
              <br />
              <span className="text-blue-700">con educación ambiental</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl">
              Descubre cursos en medio ambiente, sostenibilidad, cambio climático, 
              conservación y cuidado del agua. Conviértete en un agente de cambio 
              para nuestro planeta desde cualquier lugar.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/cursos" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md text-lg font-medium inline-block text-center">
                Explorar Cursos
              </Link>
      
            </div>
          </div>
          <div className="mt-10 lg:mt-0">
            <Image 
              className="w-full rounded-lg shadow-lg" 
              src="https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg" 
              alt="Estudiante aprendiendo sobre medio ambiente"
              width={600}
              height={400}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;