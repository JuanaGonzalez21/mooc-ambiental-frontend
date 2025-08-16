// src/app/cursos/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { 
  Star, 
  Clock, 
  Users, 
  BookOpen, 
  PlayCircle, 
  CheckCircle, 
  ArrowLeft,
  Calendar,
  Award,
  Globe
} from 'lucide-react';
import { getCourseById, Course } from '@/data/courses';

const CourseDetailPage = () => {
  const params = useParams();
  const courseId = (params && 'id' in params) ? (params.id as string) : '';
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!courseId) {
          setError('ID del curso no encontrado');
          return;
        }

        // Cargar curso desde la base de datos
        const courseData = await getCourseById(courseId);
        
        if (!courseData) {
          setError('Curso no encontrado');
          return;
        }
        
        setCourse(courseData);
        
      } catch (err) {
        console.error('Error cargando curso:', err);
        setError('Error al cargar el curso. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Principiante': return 'bg-green-100 text-green-800';
      case 'Intermedio': return 'bg-yellow-100 text-yellow-800';
      case 'Avanzado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRegister = () => {
    // Aquí puedes redirigir a tu página de registro o abrir un modal
    // Por ejemplo: router.push('/registro?curso=' + courseId);
    alert('Redirigiendo a registro del curso...');
    // En una implementación real, esto sería:
    // window.location.href = '/registro?curso=' + courseId;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-96 bg-gray-200"></div>
              <div className="p-8">
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-6 w-3/4"></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className="h-32 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-48 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <BookOpen className="mx-auto h-16 w-16" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Curso no encontrado'}
            </h1>
            <p className="text-gray-600 mb-8">
              El curso que buscas no está disponible o ha ocurrido un error.
            </p>
            <Link 
              href="/cursos"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Volver a cursos
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Inicio</Link>
            <span>/</span>
            <Link href="/cursos" className="hover:text-blue-600">Cursos</Link>
            <span>/</span>
            <span className="text-gray-900">{course.title}</span>
          </div>
        </div>
      </div>

      {/* Course Hero */}
      <section className="bg-gradient-to-r from-blue-900 to-green-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(course.level)}`}>
                  {course.level}
                </span>
                <span className="text-blue-200 text-sm">{course.category}</span>
              </div>
              
              <h1 className="text-4xl font-bold text-white mb-4">
                {course.title}
              </h1>
              
              <p className="text-xl text-blue-100 mb-6">
                {course.description}
              </p>
              
              <div className="flex items-center space-x-6 text-blue-100 mb-8">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  {course.duration}
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  {course.modules} módulos
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  {course.students.toLocaleString()} estudiantes
                </div>
              </div>
              
              <div className="flex items-center mb-8">
                <div className="flex text-yellow-400 mr-3">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${i < Math.floor(course.rating) ? 'fill-current' : ''}`} 
                    />
                  ))}
                </div>
                <span className="text-white text-lg font-medium mr-2">
                  {course.rating}
                </span>
                <span className="text-blue-200">
                  ({course.totalRatings.toLocaleString()} reseñas)
                </span>
              </div>
              
              <button
                onClick={handleRegister}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-bold transition-colors inline-flex items-center"
              >
                <PlayCircle className="h-6 w-6 mr-3" />
                Registrarme para este curso
              </button>
            </div>
            
            <div className="lg:justify-self-end">
              <div className="relative">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full max-w-md rounded-xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-2">
              
              {/* About this course */}
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Acerca de este curso
                </h2>
                <div className="prose max-w-none text-gray-600">
                  <p className="mb-4">
                    {course.description}
                  </p>
                  <p className="mb-4">
                    Este curso está diseñado para proporcionarte conocimientos sólidos en {course.category.toLowerCase()}, 
                    combinando teoría y práctica para una experiencia de aprendizaje completa.
                  </p>
                  <p>
                    Al finalizar, habrás desarrollado las habilidades necesarias para aplicar estos conocimientos 
                    en proyectos reales y avanzar en tu carrera profesional.
                  </p>
                </div>
              </div>

              {/* What you'll learn */}
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Lo que aprenderás
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Fundamentos teóricos sólidos",
                    "Aplicación práctica de conceptos",
                    "Herramientas y metodologías actuales",
                    "Casos de estudio reales",
                    "Mejores prácticas del sector",
                    "Preparación para certificaciones"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Temas relacionados
                </h2>
                <div className="flex flex-wrap gap-3">
                  {course.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              
              {/* Course Info Card */}
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8 sticky top-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Información del curso
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-600">Duración</span>
                    </div>
                    <span className="font-medium text-gray-900">{course.duration}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-600">Módulos</span>
                    </div>
                    <span className="font-medium text-gray-900">{course.modules}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-600">Estudiantes</span>
                    </div>
                    <span className="font-medium text-gray-900">{course.students.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-600">Nivel</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${getLevelColor(course.level)}`}>
                      {course.level}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Globe className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-600">Idioma</span>
                    </div>
                    <span className="font-medium text-gray-900">Español</span>
                  </div>
                </div>
                
                <div className="border-t pt-6 mt-6">
                  <div className="text-center mb-4">
                    <p className="text-gray-600 mb-2">Instructor</p>
                    <p className="text-lg font-bold text-gray-900">{course.instructor}</p>
                  </div>
                  
                  <button
                    onClick={handleRegister}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-lg font-bold text-lg transition-colors"
                  >
                    Registrarme ahora
                  </button>
                  
                  <p className="text-xs text-gray-500 text-center mt-3">
                    Acceso inmediato tras el registro
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CourseDetailPage;