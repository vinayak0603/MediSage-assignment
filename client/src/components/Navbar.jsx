import { Link } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
                <LayoutDashboard size={24} />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">Project Manager</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
