import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, ArrowLeft, Filter, ArrowUpDown } from 'lucide-react';
import { projectApi } from '../api/projectApi';
import { taskApi } from '../api/taskApi';
import TaskCard from '../components/TaskCard';
import Modal from '../components/Modal';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters and Sorting
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState(''); // 'due_date' or '-due_date'
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    status: 'todo', 
    priority: 'medium',
    due_date: '' 
  });
  const [formError, setFormError] = useState('');

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [projectRes, tasksRes] = await Promise.all([
        projectApi.getProject(id),
        taskApi.getTasks(id, { status: filterStatus, sortBy })
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error('Error fetching project details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, filterStatus, sortBy]); // Re-fetch when filters change

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Delete this task?')) {
      try {
        await taskApi.deleteTask(taskId);
        fetchData(); // Refresh list
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskApi.updateTask(taskId, { status: newStatus });
      fetchData(); // Refresh to ensure correct order/filtering is applied
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const openModal = (task = null) => {
    setFormError('');
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : ''
      });
    } else {
      setEditingTask(null);
      setFormData({ 
        title: '', 
        description: '', 
        status: 'todo', 
        priority: 'medium',
        due_date: '' 
      });
    }
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title.trim()) {
      setFormError('Task title is required');
      return;
    }

    try {
      if (editingTask) {
        await taskApi.updateTask(editingTask.id, formData);
      } else {
        await taskApi.createTask(id, formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      setFormError(error.response?.data?.error || 'Failed to save task');
    }
  };

  if (isLoading && !project) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Project not found</h2>
        <Link to="/" className="text-primary-600 hover:underline">Return to Projects</Link>
      </div>
    );
  }

  // Calculate stats
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === 'completed').length;
  const progressPercent = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header section */}
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-4 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Back to Projects
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
            <p className="text-gray-600 max-w-2xl">{project.description}</p>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg flex items-center font-medium transition-colors shadow-sm ml-4 whitespace-nowrap"
          >
            <Plus size={18} className="mr-2" />
            Add Task
          </button>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium text-gray-700">Project Progress</span>
          <span className="font-bold text-gray-900">{progressPercent}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div 
            className="bg-green-500 h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 mt-2 text-right">
          {doneTasks} of {totalTasks} tasks completed
        </div>
      </div>

      {/* Toolbar: Filters and Sorting */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200 mb-6 gap-3">
        <div className="flex items-center w-full sm:w-auto">
          <Filter size={18} className="text-gray-400 mx-2" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-transparent border-none text-sm font-medium text-gray-700 focus:ring-0 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div className="flex items-center w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-gray-200 pt-3 sm:pt-0 pl-0 sm:pl-3">
          <ArrowUpDown size={18} className="text-gray-400 mx-2" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent border-none text-sm font-medium text-gray-700 focus:ring-0 cursor-pointer"
          >
            <option value="">Default Sorting</option>
            <option value="due_date">Due Date (Earliest)</option>
            <option value="-due_date">Due Date (Latest)</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 border-dashed p-12 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks found</h3>
          <p className="text-gray-500 mb-4 text-sm">Create a task to get started or adjust your filters.</p>
          <button
            onClick={() => openModal()}
            className="text-primary-600 font-medium hover:text-primary-700"
          >
            Create Task →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onEdit={openModal}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Task Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingTask ? 'Edit Task' : 'Add New Task'}
      >
        <form onSubmit={handleFormSubmit}>
          {formError && (
            <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {formError}
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              placeholder="What needs to be done?"
              autoFocus
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              placeholder="Additional details..."
              rows="2"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({...formData, due_date: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors font-medium shadow-sm"
            >
              {editingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectDetailPage;
