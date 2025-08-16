// src/app/dashboard/page.tsx
'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  TrendingUp, 
  Calendar,
  Play,
  CheckCircle,
  Star,
  Download,
  MessageCircle,
  Settings,
  LogOut,
  User,
  Bell,
  Search
} from 'lucide-react';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Datos simulados del estudiante
  const studentData = {
    name: 'Ana García',
    email: 'ana.garcia@email.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    totalCourses: 3,
    completedCourses: 1,
    totalHours: 24,
    certificates: 1,
    currentStreak: 7
  };

  const enrolledCourses = [
    {
      id: 1,
      title: 'Introducción al Medio Ambiente y Sostenibilidad',
      instructor: 'Dra. María Rodríguez',
      progress: 100,
      totalLessons: 24,
      completedLessons: 24,
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop',
      lastAccessed: '2025-06-20',
      status: 'completed',
      certificate: true,
      rating: 5
    },
    {
      id: 2,
      title: 'Cambio Climático: Causas, Efectos y Soluciones',
      instructor: 'Dr. Carlos Mendoza',
      progress: 65,
      totalLessons: 32,
      completedLessons: 21,
      image: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=400&h=250&fit=crop',
      lastAccessed: '2025-06-24',
      status: 'in-progress',
      certificate: false
    },
    {
      id: 3,
      title: 'Gestión de Residuos y Economía Circular',
      instructor: 'Ing. Ana Gómez',
      progress: 30,
      totalLessons: 28,
      completedLessons: 8,
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=250&fit=crop',
      lastAccessed: '2025-06-22',
      status: 'in-progress',
      certificate: false
    }
  ];

  const recentActivity = [
    { id: 1, action: 'Completaste', course: 'Introducción al Medio Ambiente', time: 'Hace 2 días' },
    { id: 2, action: 'Comenzaste', course: 'Gestión de Residuos', time: 'Hace 3 días' },
    { id: 3, action: 'Obtuviste certificado', course: 'Introducción al Medio Ambiente', time: 'Hace 2 días' },
    { id: 4, action: 'Completaste lección', course: 'Cambio Climático', time: 'Ayer' }
  ];

  const upcomingDeadlines = [
    { id: 1, task: 'Examen Final - Cambio Climático', date: '2025-06-30', course: 'Cambio Climático' },
    { id: 2, task: 'Proyecto Final - Gestión de Residuos', date: '2025-07-05', course: 'Gestión de Residuos' }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cursos Inscritos</p>
              <p className="text-2xl font-bold text-gray-900">{studentData.totalCourses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <Trophy className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cursos Completados</p>
              <p className="text-2xl font-bold text-gray-900">{studentData.completedCourses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Horas de Estudio</p>
              <p className="text-2xl font-bold text-gray-900">{studentData.totalHours}h</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Racha Actual</p>
              <p className="text-2xl font-bold text-gray-900">{studentData.currentStreak} días</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.action}</span> {activity.course}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Próximas Fechas Límite</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline) => (
                <div key={deadline.id} className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{deadline.task}</p>
                    <p className="text-xs text-gray-600">{deadline.course}</p>
                    <p className="text-xs text-red-600 font-medium">{deadline.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Mis Cursos</h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
            Todos
          </button>
          <button className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
            En Progreso
          </button>
          <button className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
            Completados
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {enrolledCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="relative">
              <img 
                src={course.image} 
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4">
                {course.status === 'completed' ? (
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Completado
                  </span>
                ) : (
                  <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    En Progreso
                  </span>
                )}
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
              <p className="text-sm text-gray-600 mb-4">Por {course.instructor}</p>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progreso</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {course.completedLessons} de {course.totalLessons} lecciones completadas
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Último acceso: {course.lastAccessed}
                </div>
                <div className="flex space-x-2">
                  {course.certificate && (
                    <button className="flex items-center text-green-600 hover:text-green-700">
                      <Download className="h-4 w-4 mr-1" />
                      <span className="text-sm">Certificado</span>
                    </button>
                  )}
                  <button className="flex items-center bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700">
                    <Play className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      {course.status === 'completed' ? 'Revisar' : 'Continuar'}
                    </span>
                  </button>
                </div>
              </div>

              {course.status === 'completed' && course.rating && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">Tu calificación:</span>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < course.rating! ? 'fill-current' : ''}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Mi Perfil</h2>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-6 mb-6">
          <img 
            src={studentData.avatar} 
            alt={studentData.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{studentData.name}</h3>
            <p className="text-gray-600">{studentData.email}</p>
            <p className="text-sm text-gray-500">Estudiante desde Enero 2025</p>
          </div>
        </div>

        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo
              </label>
              <input 
                type="text" 
                defaultValue={studentData.name}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input 
                type="email" 
                defaultValue={studentData.email}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Biografía
            </label>
            <textarea 
              rows={4}
              placeholder="Cuéntanos sobre ti..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Guardar Cambios
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">MoocAmbiental</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Buscar cursos..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                />
              </div>
              
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="h-6 w-6" />
              </button>
              
              <div className="flex items-center space-x-3">
                <img 
                  src={studentData.avatar} 
                  alt={studentData.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-gray-900">{studentData.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow-sm border border-gray-200 h-fit">
            <div className="p-6">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'overview' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <TrendingUp className="h-5 w-5 mr-3" />
                  Dashboard
                </button>
                
                <button
                  onClick={() => setActiveTab('courses')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'courses' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <BookOpen className="h-5 w-5 mr-3" />
                  Mis Cursos
                </button>
                
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'profile' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <User className="h-5 w-5 mr-3" />
                  Mi Perfil
                </button>
                
                <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                  <MessageCircle className="h-5 w-5 mr-3" />
                  Mensajes
                </button>
                
                <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                  <Settings className="h-5 w-5 mr-3" />
                  Configuración
                </button>
                
                <hr className="my-4" />
                
                <button 
                  onClick={() => window.location.href = '/'}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Cerrar Sesión
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 ml-8">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'courses' && renderCourses()}
            {activeTab === 'profile' && renderProfile()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;