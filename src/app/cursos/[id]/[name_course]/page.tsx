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
  CheckCircle, 
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

  // Datos de mÃ³dulos del curso (esto vendrÃ­a de la BD en el futuro)
  const courseModules = [
    {
      id: 1,
      title: 'Introducciónn al Cambio ClimÃ¡tico',
      description: 'Conceptos fundamentales sobre el cambio climÃ¡tico y sus causas.',
      duration: '2 horas',
      lessons: 8,
      isLocked: false,
      preview: true
    },
    {
      id: 2,
      title: 'Impactos Ambientales',
      description: 'AnÃ¡lisis de los efectos del cambio climÃ¡tico en ecosistemas.',
      duration: '3 horas',
      lessons: 12,
      isLocked: !isEnrolled,
      preview: false
    },
    {
      id: 3,
      title: 'EnergÃ­as Renovables',
      description: 'TecnologÃ­as limpias y fuentes de energÃ­a sostenible.',
      duration: '4 horas',
      lessons: 15,
      isLocked: !isEnrolled,
      preview: false
    },
    {
      id: 4,
      title: 'PolÃ­ticas Ambientales',
      description: 'Marco regulatorio y polÃ­ticas pÃºblicas ambientales.',
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
            console.warn('No se pudo cargar por nombre, intentando por ID:', err);
          }
        }
        
        // Si no se encontrÃ³ por nombre, intentar por ID
        if (!courseData && courseId) {
          courseData = await getCourseFromAPI(courseId);
        }
        
        if (!courseData) {
          setError('Curso no encontrado');
          return;
        }
        
        // Verificar que el curso coincida con los parÃ¡metros
        if (courseName && courseData.nameRoute !== courseName) {
          setError('El curso no coincide con la ruta solicitada');
          return;
        }
        
        setCourse(courseData);
        
        // Verificar si el usuario estÃ¡ inscrito
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
    // Redirigir a la pÃ¡gina de detalle para registro
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
              El curso que buscas no estÃ¡ disponible o ha ocurrido un error.
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

      {/* Course Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Modules Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  MÃ³dulos del curso
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
                              MÃ³dulo {moduleItem.id}
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
                            <span className="mx-2">â€¢</span>
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
                          Contenido del mÃ³dulo
                        </h3>
                        <p className="text-gray-600 mb-4">
                          AquÃ­ se mostrarÃ­a el contenido especÃ­fico del mÃ³dulo seleccionado. 
                          Esto incluirÃ­a videos, textos, ejercicios interactivos y recursos adicionales.
                        </p>
                        
                        {!isEnrolled && courseModules[activeModule].preview && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                            <p className="text-blue-800 font-medium">
                              ðŸŽ¯ Esta es una vista previa gratuita del mÃ³dulo.
                            </p>
                            <p className="text-blue-700 text-sm mt-1">
                              InscrÃ­bete para acceder a todo el contenido del curso.
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
                              <span className="flex-1">LecciÃ³n {i + 1}: Contenido del mÃ³dulo</span>
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
                      InscrÃ­bete al curso para acceder a este mÃ³dulo y todo el contenido.
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