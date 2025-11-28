
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      name: 'Dashboard',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v14H8V5z" />
        </svg>
      ),
      path: '/dashboard'
    },
    {
      name: 'Members',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      path: '/members'
    },
    {
      name: 'Plans',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      path: '/plans'
    },
    {
      name: 'Diet Plans',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ),
      path: '/diet-plans'
    },
    {
      name: 'Announcements',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ),
      path: '/announcements'
    },
    {
      name: 'Workout',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      path: '/workout'
    }
    ,
    // ...existing code...
  ];

  const handleNavigate = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
    if (onClose) onClose();
  };

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0 lg:w-64 bg-gray-900 border-r border-gray-700 h-screen">
        <div className="flex flex-col w-full h-full">
          <div className="flex items-center justify-center h-16 px-4 bg-gray-900 border-b border-gray-700">
            <img src="/logoFull.jpeg" alt="Logo" className="h-10 w-auto rounded-lg" />
          </div>
          <nav className="flex-1 py-4 px-2 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-all duration-200 ${location.pathname === item.path ? 'bg-gray-800 font-bold text-white' : ''}`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </nav>
          <div className="px-4 pb-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 rounded-lg text-red-400 hover:bg-gray-800 transition-all duration-200"
            >
              <span className="mr-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
                </svg>
              </span>
              Logout
            </button>
          </div>
          <div className="px-4 pb-4 text-center">
            <button
              onClick={() => handleNavigate('/developer')}
              className="text-xs text-gray-400 hover:text-blue-400 underline"
              style={{ background: 'none', border: 'none', padding: 0, margin: 0 }}
            >
              Developer Info
            </button>
          </div>
        </div>
      </div>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 flex lg:hidden transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col h-full">
          <div className="flex items-center justify-center h-16 px-4 bg-gray-900 border-b border-gray-700">
            <img src="/logoFull.jpeg" alt="Logo" className="h-10 w-auto rounded-lg" />
          </div>
          <nav className="flex-1 py-4 px-2 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-all duration-200 ${location.pathname === item.path ? 'bg-gray-800 font-bold text-white' : ''}`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </nav>
          <div className="px-4 pb-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 rounded-lg text-red-400 hover:bg-gray-800 transition-all duration-200"
            >
              <span className="mr-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
                </svg>
              </span>
              Logout
            </button>
          </div>
          <div className="px-4 pb-4 text-center">
            <button
              onClick={() => handleNavigate('/developer')}
              className="text-xs text-gray-400 hover:text-blue-400 underline"
              style={{ background: 'none', border: 'none', padding: 0, margin: 0 }}
            >
              Developer Info
            </button>
          </div>
        </div>
        <div className="flex-1 bg-black bg-opacity-50" onClick={onClose}></div>
      </div>
    </>
  );
};

export default Sidebar;