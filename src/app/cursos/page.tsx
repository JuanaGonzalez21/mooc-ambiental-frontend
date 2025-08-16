'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from "next/link";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Star, Clock,  BookOpen, Filter, Search, AlertCircle, RefreshCw, PlayCircle } from 'lucide-react';
import { getAllCourses, Course } from '@/data/courses';
import { getCategoriesFromAPI, checkDatabaseConnection } from '@/data/dataAdapter';

const CoursesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<{ name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  const levels = ['Todos', 'Principiante', 'Intermedio', 'Avanzado'];

  // Función para verificar conexión
  const checkConnection = async () => {
    try {
      const isConnected = await checkDatabaseConnection();
      setConnectionStatus(isConnected ? 'connected' : 'disconnected');
      return isConnected;
    } catch (error) {
      console.error('Error verificando conexión:', error);
      setConnectionStatus('disconnected');
      return false;
    }
  };

  // Cargar datos desde la base de datos
  const loadDataFromDatabase = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Cargando datos desde la base de datos...');
      
      // Verificar conexión
      const isConnected = await checkConnection();
      if (!isConnected) {
        throw new Error('No se pudo conectar con el servidor');
      }

      // Cargar cursos y categorías en paralelo
      const [coursesData, categoriesData] = await Promise.all([
        getAllCourses(),
        getCategoriesFromAPI().catch(err => {
          console.warn('⚠️ Error cargando categorías:', err);
          return [];
        })
      ]);
      
      console.log(`✅ Datos cargados exitosamente: ${coursesData.length} cursos, ${categoriesData.length} categorías`);
      
      setCourses(coursesData);
      setCategories([{ name: 'Todos' }, ...categoriesData]);
      
      if (coursesData.length === 0) {
        setError('No hay cursos disponibles en la base de datos');
      }
      
    } catch (error: unknown) {
      console.error('❌ Error cargando datos:', error);
      
      let errorMessage = 'Error al cargar los cursos desde la base de datos.';
      
      if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message: unknown }).message === 'string') {
        const message = (error as { message: string }).message;
        if (message.includes('fetch')) {
          errorMessage = 'Error de conexión con el servidor.';
        } else if (message.includes('500')) {
          errorMessage = 'Error interno del servidor.';
        } else if (message.includes('404')) {
          errorMessage = 'Servicio no disponible.';
        } else {
          errorMessage = message || errorMessage;
        }
      }
      
      setError(errorMessage);
      setCourses([]);
      setCategories([{ name: 'Todos' }]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadDataFromDatabase();
  }, [loadDataFromDatabase]);

  // Filtrar cursos
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLevel = selectedLevel === '' || selectedLevel === 'Todos' || course.level === selectedLevel;
    const matchesCategory = selectedCategory === '' || selectedCategory === 'Todos' || course.category === selectedCategory;
    
    return matchesSearch && matchesLevel && matchesCategory;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Principiante': return 'bg-green-100 text-green-800';
      case 'Intermedio': return 'bg-yellow-100 text-yellow-800';
      case 'Avanzado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-400';
      case 'disconnected': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Conectado a la base de datos';
      case 'disconnected': return 'Sin conexión a la base de datos';
      default: return 'Verificando conexión...';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Cursos de Medio Ambiente
          </h1>
          <p className="mt-4 text-xl text-blue-100 max-w-3xl mx-auto">
            Desarrolla expertise en sostenibilidad, cambio climático y tecnologías verdes 
            con nuestros cursos especializados
          </p>
          
          {/* Estado de conexión */}
          <div className="mt-4 flex justify-center">
            <div className={`flex items-center space-x-2 ${getConnectionStatusColor()}`}>
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-400' : 
                connectionStatus === 'disconnected' ? 'bg-red-400' : 'bg-yellow-400'
              }`}></div>
              <span className="text-sm font-medium text-white">
                {getConnectionStatusText()}
              </span>
            </div>
          </div>
          
          {/* Barra de búsqueda */}
          <div className="mt-8 flex justify-center">
            <div className="bg-white p-1 rounded-lg shadow-lg">
              <div className="flex items-center max-w-md">
                <Search className="h-5 w-5 text-gray-400 ml-3" />
                <input
                  type="text"
                  placeholder="Buscar cursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none rounded-lg"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-600" />
              <span className="text-gray-600 font-medium">Filtrar por:</span>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              >
                {categories.map((category, index) => (
                  <option key={index} value={category.name === 'Todos' ? '' : category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              >
                {levels.map(level => (
                  <option key={level} value={level === 'Todos' ? '' : level}>
                    Nivel: {level}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-gray-600">
                {loading ? (
                  <span className="flex items-center">
                    <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                    Cargando...
                  </span>
                ) : error ? (
                  <span className="text-red-600">Error al cargar</span>
                ) : (
                  `${filteredCourses.length} curso${filteredCourses.length !== 1 ? 's' : ''} encontrado${filteredCourses.length !== 1 ? 's' : ''}`
                )}
              </div>
              
              {error && (
                <button
                  onClick={loadDataFromDatabase}
                  className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Reintentar
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Error Section */}
      {error && !loading && (
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-start">
                <AlertCircle className="h-6 w-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-red-800 mb-2">
                    Error de conexión
                  </h3>
                  <p className="text-red-700 mb-4">{error}</p>
                  
                  <button
                    onClick={loadDataFromDatabase}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center"
                    disabled={loading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Reintentar conexión
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Courses Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            // Loading skeleton
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse w-full max-w-[70rem]">
                  <div className="flex">
                    <div className="w-64 h-48 bg-gray-200 flex-shrink-0"></div>
                    <div className="p-6 flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-4"></div>
                      <div className="h-3 bg-gray-200 rounded mb-4 w-3/4"></div>
                      <div className="flex justify-between">
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : !error && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <Link
                    href={`/cursos/${course.id}`}
                    key={course.id}
                    className="block group"
                  >
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-105 w-full max-w-[70rem]">
                      <div className="flex flex-col sm:flex-row">
                        {/* Course Image */}
                        <div className="relative w-full sm:w-64 h-100 flex-shrink-0">
                          <img 
                            src={course.image} 
                            alt={course.title}
                            className="w-full h-full object-cover rounded-l-xl"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop&q=80';
                            }}
                          />
                          <div className="absolute top-4 left-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(course.level)}`}>
                              {course.level}
                            </span>
                          </div>
                        </div>

                        {/* Course Content */}
                        <div className="p-6 flex-1">
                        {/* Category */}
                        <div className="text-sm text-blue-600 font-medium mb-2">
                          {course.category}
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {course.title}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {course.description}
                        </p>

                        {/* Instructor */}
                        <p className="text-gray-700 text-sm mb-4">
                          Por <span className="font-medium">{course.instructor}</span>
                        </p>

                        {/* Course Stats */}
                        <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {course.shortDuration || course.duration}
                            </div>
                            <div className="flex items-center">
                              <BookOpen className="h-4 w-4 mr-1" />
                              {course.modules}
                            </div>
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${i < Math.floor(course.rating) ? 'fill-current' : ''}`} 
                                />
                              ))}
                            </div>
                            <span className="ml-2 text-sm text-gray-600">
                              {course.rating}
                            </span>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {course.tags.slice(0, 2).map((tag, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                          {course.tags.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                              +{course.tags.length - 2}
                            </span>
                          )}
                        </div>

                        {/* Preview Button */}
                        <div className="pt-2 border-t border-gray-100">
                          <Link
                            href={`/cursos/${course.id}/${course.nameRoute || 'curso'}`}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <PlayCircle className="h-4 w-4 mr-1" />
                            Vista previa gratuita
                          </Link>
                        </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                // No courses found
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <BookOpen className="mx-auto h-16 w-16" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron cursos</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || selectedLevel || selectedCategory 
                      ? 'No hay cursos que coincidan con tus filtros actuales.'
                      : 'No hay cursos disponibles en la base de datos.'
                    }
                  </p>
                  {(searchTerm || selectedLevel || selectedCategory) && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedLevel('');
                        setSelectedCategory('');
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                    >
                      Limpiar filtros
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {!loading && !error && courses.length > 0 && (
        <section className="bg-gradient-to-r from-green-600 to-blue-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              ¿No encuentras el curso que buscas?
            </h2>
            <p className="mt-4 text-xl text-green-100">
              Contáctanos y te ayudaremos a encontrar la formación perfecta para tus objetivos
            </p>
            <div className="mt-8">
              <button className="bg-white hover:bg-gray-100 text-green-600 px-8 py-3 rounded-md text-lg font-medium transition-colors">
                Contactar Asesor
              </button>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default CoursesPage;