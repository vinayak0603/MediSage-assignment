import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { projectApi } from '../api/projectApi';
import ProjectCard from '../components/ProjectCard';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formError, setFormError] = useState('');

  const fetchProjects = async (currentPage) => {
    try {
      setIsLoading(true);
      const res = await projectApi.getProjects(currentPage);
      setProjects(res.data);
      setTotalPages(res.pages);
      setPage(res.page);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(page);
  }, [page]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project? All associated tasks will also be deleted.')) {
      try {
        await projectApi.deleteProject(id);
        fetchProjects(page); // Refresh list
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Project name is required');
      return;
    }

    try {
      await projectApi.createProject(formData);
      setIsModalOpen(false);
      setFormData({ name: '', description: '' });
      fetchProjects(1); // Go back to page 1 to see the new project
    } catch (error) {
      setFormError(error.response?.data?.error || 'Failed to create project');
      if (error.response?.data?.errors) {
        setFormError(error.response.data.errors.map(err => Object.values(err)[0]).join(', '));
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage your team's projects and track progress.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg flex items-center font-medium transition-colors shadow-sm"
        >
          <Plus size={18} className="mr-2" />
          New Project
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 border-dashed p-12 text-center">
          <div className="mx-auto h-12 w-12 text-gray-400 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            <Plus size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No projects yet</h3>
          <p className="text-gray-500 mb-4 text-sm">Get started by creating your first project.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-primary-600 font-medium hover:text-primary-700"
          >
            Create Project →
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {projects.map(project => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onDelete={handleDelete}
              />
            ))}
          </div>
          <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            onPageChange={setPage} 
          />
        </>
      )}

      {/* Create Project Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Create New Project"
      >
        <form onSubmit={handleCreateSubmit}>
          {formError && (
            <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {formError}
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow"
              placeholder="e.g. Website Redesign"
              autoFocus
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow"
              placeholder="Brief description of the project..."
              rows="3"
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
              Create Project
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectsPage;
