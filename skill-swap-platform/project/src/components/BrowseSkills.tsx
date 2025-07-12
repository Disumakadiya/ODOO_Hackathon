import React, { useState } from 'react';
import { Search, MapPin, Clock, Star, MessageSquare, Eye, EyeOff } from 'lucide-react';
import type { User } from '../types';

interface BrowseSkillsProps {
  users: User[];
  currentUserId: string;
  onSendSwapRequest: (toUserId: string, skillOffered: string, skillWanted: string, message: string) => void;
}

const BrowseSkills: React.FC<BrowseSkillsProps> = ({ users, currentUserId, onSendSwapRequest }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [swapRequest, setSwapRequest] = useState({
    skillOffered: '',
    skillWanted: '',
    message: ''
  });
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Filter users to show only public profiles and exclude current user and banned users
  const filteredUsers = users.filter(user => 
    user.id !== currentUserId && 
    user.isPublic && 
    user.isActive && 
    !user.isBanned &&
    (searchTerm === '' || 
     user.skillsOffered.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
     user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.location?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSendRequest = () => {
    if (selectedUser && swapRequest.skillOffered && swapRequest.skillWanted) {
      onSendSwapRequest(
        selectedUser.id,
        swapRequest.skillOffered,
        swapRequest.skillWanted,
        swapRequest.message
      );
      setShowRequestModal(false);
      setSwapRequest({ skillOffered: '', skillWanted: '', message: '' });
      setSelectedUser(null);
    }
  };

  const openRequestModal = (user: User) => {
    setSelectedUser(user);
    setShowRequestModal(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-100 mb-4">Browse Skills</h1>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by skill, name, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-blue-900 border border-blue-700 rounded-xl text-white placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="p-4 sm:p-6">
              {/* User Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-sm sm:text-base">{user.name}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-blue-300 space-y-1 sm:space-y-0">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{user.rating.toFixed(1)}</span>
                    </div>
                    {user.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{user.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Skills Offered */}
              <div className="mb-4">
                <h4 className="text-xs sm:text-sm font-medium text-blue-300 mb-2">Skills Offered</h4>
                <div className="flex flex-wrap gap-1">
                  {user.skillsOffered.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-600 text-blue-100 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {user.skillsOffered.length > 3 && (
                    <span className="px-2 py-1 bg-blue-700 text-blue-200 text-xs rounded-full">
                      +{user.skillsOffered.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Skills Wanted */}
              <div className="mb-4">
                <h4 className="text-xs sm:text-sm font-medium text-blue-300 mb-2">Looking For</h4>
                <div className="flex flex-wrap gap-1">
                  {user.skillsWanted.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-500 text-blue-100 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {user.skillsWanted.length > 3 && (
                    <span className="px-2 py-1 bg-blue-600 text-blue-200 text-xs rounded-full">
                      +{user.skillsWanted.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Availability */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-blue-300">
                  <Clock className="h-4 w-4" />
                  <span className="truncate">{user.availability.join(', ')}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => openRequestModal(user)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Request Swap</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-blue-400 mb-4">
            <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
          </div>
          <h3 className="text-xl font-semibold text-blue-200 mb-2">No users found</h3>
          <p className="text-blue-400">Try adjusting your search terms or check back later.</p>
        </div>
      )}

      {/* Swap Request Modal */}
      {showRequestModal && selectedUser && (
        <div className="fixed inset-0 bg-blue-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4">
                Send Swap Request to {selectedUser.name}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-blue-300 mb-2">
                    Skill you'll offer
                  </label>
                  <select
                    value={swapRequest.skillOffered}
                    onChange={(e) => setSwapRequest({ ...swapRequest, skillOffered: e.target.value })}
                    className="w-full px-3 py-2 bg-blue-800 border border-blue-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Select a skill to offer</option>
                    {users.find(u => u.id === currentUserId)?.skillsOffered.map((skill) => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-blue-300 mb-2">
                    Skill you want to learn
                  </label>
                  <select
                    value={swapRequest.skillWanted}
                    onChange={(e) => setSwapRequest({ ...swapRequest, skillWanted: e.target.value })}
                    className="w-full px-3 py-2 bg-blue-800 border border-blue-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Select a skill to learn</option>
                    {selectedUser.skillsOffered.map((skill) => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-blue-300 mb-2">
                    Message (optional)
                  </label>
                  <textarea
                    value={swapRequest.message}
                    onChange={(e) => setSwapRequest({ ...swapRequest, message: e.target.value })}
                    placeholder="Tell them why you'd like to swap skills..."
                    rows={3}
                    className="w-full px-3 py-2 bg-blue-800 border border-blue-600 rounded-lg text-white placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 px-4 py-2 border border-blue-600 text-blue-200 rounded-lg hover:bg-blue-800 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendRequest}
                  disabled={!swapRequest.skillOffered || !swapRequest.skillWanted}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseSkills;