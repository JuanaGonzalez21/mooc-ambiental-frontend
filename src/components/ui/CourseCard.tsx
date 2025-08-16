// src/components/ui/CourseCard.tsx
import React from 'react';
import { Star } from 'lucide-react';
import { Course } from '@/data/courses';

interface CourseCardProps {
  course: Course;
  showShortDuration?: boolean; // Para mostrar duración corta en homepage
}

const   CourseCard: React.FC<CourseCardProps> = ({ course, showShortDuration = true }) => {
  // Usar shortDuration para homepage, duration normal para página de cursos
  const displayDuration = showShortDuration && course.shortDuration ? course.shortDuration : course.duration;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          {course.image ? (
            <img 
              src={course.image} 
              alt={course.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-400">Imagen del curso</div>
          )}
        </div>
        <span className="absolute top-4 left-4 bg-blue-600 text-white px-2 py-1 rounded text-sm">
          {course.level}
        </span>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {course.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4">{course.instructor}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${i < course.rating ? 'fill-current' : ''}`} 
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">({course.totalRatings.toLocaleString()})</span>
          </div>
          <span className="text-sm text-gray-600">{displayDuration}</span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;