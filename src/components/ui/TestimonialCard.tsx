// src/components/ui/TestimonialCard.tsx
import React from 'react';
import { Testimonial } from '@/types';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <p className="text-gray-600 italic">
        {testimonial.content}
      </p>
      <div className="mt-4 flex items-center">
        <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
          {testimonial.avatar ? (
            <img 
              src={testimonial.avatar} 
              alt={testimonial.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <span className="text-gray-600 text-sm">
              {testimonial.name.charAt(0)}
            </span>
          )}
        </div>
        <div className="ml-3">
          <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
          <p className="text-sm text-gray-600">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;