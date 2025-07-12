import React, { useState } from 'react';
import { User, MapPin, Clock, Eye, EyeOff, Plus, X, Star } from 'lucide-react';
import type { User as UserType } from '../types';

interface ProfileProps {
  user: UserType;
  onUpdateUser: (updatedUser: UserType) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');

  const availabilityOptions = ['Weekdays', 'Weekends', 'Evenings', 'Mornings', 'Flexible'];

  const handleSave = () => {
    onUpdateUser(editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const addSkillOffered = () => {
    if (newSkillOffered.trim()) {
      setEditedUser({
        ...editedUser,
        skillsOffered: [...editedUser.skillsOffered, newSkillOffered.trim()]
      });
      setNewSkillOffered('');
    }
  };

  const removeSkillOffered = (index: number) => {
    setEditedUser({
      ...editedUser,
      skillsOffered: editedUser.skillsOffered.filter((_, i) => i !== index)
    });
  };

  const addSkillWanted = () => {
    if (newSkillWanted.trim()) {
      setEditedUser({
        ...editedUser,
        skillsWanted: [...editedUser.skillsWanted, newSkillWanted.trim()]
      });
      setNewSkillWanted('');
    }
  };

  const removeSkillWanted = (index: number) => {
    setEditedUser({
      ...editedUser,
      skillsWanted: editedUser.skillsWanted.filter((_, i) => i !== index)
    });
  };

  const toggleAvailability = (option: string) => {
    const availability = editedUser.availability.includes(option)
      ? editedUser.availability.filter(a => a !== option)
      : [...editedUser.availability, option];
    setEditedUser({ ...editedUser, availability });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-700 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="h-16 w-16 sm:h-20 sm:w-20 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 sm:h-10 sm:w-10 text-blue-100" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">{user.name}</h1>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 space-y-1 sm:space-y-0">
                  <div className="flex items-center space-x-1 text-blue-200">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{user.rating.toFixed(1)} ({user.totalRatings} reviews)</span>
                  </div>
                  <div className="flex items-center space-x-1 text-blue-200">
                    {user.isPublic ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    <span className="text-sm">{user.isPublic ? 'Public Profile' : 'Private Profile'}</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
              className="px-4 py-2 sm:px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-sm sm:text-base"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-100">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-blue-300 mb-2">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser.name}
                    onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                    className="w-full px-4 py-2 bg-blue-800 border border-blue-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                ) : (
                  <p className="text-blue-100">{user.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-300 mb-2">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser.location || ''}
                    onChange={(e) => setEditedUser({ ...editedUser, location: e.target.value })}
                    placeholder="Enter your location"
                    className="w-full px-4 py-2 bg-blue-800 border border-blue-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-blue-100">
                    <MapPin className="h-4 w-4" />
                    <span>{user.location || 'Not specified'}</span>
                  </div>
                )}
              </div>

              {isEditing && (
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editedUser.isPublic}
                      onChange={(e) => setEditedUser({ ...editedUser, isPublic: e.target.checked })}
                      className="rounded border-blue-600 text-blue-600 focus:ring-blue-400"
                    />
                    <span className="text-blue-200">Make profile public</span>
                  </label>
                </div>
              )}
            </div>

            {/* Availability */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-100">Availability</h3>
              <div className="flex items-center space-x-2 text-blue-300 mb-3">
                <Clock className="h-4 w-4" />
                <span>When are you available?</span>
              </div>
              
              {isEditing ? (
                <div className="space-y-2">
                  {availabilityOptions.map((option) => (
                    <label key={option} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editedUser.availability.includes(option)}
                        onChange={() => toggleAvailability(option)}
                        className="rounded border-blue-600 text-blue-600 focus:ring-blue-400"
                      />
                      <span className="text-blue-200 text-sm sm:text-base">{option}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {user.availability.map((time) => (
                    <span
                      key={time}
                      className="px-2 py-1 sm:px-3 bg-blue-700 text-blue-100 rounded-full text-xs sm:text-sm"
                    >
                      {time}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Skills Offered */}
          <div>
            <h3 className="text-lg font-semibold text-blue-100 mb-4">Skills I Offer</h3>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {(isEditing ? editedUser : user).skillsOffered.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-1 sm:space-x-2 px-2 py-1 sm:px-3 sm:py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg text-sm sm:text-base"
                  >
                    <span>{skill}</span>
                    {isEditing && (
                      <button
                        onClick={() => removeSkillOffered(index)}
                        className="hover:bg-blue-400 rounded p-1"
                      >
                        <X className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              {isEditing && (
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <input
                    type="text"
                    value={newSkillOffered}
                    onChange={(e) => setNewSkillOffered(e.target.value)}
                    placeholder="Add a skill you can offer"
                    className="flex-1 px-3 py-2 sm:px-4 bg-blue-800 border border-blue-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                    onKeyPress={(e) => e.key === 'Enter' && addSkillOffered()}
                  />
                  <button
                    onClick={addSkillOffered}
                    className="px-3 py-2 sm:px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Skills Wanted */}
          <div>
            <h3 className="text-lg font-semibold text-blue-100 mb-4">Skills I Want to Learn</h3>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {(isEditing ? editedUser : user).skillsWanted.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-1 sm:space-x-2 px-2 py-1 sm:px-3 sm:py-2 bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg text-sm sm:text-base"
                  >
                    <span>{skill}</span>
                    {isEditing && (
                      <button
                        onClick={() => removeSkillWanted(index)}
                        className="hover:bg-blue-300 rounded p-1"
                      >
                        <X className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              {isEditing && (
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <input
                    type="text"
                    value={newSkillWanted}
                    onChange={(e) => setNewSkillWanted(e.target.value)}
                    placeholder="Add a skill you want to learn"
                    className="flex-1 px-3 py-2 sm:px-4 bg-blue-800 border border-blue-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                    onKeyPress={(e) => e.key === 'Enter' && addSkillWanted()}
                  />
                  <button
                    onClick={addSkillWanted}
                    className="px-3 py-2 sm:px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-blue-700">
              <button
                onClick={handleCancel}
                className="px-4 py-2 sm:px-6 border border-blue-600 text-blue-200 rounded-lg hover:bg-blue-800 transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 sm:px-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all text-sm sm:text-base"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;