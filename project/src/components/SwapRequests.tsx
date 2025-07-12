import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, Trash2, MessageSquare, User, Star } from 'lucide-react';
import type { SwapRequest } from '../types';

interface SwapRequestsProps {
  swapRequests: SwapRequest[];
  currentUserId: string;
  onUpdateSwapRequest: (id: string, status: 'accepted' | 'rejected' | 'cancelled') => void;
  onDeleteSwapRequest: (id: string) => void;
}

const SwapRequests: React.FC<SwapRequestsProps> = ({
  swapRequests,
  currentUserId,
  onUpdateSwapRequest,
  onDeleteSwapRequest
}) => {
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

  const receivedRequests = swapRequests.filter(req => req.toUserId === currentUserId);
  const sentRequests = swapRequests.filter(req => req.fromUserId === currentUserId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-600 text-yellow-100';
      case 'accepted': return 'bg-green-600 text-green-100';
      case 'rejected': return 'bg-red-600 text-red-100';
      case 'completed': return 'bg-blue-600 text-blue-100';
      case 'cancelled': return 'bg-gray-600 text-gray-100';
      default: return 'bg-gray-600 text-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'completed': return <Star className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const RequestCard: React.FC<{ request: SwapRequest; isReceived: boolean }> = ({ request, isReceived }) => (
    <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 sm:h-10 sm:w-10 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-blue-100" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm sm:text-base">
              {isReceived ? request.fromUserName : request.toUserName}
            </h3>
            <p className="text-xs sm:text-sm text-blue-300">
              {new Date(request.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className={`flex items-center space-x-1 sm:space-x-2 px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm ${getStatusColor(request.status)}`}>
          {getStatusIcon(request.status)}
          <span className="capitalize hidden sm:inline">{request.status}</span>
        </div>
      </div>

      {/* Skills Exchange */}
      <div className="mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-blue-800 rounded-lg p-3">
            <h4 className="text-xs sm:text-sm font-medium text-blue-300 mb-1">
              {isReceived ? 'They offer:' : 'You offer:'}
            </h4>
            <span className="text-white font-medium text-sm sm:text-base">{request.skillOffered}</span>
          </div>
          
          <div className="bg-blue-700 rounded-lg p-3">
            <h4 className="text-xs sm:text-sm font-medium text-blue-300 mb-1">
              {isReceived ? 'They want:' : 'You want:'}
            </h4>
            <span className="text-white font-medium text-sm sm:text-base">{request.skillWanted}</span>
          </div>
        </div>
      </div>

      {/* Message */}
      {request.message && (
        <div className="mb-4">
          <div className="bg-blue-800 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <MessageSquare className="h-4 w-4 text-blue-300" />
              <span className="text-xs sm:text-sm font-medium text-blue-300">Message:</span>
            </div>
            <p className="text-blue-100 text-xs sm:text-sm">{request.message}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        {isReceived && request.status === 'pending' && (
          <>
            <button
              onClick={() => onUpdateSwapRequest(request.id, 'accepted')}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Accept</span>
            </button>
            <button
              onClick={() => onUpdateSwapRequest(request.id, 'rejected')}
              className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <XCircle className="h-4 w-4" />
              <span>Reject</span>
            </button>
          </>
        )}
        
        {!isReceived && request.status === 'pending' && (
          <button
            onClick={() => onUpdateSwapRequest(request.id, 'cancelled')}
            className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
          >
            <XCircle className="h-4 w-4" />
            <span>Cancel</span>
          </button>
        )}

        {(request.status === 'rejected' || request.status === 'cancelled') && !isReceived && (
          <button
            onClick={() => onDeleteSwapRequest(request.id)}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-blue-100 mb-6">Swap Requests</h1>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-blue-900 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('received')}
          className={`flex-1 py-2 px-4 rounded-lg transition-all ${
            activeTab === 'received'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-blue-200 hover:bg-blue-800'
          } text-sm sm:text-base`}
        >
          Received ({receivedRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`flex-1 py-2 px-4 rounded-lg transition-all ${
            activeTab === 'sent'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-blue-200 hover:bg-blue-800'
          } text-sm sm:text-base`}
        >
          Sent ({sentRequests.length})
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'received' && (
          <>
            {receivedRequests.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-blue-400 opacity-50" />
                <h3 className="text-xl font-semibold text-blue-200 mb-2">No requests received</h3>
                <p className="text-blue-400">When others send you swap requests, they'll appear here.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {receivedRequests.map((request) => (
                  <RequestCard key={request.id} request={request} isReceived={true} />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'sent' && (
          <>
            {sentRequests.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-blue-400 opacity-50" />
                <h3 className="text-xl font-semibold text-blue-200 mb-2">No requests sent</h3>
                <p className="text-blue-400">Browse skills to send your first swap request!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {sentRequests.map((request) => (
                  <RequestCard key={request.id} request={request} isReceived={false} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SwapRequests;