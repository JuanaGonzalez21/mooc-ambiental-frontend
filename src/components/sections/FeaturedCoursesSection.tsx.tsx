// src/components/sections/FeaturedCoursesSection.tsx - VERSIÓN LIMPIA
'use client';

import React, { useState, useEffect } from 'react';
import CourseCard from '@/components/ui/CourseCard';
import { getFeaturedCourses, Course } from '@/data/courses';

const FeaturedCoursesSection: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        
        // Cargar cursos desde BD de Clever Cloud
        const featuredCourses = await getFeaturedCourses();
        setCourses(featuredCourses);
        
      } catch (err) {
        console.error('Error cargando cursos:', err);
        setCourses([]); // Array vacío si hay error
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-blue-600 sm:text-4xl">
              Cursos Destacados
            </h2>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[1, 2, 3].map((index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Si no hay cursos, mostrar mensaje simple
  if (courses.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-blue-600 sm:text-4xl">
              Cursos Destacados
            </h2>
            <p className="mt-4 text-gray-600">
              No hay cursos disponibles en este momento.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Mostrar cursos normalmente
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-blue-600 sm:text-4xl">
            Cursos Destacados
          </h2>
        </div>
        
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCoursesSection;