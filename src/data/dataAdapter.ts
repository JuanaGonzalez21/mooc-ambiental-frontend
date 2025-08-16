// src/data/dataAdapter.ts - CAMBIAR LA RUTA AQUÍ
import { Course } from '@/data/courses';
import { apiRequest } from '@/lib/config'; // ✅ CAMBIO: @/lib/config en lugar de './config'

// Función para convertir datos de BD a formato Course
export function adaptCourseFromDB(dbCourse: any): Course {
  const baseHours = dbCourse.duration_hours || 20;
  
  return {
    id: dbCourse.course_id?.toString() || '',
    title: dbCourse.title || '',
    instructor: dbCourse.instructor_name || 'Instructor no disponible',
    rating: calculateRating(dbCourse.course_id, baseHours),
    totalRatings: calculateTotalRatings(baseHours),
    duration: formatDuration(baseHours),
    shortDuration: formatShortDuration(baseHours),
    level: dbCourse.level as 'Principiante' | 'Intermedio' | 'Avanzado' || 'Principiante',
    originalPrice: calculatePrice(dbCourse.level, baseHours),
    image: getImageForCategory(dbCourse.category_name),
    description: dbCourse.description || '',
    students: calculateStudents(baseHours, dbCourse.level),
    modules: calculateModules(baseHours),
    category: dbCourse.category_name || 'General',
    tags: generateTags(dbCourse.category_name, dbCourse.level)
  };
}

function calculateRating(courseId: number, hours: number): number {
  const base = 4.2;
  const hoursFactor = Math.min(hours / 40, 1) * 0.5;
  const randomFactor = (courseId % 7) * 0.1;
  return Math.min(Math.round((base + hoursFactor + randomFactor) * 10) / 10, 5.0);
}

function calculateTotalRatings(hours: number): number {
  const base = 150;
  const hoursFactor = hours * 25;
  const randomVariation = Math.floor(Math.random() * 500);
  return base + hoursFactor + randomVariation;
}

function calculateStudents(hours: number, level: string): number {
  let base = 1000;
  switch (level) {
    case 'Principiante': base = 8000; break;
    case 'Intermedio': base = 4000; break;
    case 'Avanzado': base = 2000; break;
  }
  const hoursFactor = hours * 50;
  const randomVariation = Math.floor(Math.random() * 3000);
  return base + hoursFactor + randomVariation;
}

function calculatePrice(level: string, hours: number): number {
  let basePrice = 99;
  switch (level) {
    case 'Principiante': basePrice = 129; break;
    case 'Intermedio': basePrice = 179; break;
    case 'Avanzado': basePrice = 249; break;
  }
  return basePrice + (hours * 3);
}

function formatDuration(hours: number): string {
  if (hours <= 15) return '3-4 semanas';
  if (hours <= 25) return '5-6 semanas';
  if (hours <= 35) return '7-8 semanas';
  if (hours <= 45) return '9-10 semanas';
  return '10+ semanas';
}

function formatShortDuration(hours: number): string {
  return `${hours}h`;
}

function calculateModules(hours: number): number {
  return Math.max(Math.ceil(hours / 3.5), 4);
}

function getImageForCategory(categoryName: string): string {
  const imageMap: { [key: string]: string } = {
    'Medio Ambiente': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop&q=80',
    'Cambio Climático': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop&q=80',
    'Conservación del Agua': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop&q=80',
    'Gestión de Residuos': 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=250&fit=crop&q=80',
    'Energías Renovables': 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=250&fit=crop&q=80',
    'Biodiversidad': 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=250&fit=crop&q=80'
  };
  return imageMap[categoryName] || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop&q=80';
}

function generateTags(categoryName: string, level: string): string[] {
  const baseTags = [level];
  const categoryTags: { [key: string]: string[] } = {
    'Medio Ambiente': ['Sostenibilidad', 'Ecosistemas', 'Conservación'],
    'Cambio Climático': ['Clima', 'Calentamiento Global', 'Mitigación'],
    'Conservación del Agua': ['Agua', 'Recursos Hídricos', 'Conservación'],
    'Gestión de Residuos': ['Residuos', 'Reciclaje', 'Economía Circular'],
    'Energías Renovables': ['Solar', 'Eólica', 'Tecnología Verde'],
    'Biodiversidad': ['Especies', 'Conservación', 'Ecosistemas']
  };
  const tags = [...baseTags, ...(categoryTags[categoryName] || ['Ambiental'])];
  if (level === 'Avanzado') tags.push('Especialización');
  if (level === 'Principiante') tags.push('Introducción');
  return tags;
}

// FUNCIONES DE API
export async function getCoursesFromAPI(): Promise<Course[]> {
  try {
    const data = await apiRequest('/api/courses');
    if (data.success && data.courses) {
      console.log(`✅ Cargados ${data.courses.length} cursos desde la BD`);
      return data.courses.map(adaptCourseFromDB);
    }
    throw new Error('No se recibieron cursos válidos de la API');
  } catch (error) {
    console.error('❌ Error obteniendo cursos de la BD:', error);
    throw error;
  }
}

export async function getCourseFromAPI(courseId: string): Promise<Course | null> {
  try {
    const data = await apiRequest(`/api/courses/${courseId}`);
    if (data.success && data.course) {
      console.log(`✅ Curso ${courseId} cargado desde la BD`);
      return adaptCourseFromDB(data.course);
    }
    return null;
  } catch (error) {
    console.error(`❌ Error obteniendo curso ${courseId} de la BD:`, error);
    throw error;
  }
}

export async function getCategoriesFromAPI() {
  try {
    const data = await apiRequest('/api/categories');
    if (data.success && data.categories) {
      console.log(`✅ Cargadas ${data.categories.length} categorías desde la BD`);
      return data.categories;
    }
    throw new Error('No se recibieron categorías válidas de la API');
  } catch (error) {
    console.error('❌ Error obteniendo categorías de la BD:', error);
    throw error;
  }
}

export async function loginAPI(email: string, password: string) {
  try {
    const data = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data.success) {
      console.log('✅ Login exitoso desde la BD');
    }
    return data;
  } catch (error) {
    console.error('❌ Error en login:', error);
    throw error;
  }
}

export async function registerAPI(name: string, email: string, password: string, role: string = 'STUDENT') {
  try {
    const data = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role })
    });
    if (data.success) {
      console.log('✅ Registro exitoso en la BD');
    }
    return data;
  } catch (error) {
    console.error('❌ Error en registro:', error);
    throw error;
  }
}

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await apiRequest('/api/test');
    return true;
  } catch (error) {
    console.error('❌ Sin conexión a la base de datos:', error);
    return false;
  }
}