import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Trophy } from 'lucide-react';

const CategorySelection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        <button
          onClick={() => navigate('/handball')}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-8 transition-transform hover:scale-105 hover:shadow-xl"
        >
          <div className="absolute inset-0 bg-black opacity-0 transition-opacity group-hover:opacity-10"></div>
          <div className="flex flex-col items-center justify-center space-y-4 text-white">
            <Trophy size={64} className="transition-transform group-hover:scale-110" />
            <span className="text-3xl font-bold tracking-wider">Handball</span>
          </div>
        </button>

        <button
          onClick={() => navigate('/physical')}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-8 transition-transform hover:scale-105 hover:shadow-xl"
        >
          <div className="absolute inset-0 bg-black opacity-0 transition-opacity group-hover:opacity-10"></div>
          <div className="flex flex-col items-center justify-center space-y-4 text-white">
            <Dumbbell size={64} className="transition-transform group-hover:scale-110" />
            <span className="text-3xl font-bold tracking-wider">Physical</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default CategorySelection;