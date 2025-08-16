// src/components/sections/WhyChooseUsSection.tsx
import React from 'react';
import { GraduationCap, Clock, Smartphone, Trophy } from 'lucide-react';
import FeatureCard from '@/components/ui/FeatureCard';
import { Feature } from '@/types';

const WhyChooseUsSection = () => {
  const features: Feature[] = [
    {
      icon: <GraduationCap className="h-12 w-12" />,
      title: 'Instructores Expertos',
      description: 'Aprende de profesionales con amplia experiencia en su campo.',
    },
    {
      icon: <Clock className="h-12 w-12" />,
      title: 'Aprende a tu Ritmo',
      description: 'Accede a los cursos cuando y desde donde quieras.',
    },
    {
      icon: <Smartphone className="h-12 w-12" />,
      title: 'Acceso Multiplataforma',
      description: 'Disponible en web, móvil y tablet para tu comodidad.',
    },
    {
      icon: <Trophy className="h-12 w-12" />,
      title: 'Certificaciones',
      description: 'Obtén certificados reconocidos al completar los cursos.',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-blue-600 sm:text-4xl">
            ¿Por qué elegir MoocAmbiental?
          </h2>
        </div>
        
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;