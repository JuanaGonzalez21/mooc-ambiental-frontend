// src/app/cursos/[id]/[name_course]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { 
  Clock, 
  BookOpen, 
  PlayCircle, 
  CheckCircle, 
  Users,
  ChevronRight,
  Lock,
  Play
} from 'lucide-react';
import { getCourseFromAPI, getCourseByNameFromAPI } from '@/data/dataAdapter';
import { Course } from '@/data/courses';

const CourseContentPage = () => {
  const params = useParams();
  const courseId = (params && 'id' in params) ? (params.id as string) : '';
  const courseName = (params && 'name_course' in params) ? (params.name_course as string) : '';
  
  const [course, setCourse] = useState<Course | null>(null);
  const [activeModule, setActiveModule] = useState(0);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Datos de módulos del curso (esto vendría de la BD en el futuro)
  const courseModules = [
    {
      id: 1,
      title: 'Introducción al Cambio Climático',
      description: 'Conceptos fundamentales sobre el cambio climático y sus causas.',
      duration: '2 horas',
      lessons: 8,
      isLocked: false,
      preview: true
    },
    {
      id: 2,
      title: 'Impactos Ambientales',
      description: 'Análisis de los efectos del cambio climático en ecosistemas.',
      duration: '3 horas',
      lessons: 12,
      isLocked: !isEnrolled,
      preview: false
    },
    {
      id: 3,
      title: 'Energías Renovables',
      description: 'Tecnologías limpias y fuentes de energía sostenible.',
      duration: '4 horas',
      lessons: 15,
      isLocked: !isEnrolled,
      preview: false
    },
    {
      id: 4,
      title: 'Políticas Ambientales',
      description: 'Marco regulatorio y políticas públicas ambientales.',
      duration: '3 horas',
      lessons: 10,
      isLocked: !isEnrolled,
      preview: false
    },
    {
      id: 5,
      title: 'Proyecto Final',
      description: 'Desarrollo de un plan de sostenibilidad integral.',
      duration: '5 horas',
      lessons: 6,
      isLocked: !isEnrolled,
      preview: false
    }
  ];

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let courseData: Course | null = null;
        
        // Intentar cargar por name_course primero, luego por ID
        if (courseName) {
          try {
            courseData = await getCourseByNameFromAPI(courseName);
          } catch (err) {
            console.warn('No se pudo cargar por nombre, intentando por ID');
          }
        }
        
        // Si no se encontró por nombre, intentar por ID
        if (!courseData && courseId) {
          courseData = await getCourseFromAPI(courseId);
        }
        
        if (!courseData) {
          setError('Curso no encontrado');
          return;
        }
        
        // Verificar que el curso coincida con los parámetros
        if (courseName && courseData.nameRoute !== courseName) {
          setError('El curso no coincide con la ruta solicitada');
          return;
        }
        
        setCourse(courseData);
        
        // Verificar si el usuario está inscrito
        const user = localStorage.getItem('user');
        if (user) {
          setIsEnrolled(true);
        }
        
      } catch (err) {
        console.error('Error cargando curso:', err);
        setError('Error al cargar el curso. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId, courseName]);

  const handleEnroll = () => {
    // Redirigir a la página de detalle para registro
    window.location.href = `/cursos/${courseId}`;
  };

  const handleModuleClick = (moduleIndex: number) => {
    const selectedModule = courseModules[moduleIndex];
    if (!selectedModule.isLocked) {
      setActiveModule(moduleIndex);
    }
  };

  const markModuleComplete = (moduleIndex: number) => {
    if (!completedModules.includes(moduleIndex)) {
      setCompletedModules([...completedModules, moduleIndex]);
    }
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
              <ChevronRight className="h-5 w-5 mr-2 rotate-180" />
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
            <ChevronRight className="h-4 w-4" />
            <Link href="/cursos" className="hover:text-blue-600">Cursos</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/cursos/${courseId}`} className="hover:text-blue-600">{course.title}</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900">Contenido del curso</span>
          </div>
        </div>
      </div>

      {/* Course Header */}
      <section className="bg-gradient-to-r from-green-900 to-blue-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <h1 className="text-4xl font-bold text-white mb-4">
                {course.title}
              </h1>
              <p className="text-xl text-green-100 mb-6">
                {course.description}
              </p>
              
              <div className="flex items-center space-x-6 text-green-100 mb-6">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  {course.duration}
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  {courseModules.length} módulos
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  {course.students.toLocaleString()} estudiantes
                </div>
              </div>

              {!isEnrolled && (
                <button
                  onClick={handleEnroll}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-bold transition-colors inline-flex items-center"
                >
                  <PlayCircle className="h-6 w-6 mr-3" />
                  Inscribirse al curso
                </button>
              )}
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Información del curso
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Instructor:</span>
                    <span className="font-medium">{course.instructor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nivel:</span>
                    <span className="font-medium">{course.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Calificación:</span>
                    <span className="font-medium">⭐ {course.rating}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Progreso:</span>
                    <span className="font-medium">
                      {completedModules.length}/{courseModules.length} módulos
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Modules Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Módulos del curso
                </h3>
                
                <div className="space-y-3">
                  {courseModules.map((moduleItem, index) => (
                    <div
                      key={moduleItem.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        activeModule === index
                          ? 'border-blue-500 bg-blue-50'
                          : moduleItem.isLocked
                          ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                      onClick={() => handleModuleClick(index)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            {completedModules.includes(index) ? (
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            ) : moduleItem.isLocked ? (
                              <Lock className="h-5 w-5 text-gray-400 mr-2" />
                            ) : (
                              <Play className="h-5 w-5 text-blue-500 mr-2" />
                            )}
                            <span className="text-sm font-medium text-gray-900">
                              Módulo {moduleItem.id}
                            </span>
                          </div>
                          <h4 className={`font-semibold mb-1 ${
                            moduleItem.isLocked ? 'text-gray-400' : 'text-gray-900'
                          }`}>
                            {moduleItem.title}
                          </h4>
                          <p className={`text-sm mb-2 ${
                            moduleItem.isLocked ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {moduleItem.description}
                          </p>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {moduleItem.duration}
                            <span className="mx-2">•</span>
                            <BookOpen className="h-3 w-3 mr-1" />
                            {moduleItem.lessons} lecciones
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-lg p-8">
                {isEnrolled || courseModules[activeModule].preview ? (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {courseModules[activeModule].title}
                      </h2>
                      {isEnrolled && !completedModules.includes(activeModule) && (
                        <button
                          onClick={() => markModuleComplete(activeModule)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Marcar como completado
                        </button>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-8">
                      {courseModules[activeModule].description}
                    </p>

                    {/* Module Content Placeholder */}
                    <div className="space-y-6">
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">
                          Contenido del módulo
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Aquí se mostraría el contenido específico del módulo seleccionado. 
                          Esto incluiría videos, textos, ejercicios interactivos y recursos adicionales.
                        </p>
                        
                        {!isEnrolled && courseModules[activeModule].preview && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                            <p className="text-blue-800 font-medium">
                              🎯 Esta es una vista previa gratuita del módulo.
                            </p>
                            <p className="text-blue-700 text-sm mt-1">
                              Inscríbete para acceder a todo el contenido del curso.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Lessons List */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">
                          Lecciones ({courseModules[activeModule].lessons})
                        </h3>
                        <div className="space-y-3">
                          {Array.from({ length: courseModules[activeModule].lessons }, (_, i) => (
                            <div key={i} className="flex items-center p-3 bg-white rounded border">
                              <Play className="h-4 w-4 text-blue-500 mr-3" />
                              <span className="flex-1">Lección {i + 1}: Contenido del módulo</span>
                              <span className="text-sm text-gray-500">5-10 min</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Contenido bloqueado
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Inscríbete al curso para acceder a este módulo y todo el contenido.
                    </p>
                    <button
                      onClick={handleEnroll}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Inscribirse ahora
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CourseContentPage;
