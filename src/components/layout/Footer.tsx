// src/components/layout/Footer.tsx
import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">MoocAmbiental</h3>
            <p className="text-gray-400">
              Plataforma cursos online para el desarrollo profesional.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Cursos</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Medio Ambiente</a></li>
            </ul>
          </div>
          <div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/contacto" className="hover:text-white">
                  Formulario de contacto
                </Link>
              </li>
              <li>juana.gonzalez@campusucc.edu.co</li>
              <li>+57 3197414623</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>© 2025 MoocAmbiental. Todos los derechos reservados.</p>
          <p className="mt-2 text-sm">
            Desarrollado con ❤️ por{' '}
            <Link href="/contacto" className="text-blue-400 hover:text-blue-300 font-medium">
              Juana Valentina González Ardila
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;