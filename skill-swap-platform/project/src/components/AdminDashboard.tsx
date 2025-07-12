import React, { useState } from 'react';
import { Shield, Users, MessageSquare, Ban, Download, Send, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import type { User, SwapRequest, Feedback, AdminMessage, SkillReport } from '../types';

interface AdminDashboardProps {
  users: User[];
  swapRequests: SwapRequest[];
  feedback: Feedback[];
  adminMessages: AdminMessage[];
  onBanUser: (userId: string) => void;
  onUnbanUser: (userId: string) => void;
  onSendAdminMessage: (title: string, content: string, type: 'info' | 'warning' | 'maintenance') => void;
  onDownloadReport: (type: 'users' | 'swaps' | 'feedback') => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  users,
  swapRequests,
  feedback,
  adminMessages,
  onBanUser,
  onUnbanUser,
  onSendAdminMessage,
  onDownloadReport
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'swaps' | 'messages'>('overview');
  const [messageForm, setMessageForm] = useState({
    title: '',
    content: '',
    type: 'info' as 'info' | 'warning' | 'maintenance'
  });
  const [showMessageModal, setShowMessageModal] = useState(false);

  // Calculate statistics
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.isActive && !u.isBanned).length,
    bannedUsers: users.filter(u => u.isBanned).length,
    totalSwaps: swapRequests.length,
    pendingSwaps: swapRequests.filter(s => s.status === 'pending').length,
    completedSwaps: swapRequests.filter(s => s.status === 'completed').length,
    totalFeedback: feedback.length,
    averageRating: feedback.length > 0 ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length : 0
  };

  // Skill analytics
  const skillAnalytics: SkillReport[] = React.useMemo(() => {
    const skillMap = new Map<string, { offered: number; wanted: number; swapped: number }>();

    users.forEach(user => {
      user.skillsOffered.forEach(skill => {
        const current = skillMap.get(skill) || { offered: 0, wanted: 0, swapped: 0 };
        skillMap.set(skill, { ...current, offered: current.offered + 1 });
      });
      
      user.skillsWanted.forEach(skill => {
        const current = skillMap.get(skill) || { offered: 0, wanted: 0, swapped: 0 };
        skillMap.set(skill, { ...current, wanted: current.wanted + 1 });
      });
    });

    swapRequests.filter(s => s.status === 'completed').forEach(swap => {
      const current = skillMap.get(swap.skillOffered) || { offered: 0, wanted: 0, swapped: 0 };
      skillMap.set(swap.skillOffered, { ...current, swapped: current.swapped + 1 });
    });

    return Array.from(skillMap.entries())
      .map(([skillName, data]) => ({
        skillName,
        offeredCount: data.offered,
        wantedCount: data.wanted,
        swapCount: data.swapped
      }))
      .sort((a, b) => b.swapCount - a.swapCount);
  }, [users, swapRequests]);

  const handleSendMessage = () => {
    if (messageForm.title && messageForm.content) {
      onSendAdminMessage(messageForm.title, messageForm.content, messageForm.type);
      setMessageForm({ title: '', content: '', type: 'info' });
      setShowMessageModal(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Shield className="h-8 w-8 text-blue-400" />
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-100">Admin Dashboard</h1>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-blue-900 rounded-lg p-1">
        {[
          { id: 'overview', label: 'Overview', icon: Shield },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'swaps', label: 'Swaps', icon: MessageSquare },
          { id: 'messages', label: 'Messages', icon: Send }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-2 sm:px-4 rounded-lg transition-all flex items-center justify-center space-x-1 sm:space-x-2 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-blue-200 hover:bg-blue-800'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs sm:text-sm">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300 text-xs sm:text-sm">Total Users</p>
                  <p className="text-xl sm:text-2xl font-bold text-white">{stats.totalUsers}</p>
                </div>
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-300 text-xs sm:text-sm">Active Users</p>
                  <p className="text-xl sm:text-2xl font-bold text-white">{stats.activeUsers}</p>
                </div>
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-900 to-red-800 rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-300 text-xs sm:text-sm">Banned Users</p>
                  <p className="text-xl sm:text-2xl font-bold text-white">{stats.bannedUsers}</p>
                </div>
                <Ban className="h-6 w-6 sm:h-8 sm:w-8 text-red-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-xs sm:text-sm">Total Swaps</p>
                  <p className="text-xl sm:text-2xl font-bold text-white">{stats.totalSwaps}</p>
                </div>
                <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
              </div>
            </div>
          </div>

          {/* Top Skills */}
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Top Skills</h3>
            <div className="space-y-3">
              {skillAnalytics.slice(0, 10).map((skill, index) => (
                <div key={skill.skillName} className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <span className="text-blue-300 font-medium">#{index + 1}</span>
                    <span className="text-white text-sm sm:text-base">{skill.skillName}</span>
                  </div>
                  <div className="flex space-x-2 sm:space-x-4 text-xs sm:text-sm">
                    <span className="text-blue-300">{skill.offeredCount} offered</span>
                    <span className="text-blue-400">{skill.wantedCount} wanted</span>
                    <span className="text-green-400">{skill.swapCount} swapped</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Download Reports */}
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Download Reports</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { type: 'users' as const, label: 'User Activity Report', desc: 'User registrations, activity, and status' },
                { type: 'swaps' as const, label: 'Swap Statistics', desc: 'Swap requests, completion rates, and trends' },
                { type: 'feedback' as const, label: 'Feedback Analysis', desc: 'Ratings, comments, and user satisfaction' }
              ].map((report) => (
                <button
                  key={report.type}
                  onClick={() => onDownloadReport(report.type)}
                  className="bg-blue-800 hover:bg-blue-700 p-4 rounded-lg text-left transition-colors"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <Download className="h-5 w-5 text-blue-400" />
                    <span className="font-medium text-white text-sm sm:text-base">{report.label}</span>
                  </div>
                  <p className="text-blue-300 text-xs sm:text-sm">{report.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-semibold text-white">User Management</h2>
          </div>
          
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-800">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">User</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider hidden sm:table-cell">Skills</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">Status</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-700">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 sm:h-10 sm:w-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-2 sm:ml-4">
                            <div className="text-xs sm:text-sm font-medium text-white">{user.name}</div>
                            <div className="text-xs text-blue-300 hidden sm:block">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 hidden sm:table-cell">
                        <div className="text-xs sm:text-sm text-blue-200">
                          <div>Offers: {user.skillsOffered.length}</div>
                          <div>Wants: {user.skillsWanted.length}</div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isBanned 
                            ? 'bg-red-600 text-red-100'
                            : user.isActive 
                              ? 'bg-green-600 text-green-100'
                              : 'bg-gray-600 text-gray-100'
                        }`}>
                          {user.isBanned ? 'Banned' : user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                        {user.isBanned ? (
                          <button
                            onClick={() => onUnbanUser(user.id)}
                            className="text-green-400 hover:text-green-300"
                          >
                            Unban
                          </button>
                        ) : (
                          <button
                            onClick={() => onBanUser(user.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Ban
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'swaps' && (
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold text-white">Swap Monitoring</h2>
          
          <div className="grid gap-4">
            {swapRequests.map((swap) => (
              <div key={swap.id} className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-semibold text-white text-sm sm:text-base">
                        {swap.fromUserName} → {swap.toUserName}
                      </h3>
                      <p className="text-blue-300 text-xs sm:text-sm">{swap.skillOffered} ↔ {swap.skillWanted}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm ${
                      swap.status === 'pending' ? 'bg-yellow-600 text-yellow-100' :
                      swap.status === 'accepted' ? 'bg-green-600 text-green-100' :
                      swap.status === 'rejected' ? 'bg-red-600 text-red-100' :
                      swap.status === 'completed' ? 'bg-blue-600 text-blue-100' :
                      'bg-gray-600 text-gray-100'
                    }`}>
                      {swap.status}
                    </span>
                    <span className="text-blue-300 text-xs sm:text-sm hidden sm:inline">
                      {new Date(swap.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                {swap.message && (
                  <div className="bg-blue-800 rounded-lg p-3">
                    <p className="text-blue-100 text-xs sm:text-sm">{swap.message}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-semibold text-white">Platform Messages</h2>
            <button
              onClick={() => setShowMessageModal(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-2 px-3 sm:px-4 rounded-lg transition-all flex items-center space-x-2 text-sm sm:text-base"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Send Message</span>
              <span className="sm:hidden">Send</span>
            </button>
          </div>

          <div className="space-y-4">
            {adminMessages.map((message) => (
              <div key={message.id} className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white text-sm sm:text-base">{message.title}</h3>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm ${
                      message.type === 'info' ? 'bg-blue-600 text-blue-100' :
                      message.type === 'warning' ? 'bg-yellow-600 text-yellow-100' :
                      'bg-red-600 text-red-100'
                    }`}>
                      {message.type}
                    </span>
                    <span className="text-blue-300 text-xs sm:text-sm hidden sm:inline">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <p className="text-blue-200 text-sm sm:text-base">{message.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-blue-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Send Platform Message</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-blue-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={messageForm.title}
                    onChange={(e) => setMessageForm({ ...messageForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-blue-800 border border-blue-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-blue-300 mb-2">Type</label>
                  <select
                    value={messageForm.type}
                    onChange={(e) => setMessageForm({ ...messageForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-blue-800 border border-blue-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="info">Information</option>
                    <option value="warning">Warning</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-blue-300 mb-2">Content</label>
                  <textarea
                    value={messageForm.content}
                    onChange={(e) => setMessageForm({ ...messageForm, content: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 bg-blue-800 border border-blue-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="flex-1 px-4 py-2 border border-blue-600 text-blue-200 rounded-lg hover:bg-blue-800 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!messageForm.title || !messageForm.content}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;