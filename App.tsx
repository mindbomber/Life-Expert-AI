
import React, { useState } from 'react';
import { ExpertConfig, ExpertRole } from './types';
import { EXPERTS } from './constants';
import { ExpertCard } from './components/ExpertCard';
import { ChatInterface } from './components/ChatInterface';

const App: React.FC = () => {
  const [selectedExpert, setSelectedExpert] = useState<ExpertConfig | null>(null);

  const handleSelectExpert = (expert: ExpertConfig) => {
    setSelectedExpert(expert);
  };

  const handleBack = () => {
    setSelectedExpert(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4">
      <div className="max-w-4xl w-full">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            LifeExpert <span className="text-blue-600">AI</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Your gateway to professional guidance. Choose an expert and start a consultation instantly.
          </p>
        </header>

        {!selectedExpert ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EXPERTS.map((expert) => (
              <ExpertCard 
                key={expert.role} 
                expert={expert} 
                onClick={() => handleSelectExpert(expert)} 
              />
            ))}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ChatInterface 
              expert={selectedExpert} 
              onBack={handleBack} 
            />
          </div>
        )}

        <footer className="mt-16 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} LifeExpert AI • Powered by Gemini Advanced Intelligence</p>
          <div className="flex justify-center space-x-4 mt-2">
            <span>Evidence-Based</span>
            <span>•</span>
            <span>Secure</span>
            <span>•</span>
            <span>24/7 Access</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
