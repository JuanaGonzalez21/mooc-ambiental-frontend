// src/app/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getUserProgressFromAPI, getCoursesFromAPI } from '@/data/dataAdapter';
import { getImageForCategory } from '@/data/dataAdapter';
import { Course } from '@/data/courses';

// Interfaces para el progreso del usuario
interface UserProgressStats {
  total_lessons: number;
  completed_lessons: number;
  total_time_spent: number;
  unique_courses: number;
}

interface CourseProgress {
  course_id: number;
  title: string;
  duration_hours: number;
  lessons_taken: number;
  lessons_completed: number;
  time_spent: number;
  last_accessed: string;
  progress_percentage: number;
  status: string;
}

interface UserProgress {
  user_id: string;
  statistics: UserProgressStats;
  courses: CourseProgress[];
  progress_details: unknown[];
}

interface EnrolledCourse {
  id: number | string;
  title: string;
  instructor: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  image: string;
  lastAccessed: string;
  status: string;
  certificate: boolean;
  rating?: number;
  timeSpent?: number;
}


import { 
  BookOpen, 
  Play,
  Star,
  Download,
  Settings,
  LogOut,
  User,
  Bell,
  Search,
  Plus,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('courses'); // Por defecto en 'Mis Cursos'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Función para cerrar el menú móvil al cambiar de tab
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    avatar: string;
    totalCourses: number;
    completedCourses: number;
    totalHours: number;
    certificates: number;
    currentStreak: number;
  } | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Verificar token con el servidor
  const verifyTokenWithServer = async (token: string) => {
    try {
      console.log('🔐 Verificando token con el servidor...');
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token })
      });

      const data = await response.json();
      
      if (data.success && data.user) {
        console.log('✅ Token válido, usuario actualizado desde servidor');
        return data.user;
      } else {
        console.log('❌ Token inválido o expirado');
        return null;
      }
    } catch (error) {
      console.error('❌ Error verificando token:', error);
      return null;
    }
  };

  // Obtener datos reales del usuario logueado
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Verificar si estamos en el cliente (no en el servidor)
        if (typeof window === 'undefined') {
          setLoading(false);
          return;
        }

        console.log('🔍 Verificando autenticación...');
        
        // Debug: Mostrar todo lo que hay en localStorage
        console.log('🗂️ Contenido completo de localStorage:');
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            const value = localStorage.getItem(key);
            console.log(`  ${key}:`, value?.substring(0, 100) + (value && value.length > 100 ? '...' : ''));
          }
        }
        
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('authToken') || localStorage.getItem('token');
        
        console.log('📦 Usuario en localStorage:', storedUser ? 'Encontrado' : 'No encontrado');
        console.log('🔑 Token en localStorage:', storedToken ? 'Encontrado' : 'No encontrado');
        
        if (storedUser && storedToken) {
          // Primero intentar verificar el token con el servidor
          const serverUser = await verifyTokenWithServer(storedToken);
          
          let user;
          if (serverUser) {
            // Si el servidor devuelve datos actualizados, usarlos
            user = serverUser;
            // Actualizar localStorage con datos frescos
            localStorage.setItem('user', JSON.stringify(serverUser));
            console.log('🔄 Datos de usuario actualizados desde servidor');
          } else {
            // Si el servidor no responde o el token es inválido, usar datos locales como fallback
            try {
              user = JSON.parse(storedUser);
              console.log('📱 Usando datos locales como fallback');
            } catch (parseError) {
              console.error('❌ Error parseando usuario local:', parseError);
              // Limpiar datos corruptos
              localStorage.removeItem('user');
              localStorage.removeItem('token');
              localStorage.removeItem('authToken');
              setTimeout(() => {
                window.location.href = '/';
              }, 1000);
              return;
            }
          }

          console.log('🔍 Datos del usuario recibidos:', user);
          console.log('📝 firstName:', user.firstName);
          console.log('📝 lastName:', user.lastName);
          console.log('📝 first_name:', user.first_name);
          console.log('📝 last_name:', user.last_name);
          
          const fullName = `${user.firstName || user.first_name || ''} ${user.lastName || user.last_name || ''}`.trim() || 'Usuario';
          console.log('✅ Nombre completo construido:', fullName);
          
                    // Cargar progreso real del usuario
          let progressData = null;
          try {
            progressData = await getUserProgressFromAPI(user.id || user.user_id);
            setUserProgress(progressData);
            console.log('📊 Progreso del usuario cargado:', progressData);
          } catch (progressError) {
            console.warn('⚠️ No se pudo cargar el progreso del usuario:', progressError);
          }

          // Cargar todos los cursos disponibles
          try {
            const coursesData = await getCoursesFromAPI();
            setAllCourses(coursesData);
            console.log('📚 Todos los cursos cargados:', coursesData.length);
          } catch (coursesError) {
            console.warn('⚠️ No se pudieron cargar los cursos:', coursesError);
          }

          // Usar datos reales de progreso si están disponibles
          const stats = progressData?.statistics || {};
          setUserData({
            name: fullName,
            email: user.email || 'usuario@email.com',
            avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=3b82f6&color=fff&size=150`,
            totalCourses: stats.unique_courses || 0,
            completedCourses: stats.completed_lessons || 0,
            totalHours: Math.round((stats.total_time_spent || 0) / 60), // Convertir minutos a horas
            certificates: stats.completed_lessons || 0,
            currentStreak: 7 // Este podría calcularse basado en completed_at
          });
          console.log('🎉 Dashboard cargado para:', fullName);
        } else {
          console.log('🚫 No hay datos de autenticación, redirigiendo...');
          // Dar un pequeño delay para evitar redirecciones inmediatas
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        }
      } catch (error) {
        console.error('❌ Error general cargando datos del usuario:', error);
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } finally {
        setLoading(false);
      }
    };

    // Dar un pequeño delay para asegurar que el componente esté montado
    const timer = setTimeout(loadUserData, 100);
    return () => clearTimeout(timer);
  }, []);

  // Mantener sesión activa - verificar token cada 10 minutos
  useEffect(() => {
    if (!userData) return;

    const keepSessionAlive = async () => {
      const storedToken = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (storedToken) {
        console.log('🔄 Renovando sesión...');
        const serverUser = await verifyTokenWithServer(storedToken);
        if (serverUser) {
          console.log('✅ Sesión renovada exitosamente');
          // Actualizar datos si es necesario
          localStorage.setItem('user', JSON.stringify(serverUser));
        } else {
          console.log('❌ Sesión expirada, redirigiendo al login');
          localStorage.clear();
          window.location.href = '/';
        }
      }
    };

    // Verificar cada 10 minutos (600000 ms)
    const sessionInterval = setInterval(keepSessionAlive, 600000);

    // También verificar cuando la página vuelve a tener foco
    const handleFocus = () => {
      console.log('👁️ Página enfocada, verificando sesión...');
      keepSessionAlive();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(sessionInterval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [userData]);

  // Datos simulados del estudiante (fallback)
  const studentData = userData || {
    name: 'Usuario',
    email: 'usuario@email.com',
    avatar: 'https://ui-avatars.com/api/?name=Usuario&background=3b82f6&color=fff&size=150',
    totalCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    certificates: 0,
    currentStreak: 0
  };

  // Combinar todos los cursos con el progreso del usuario
  const enrolledCourses = allCourses.length > 0 ? allCourses.map((course) => {
    // Buscar si el usuario tiene progreso en este curso
    const userCourseProgress = userProgress?.courses?.find((uc: CourseProgress) => 
      uc.course_id === parseInt(course.id)
    );

    return {
      id: course.id,
      title: course.title,
      instructor: course.instructor || 'Instructor',
      progress: userCourseProgress?.progress_percentage || 0,
      totalLessons: course.modules || course.duration || 20,
      completedLessons: userCourseProgress?.lessons_completed || 0,
      image: course.image || getImageForCategory(course.category || course.title),
      lastAccessed: userCourseProgress?.last_accessed ? 
        new Date(userCourseProgress.last_accessed).toLocaleDateString() : 'Nunca',
      status: userCourseProgress ? 
        (userCourseProgress.progress_percentage === 100 ? 'completed' : 'in-progress') : 
        'available',
      certificate: userCourseProgress?.progress_percentage === 100 || false,
      rating: userCourseProgress?.progress_percentage === 100 ? 5 : undefined,
      timeSpent: userCourseProgress?.time_spent ? Math.round(userCourseProgress.time_spent / 60) : 0
    };
  }) : [
    // Fallback si no hay cursos cargados
    {
      id: 'loading',
      title: 'Cargando cursos...',
      instructor: 'Sistema',
      progress: 0,
      totalLessons: 0,
      completedLessons: 0,
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop',
      lastAccessed: 'Nunca',
      status: 'loading',
      certificate: false,
      timeSpent: 0
    }
  ] as EnrolledCourse[];





  const renderCourses = () => (
    <div className="space-y-8">
      {/* Header con bienvenida personalizada */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">¡Hola, {studentData.name}! 👋</h1>
            <p className="text-blue-100 text-lg">Continúa tu aprendizaje ambiental</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{studentData.totalCourses}</div>
            <div className="text-blue-100">Cursos inscritos</div>
            </div>
          </div>
        </div>

      {/* Estadísticas de Progreso Real */}
      {userProgress && (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 border border-gray-200">
          <div className="flex items-center">
            <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
            <div className="ml-2 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Lecciones Completadas</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{userProgress.statistics.completed_lessons}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 border border-gray-200">
          <div className="flex items-center">
              <Play className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0" />
            <div className="ml-2 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Tiempo Total</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{Math.round((userProgress.statistics.total_time_spent || 0) / 60)}h</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 border border-gray-200">
          <div className="flex items-center">
              <Star className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 flex-shrink-0" />
            <div className="ml-2 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Cursos Activos</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{userProgress.statistics.unique_courses}</p>
          </div>
        </div>
      </div>

        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 border border-gray-200">
          <div className="flex items-center">
              <Download className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 flex-shrink-0" />
            <div className="ml-2 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Progreso Promedio</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {userProgress.courses.length > 0 
                    ? Math.round(userProgress.courses.reduce((acc: number, course: CourseProgress) => acc + course.progress_percentage, 0) / userProgress.courses.length)
                    : 0}%
                </p>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Acciones rápidas */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Mis Cursos</h2>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <Link 
            href="/cursos"
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            <Plus className="h-4 w-4 mr-2" />
            Explorar más cursos
          </Link>
          <div className="flex space-x-2 overflow-x-auto">
                        <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm border border-blue-300 rounded-md hover:bg-gray-50 bg-blue-50 text-blue-700 whitespace-nowrap">
              Todos
            </button>
            <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-md hover:bg-gray-50 whitespace-nowrap">
              Disponibles
            </button>
            <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-md hover:bg-gray-50 whitespace-nowrap">
              En Progreso
            </button>
            <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-md hover:bg-gray-50 whitespace-nowrap">
              Completados
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {enrolledCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative">
              <Image 
                src={course.image} 
                alt={course.title}
                width={400}
                height={224}
                className="w-full h-32 sm:h-48 lg:h-56 object-cover"
              />
              <div className="absolute top-4 right-4">
                {course.status === 'completed' ? (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                    ✅ Completado
                  </span>
                ) : course.status === 'in-progress' ? (
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                    📚 En Progreso
                  </span>
                ) : course.status === 'available' ? (
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                    🆕 Disponible
                  </span>
                ) : (
                  <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                    ⏳ Cargando...
                  </span>
                )}
              </div>
              <div className="absolute bottom-4 left-4">
                <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  {course.progress}% completado
                </div>
              </div>
            </div>
            
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-4">👨‍🏫 {course.instructor}</p>
              
              {/* Progress Bar Mejorada */}
              <div className="mb-6">
                <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                  <span>Progreso del curso</span>
                  <span className="text-blue-600">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>📖 {course.completedLessons} lecciones completadas</span>
                  <span>🕒 {course.lastAccessed}</span>
                </div>
                {(course.timeSpent ?? 0) > 0 && (
                  <div className="text-xs text-blue-600 mt-1">
                    ⏱️ Tiempo invertido: {course.timeSpent}h
                  </div>
                )}
              </div>

              {/* Botones de acción mejorados */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3">
                  {course.certificate && (
                  <button className="flex items-center justify-center text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-lg transition-colors text-sm">
                    <Download className="h-4 w-4 mr-2" />
                    <span className="font-medium">Certificado</span>
                    </button>
                  )}
                <Link
                  href={`/cursos/${course.id}`}
                  className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg flex-1 text-sm sm:text-base"
                >
                  <Play className="h-4 w-4 mr-2" />
                  <span>
                    {course.status === 'completed' ? 'Revisar curso' : 
                     course.status === 'in-progress' ? 'Continuar aprendiendo' : 
                     course.status === 'available' ? 'Comenzar curso' : 
                     'Ver curso'}
                    </span>
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Link>
              </div>

              {course.status === 'completed' && course.rating && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tu calificación:</span>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-5 w-5 ${i < course.rating! ? 'fill-current' : ''}`} 
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
          <Image 
            src={studentData.avatar} 
            alt={studentData.name}
            width={80}
            height={80}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{studentData.name}</h3>
            <p className="text-gray-600">{studentData.email}</p>
            <p className="text-sm text-gray-500">Estudiante desde Enero 2025</p>
          </div>
        </div>

        <form className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input 
                type="text" 
                defaultValue={studentData.name.split(' ')[0] || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido
              </label>
              <input 
                type="text" 
                defaultValue={studentData.name.split(' ').slice(1).join(' ') || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
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
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Guardar Cambios
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Configuración</h2>
      
      <div className="space-y-6">
        {/* Notificaciones */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notificaciones</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Notificaciones por email</p>
                <p className="text-sm text-gray-500">Recibe actualizaciones sobre tus cursos</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Recordatorios de estudio</p>
                <p className="text-sm text-gray-500">Te recordaremos continuar tus cursos</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 rounded" />
            </div>
          </div>
        </div>

        {/* Privacidad */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacidad</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Perfil público</p>
                <p className="text-sm text-gray-500">Otros estudiantes pueden ver tu progreso</p>
              </div>
              <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
            </div>
          </div>
        </div>

        {/* Cambiar contraseña */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Seguridad</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña actual
              </label>
              <input 
                type="password" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nueva contraseña
              </label>
              <input 
                type="password" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar nueva contraseña
              </label>
              <input 
                type="password" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Cambiar Contraseña
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Mostrar loading mientras se cargan los datos
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 mb-2">Cargando tu dashboard...</p>
          <p className="text-sm text-gray-500">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no hay datos de usuario después de cargar, mostrar error
  if (!loading && !userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <User className="mx-auto h-16 w-16" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Sesión no válida
          </h1>
          <p className="text-gray-600 mb-8">
            No se pudo verificar tu sesión. Serás redirigido al inicio.
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {/* Botón hamburguesa para móvil */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-3"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-blue-600">MoocAmbiental</h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative hidden sm:block">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Buscar cursos..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-48 lg:w-64"
                />
              </div>
              
              {/* Botón de búsqueda solo para móvil */}
              <button className="sm:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                <Search className="h-5 w-5" />
              </button>
              
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="h-6 w-6" />
              </button>
              
              <div className="flex items-center space-x-3">
                <Image 
                  src={studentData.avatar} 
                  alt={studentData.name}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-gray-900">{studentData.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
          )}
          
          {/* Sidebar */}
          <div className={`
            fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
            w-72 bg-white rounded-none lg:rounded-xl shadow-lg border-r lg:border border-gray-200 
            h-screen lg:h-auto
            transform transition-transform duration-300 ease-in-out lg:transform-none
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            <div className="p-6">
              {/* User Info en Sidebar */}
              <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-gray-200">
                <Image 
                  src={studentData.avatar} 
                  alt={studentData.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{studentData.name}</p>
                  <p className="text-xs text-gray-500 truncate">{studentData.email}</p>
                </div>
              </div>
              
              <nav className="space-y-2">
                <button
                  onClick={() => handleTabChange('courses')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'courses' 
                      ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <BookOpen className="h-5 w-5 mr-3" />
                  Mis Cursos
                </button>
                
                <button
                  onClick={() => handleTabChange('profile')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'profile' 
                      ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <User className="h-5 w-5 mr-3" />
                  Mi Perfil
                </button>
                
                <button 
                  onClick={() => handleTabChange('settings')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'settings' 
                      ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="h-5 w-5 mr-3" />
                  Configuración
                </button>
                
                <hr className="my-4" />
                
                <button 
                  onClick={() => {
                    console.log('🚪 Cerrando sesión...');
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('rememberUser');
                    window.location.href = '/';
                  }}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Cerrar Sesión
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 lg:ml-0">
            {activeTab === 'courses' && renderCourses()}
            {activeTab === 'profile' && renderProfile()}
            {activeTab === 'settings' && renderSettings()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;