import React from 'react';
import { Users, Search, MessageSquare, Settings, Shield, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  currentUser: any;
  isAdmin: boolean;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange, currentUser, isAdmin, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'browse', label: 'Browse Skills', icon: Search },
    { id: 'requests', label: 'Swap Requests', icon: MessageSquare },
    { id: 'feedback', label: 'Feedback', icon: Users },
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin', label: 'Admin', icon: Shield });
  }

  const handleNavClick = (viewId: string) => {
    onViewChange(viewId);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Users className="h-8 w-8 text-blue-300" />
            <h1 className="text-xl font-bold text-white hidden sm:block">SkillSwap</h1>
            <h1 className="text-lg font-bold text-white sm:hidden">SS</h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${
                    currentView === item.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-blue-200 hover:bg-blue-700 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          
          {/* User Info and Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <span className="text-blue-200 hidden lg:block text-sm">
              Welcome, {currentUser?.name || 'User'}
            </span>
            
            {/* Settings Button */}
            <button
              onClick={() => handleNavClick('settings')}
              className="p-2 rounded-lg text-blue-200 hover:bg-blue-700 hover:text-white transition-colors hidden sm:block"
            >
              <Settings className="h-5 w-5" />
            </button>
            
            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="p-2 rounded-lg text-blue-200 hover:bg-blue-700 hover:text-white transition-colors hidden sm:block"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-blue-200 hover:bg-blue-700 hover:text-white transition-colors lg:hidden"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-blue-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* User Info */}
              <div className="px-3 py-2 text-blue-200 text-sm border-b border-blue-700 mb-2">
                Welcome, {currentUser?.name || 'User'}
              </div>
              
              {/* Navigation Items */}
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                      currentView === item.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-blue-200 hover:bg-blue-700 hover:text-white'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              
              {/* Settings */}
              <button
                onClick={() => handleNavClick('settings')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                  currentView === 'settings'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-blue-200 hover:bg-blue-700 hover:text-white'
                }`}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </button>
              
              {/* Logout */}
              <button
                onClick={onLogout}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-red-300 hover:bg-red-600 hover:text-white transition-all duration-200"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;