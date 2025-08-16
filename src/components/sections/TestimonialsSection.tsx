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
      content: 'MoocAmbiental cambió mi carrera profesional. Gracias a los cursos de programación, conseguí mi primer empleo como desarrolladora web.',
    },
    {
      id: '2',
      name: 'Miguel Ángel Pérez',
      role: 'Especialista en Marketing',
      content: 'La calidad de los cursos es excelente. Los instructores explican todo paso a paso y responden rápidamente a las dudas.',
    },
    {
      id: '3',
      name: 'Elena Martínez',
      role: 'Analista de Datos',
      content: 'Lo mejor es la flexibilidad. Puedo estudiar mientras trabajo a tiempo completo, y el contenido siempre está actualizado.',
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