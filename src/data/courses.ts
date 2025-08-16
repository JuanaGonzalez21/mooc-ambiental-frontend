// src/data/courses.ts - REEMPLAZAR COMPLETAMENTE
export interface Course {
  id: string;
  title: string;
  instructor: string;
  rating: number;
  totalRatings: number;
  duration: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzado';
  originalPrice?: number;
  image: string;
  description: string;
  students: number;
  modules: number;
  category: string;
  tags: string[];
  shortDuration?: string;
}

// Fallback mínimo SOLO para casos de error de conexión
const EMERGENCY_FALLBACK: Course[] = [
  {
    id: 'fallback-1',
    title: 'Error de Conexión - Contenido Temporal',
    instructor: 'Sistema',
    rating: 0,
    totalRatings: 0,
    duration: 'No disponible',
    shortDuration: 'N/A',
    level: 'Principiante',
    originalPrice: 0,
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop',
    description: 'Contenido temporal mostrado por error de conexión con la base de datos. Por favor, recarga la página.',
    students: 0,
    modules: 0,
    category: 'Sistema',
    tags: ['Error', 'Temporal']
  }
];

// ❌ CAMBIO: Importar desde @/data/dataAdapter en lugar de './dataAdapter'
import { getCoursesFromAPI, getCourseFromAPI } from '@/data/dataAdapter';

// Estas funciones SIEMPRE usan la API
export const getFeaturedCourses = async (): Promise<Course[]> => {
  try {
    const courses = await getCoursesFromAPI();
    return courses.slice(0, 3);
  } catch (error) {
    console.error('❌ Error obteniendo cursos destacados:', error);
    return EMERGENCY_FALLBACK.slice(0, 3);
  }
};

export const getAllCourses = async (): Promise<Course[]> => {
  try {
    const courses = await getCoursesFromAPI();
    return courses.length > 0 ? courses : EMERGENCY_FALLBACK;
  } catch (error) {
    console.error('❌ Error obteniendo todos los cursos:', error);
    return EMERGENCY_FALLBACK;
  }
};

export const getCourseById = async (id: string): Promise<Course | undefined> => {
  try {
    const course = await getCourseFromAPI(id);
    return course || undefined;
  } catch (error) {
    console.error('❌ Error obteniendo curso por ID:', error);
    return undefined;
  }
};

// Función para verificar si estamos usando fallback
export const isUsingFallback = (courses: Course[]): boolean => {
  return courses.some(course => course.id.startsWith('fallback-'));
};