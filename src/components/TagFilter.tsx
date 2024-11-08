import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { TagGroup } from '../lib/supabase-types';

interface TagFilterProps {
  tagGroups: TagGroup[];
  activeTags: { [key: string]: string[] };
  onTagToggle: (group: string, tagName: string) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ tagGroups, activeTags, onTagToggle }) => {
  const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>({});

  const toggleGroup = (group: string) => {
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  return (
    <div className="mb-6 flex flex-wrap gap-4">
      {tagGroups.map((group) => {
        const activeCount = activeTags[group.name]?.length || 0;
        
        return (
          <div key={group.id} className="relative">
            <button
              onClick={() => toggleGroup(group.name)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center gap-2"
            >
              <span>{group.name}</span>
              {activeCount > 0 && (
                <span className="inline-flex items-center justify-center bg-blue-100 text-blue-600 rounded-full w-5 h-5 text-xs font-semibold">
                  {activeCount}
                </span>
              )}
              {openGroups[group.name] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openGroups[group.name] && (
              <div className="absolute z-10 mt-1 w-56 bg-white border border-gray-300 rounded-md shadow-lg">
                <div className="py-1">
                  {group.tags.map((tag) => (
                    <label key={tag} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={activeTags[group.name]?.includes(tag) || false}
                        onChange={() => onTagToggle(group.name, tag)}
                        className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TagFilter;