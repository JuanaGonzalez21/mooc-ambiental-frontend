// src/components/sections/TestimonialsSection.tsx
import React from 'react';
import TestimonialCard from '@/components/ui/TestimonialCard';
import { Testimonial } from '@/types';

const TestimonialsSection = () => {
  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Laura Sánchez',
      role: 'Desarrolladora Web',
      content: 'MoocAmbiental es una increible herramienta para aprender sobre medio ambiente. Gracias a los cursos de recursos hidricos',
    },
    {
      id: '2',
      name: 'Miguel Ángel Pérez',
      role: 'Especialista en Marketing',
      content: 'La calidad de los cursos es excelente. Entendí muchos temas que no conocia y me han ayudado a mejorar mi vida cotidiana.',
    },
    {
      id: '3',
      name: 'Elena Martínez',
      role: 'Analista de Datos',
      content: 'Lo mejor para estudiar desde casa y a tu propio ritmo.',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-blue-600 sm:text-4xl">
            Lo que dicen nuestros estudiantes
          </h2>
        </div>
        
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;