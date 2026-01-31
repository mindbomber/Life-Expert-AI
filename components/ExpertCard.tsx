
import React from 'react';
import { ExpertConfig } from '../types';

interface ExpertCardProps {
  expert: ExpertConfig;
  onClick: () => void;
}

export const ExpertCard: React.FC<ExpertCardProps> = ({ expert, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md hover:border-slate-200 group text-center"
    >
      <div className={`text-4xl mb-4 p-4 rounded-full ${expert.bgColor} group-hover:scale-110 transition-transform`}>
        {expert.icon}
      </div>
      <h3 className={`text-xl font-bold mb-2 ${expert.color}`}>{expert.role}</h3>
      <p className="text-sm text-slate-500 line-clamp-2">{expert.description}</p>
    </button>
  );
};
