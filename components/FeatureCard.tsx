import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  delay?: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, delay = 0 }) => {
  return (
    <div 
      className="p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:border-blue-800 hover:bg-gray-800/80 transition-all duration-300 group h-full"
    >
      <div className="h-12 w-12 rounded-lg bg-blue-900/30 flex items-center justify-center mb-4 text-blue-400 group-hover:text-blue-300 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
};