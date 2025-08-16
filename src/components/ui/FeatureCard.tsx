// src/components/ui/FeatureCard.tsx
import React from 'react';
import { Feature } from '@/types';

interface FeatureCardProps {
  feature: Feature;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  return (
    <div className="text-center">
      <div className="flex justify-center">
        <div className="h-12 w-12 text-blue-600">
          {feature.icon}
        </div>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">
        {feature.title}
      </h3>
      <p className="mt-2 text-gray-600">
        {feature.description}
      </p>
    </div>
  );
};

export default FeatureCard;