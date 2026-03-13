import { Edit2, Trash2, Clock, CheckCircle, Circle } from 'lucide-react';
import { format } from 'date-fns';
import Badge from './Badge';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';
  
  // Status toggle icon generator
  const renderStatusIcon = () => {
    switch (task.status) {
      case 'completed':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'in-progress':
        return <Clock size={20} className="text-yellow-500" />;
      default:
        return <Circle size={20} className="text-gray-300 group-hover:text-gray-400 transition-colors" />;
    }
  };

  const handleStatusToggle = () => {
    let nextStatus = 'todo';
    if (task.status === 'todo') nextStatus = 'in-progress';
    else if (task.status === 'in-progress') nextStatus = 'completed';
    
    onStatusChange(task.id, nextStatus);
  };

  return (
    <div className={`bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition-all ${task.status === 'completed' ? 'border-green-200 bg-gray-50/50' : 'border-gray-200'}`}>
      <div className="flex gap-3">
        <button 
          onClick={handleStatusToggle}
          className="mt-1 flex-shrink-0 group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 rounded-full"
          title={`Mark as ${task.status === 'completed' ? 'todo' : task.status === 'todo' ? 'in-progress' : 'completed'}`}
        >
          {renderStatusIcon()}
        </button>
        
        <div className="flex-grow min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h4 className={`font-semibold text-gray-900 truncate pr-4 ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </h4>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onEdit(task)}
                className="text-gray-400 hover:text-primary-600 hover:bg-primary-50 p-1.5 rounded-md transition-colors"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => onDelete(task.id)}
                className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          
          {task.description && (
            <p className={`text-sm mb-3 line-clamp-2 ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-600'}`}>
              {task.description}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <div className="relative inline-block">
              <select
                value={task.status}
                onChange={(e) => onStatusChange(task.id, e.target.value)}
                className={`appearance-none px-2.5 py-0.5 pr-6 rounded-full text-xs font-medium border cursor-pointer outline-none hover:opacity-90 transition-opacity ${
                  task.status === 'todo' ? 'bg-gray-100 text-gray-700 border-gray-200' :
                  task.status === 'in-progress' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                  'bg-green-100 text-green-700 border-green-200'
                }`}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-gray-500">
                <svg className="h-3 w-3 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
            <Badge type="priority" value={task.priority} />
            
            {task.due_date && (
              <span className={`text-xs ml-auto font-medium ${isOverdue ? 'text-red-600 bg-red-50 px-2 py-1 rounded-md' : 'text-gray-500'}`}>
                Due {format(new Date(task.due_date), 'MMM d, yyyy')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
