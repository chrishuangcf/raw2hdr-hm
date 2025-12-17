import React from 'react';

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-xl ${className}`}>
      <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">{title}</h3>
      <div className="text-gray-300 space-y-3 leading-relaxed">
        {children}
      </div>
    </div>
  );
};