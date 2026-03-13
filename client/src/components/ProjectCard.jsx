import { Link } from 'react-router-dom';
import { Calendar, Trash2, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const ProjectCard = ({ project, onDelete }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col h-full group">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
            {project.name}
          </h3>
          <button 
            onClick={(e) => {
              e.preventDefault();
              onDelete(project.id);
            }}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
            title="Delete Project"
          >
            <Trash2 size={18} />
          </button>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 h-15">
          {project.description || 'No description provided.'}
        </p>
        
        <div className="flexItems-center text-xs text-gray-500 mt-auto">
          <Calendar size={14} className="mr-1 inline" />
          <span>Created {format(new Date(project.created_at), 'MMM d, yyyy')}</span>
        </div>
      </div>
      
      <div className="bg-gray-50 border-t border-gray-100 p-4">
        <Link 
          to={`/projects/${project.id}`}
          className="w-full flex justify-between items-center text-sm font-semibold text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-4 py-2 rounded-lg transition-colors"
        >
          <span>View Tasks</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
