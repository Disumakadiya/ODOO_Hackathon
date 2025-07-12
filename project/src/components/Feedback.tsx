import React, { useState } from 'react';
import { Star, MessageSquare, User, Calendar } from 'lucide-react';
import type { SwapRequest, Feedback } from '../types';

interface FeedbackProps {
  swapRequests: SwapRequest[];
  feedback: Feedback[];
  currentUserId: string;
  onSubmitFeedback: (swapRequestId: string, rating: number, comment: string) => void;
}

const FeedbackComponent: React.FC<FeedbackProps> = ({
  swapRequests,
  feedback,
  currentUserId,
  onSubmitFeedback
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'given' | 'received'>('pending');
  const [selectedSwap, setSelectedSwap] = useState<SwapRequest | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  // Get completed swaps that need feedback
  const completedSwaps = swapRequests.filter(
    req => req.status === 'completed' && 
    (req.fromUserId === currentUserId || req.toUserId === currentUserId)
  );

  // Get swaps that don't have feedback from current user yet
  const pendingFeedback = completedSwaps.filter(swap => 
    !feedback.some(f => f.swapRequestId === swap.id && f.fromUserId === currentUserId)
  );

  // Get feedback given by current user
  const givenFeedback = feedback.filter(f => f.fromUserId === currentUserId);

  // Get feedback received by current user
  const receivedFeedback = feedback.filter(f => f.toUserId === currentUserId);

  const handleSubmitFeedback = () => {
    if (selectedSwap && rating > 0) {
      onSubmitFeedback(selectedSwap.id, rating, comment);
      setSelectedSwap(null);
      setRating(0);
      setComment('');
    }
  };

  const StarRating: React.FC<{ rating: number; onRatingChange?: (rating: number) => void; readonly?: boolean }> = ({ 
    rating, 
    onRatingChange, 
    readonly = false 
  }) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onRatingChange?.(star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
        >
          <Star
            className={`h-5 w-5 ${
              star <= (readonly ? rating : (hoverRating || rating))
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-400'
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-blue-100 mb-6">Feedback & Ratings</h1>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-blue-900 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-2 px-4 rounded-lg transition-all ${
            activeTab === 'pending'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-blue-200 hover:bg-blue-800'
          } text-sm sm:text-base`}
        >
          Pending ({pendingFeedback.length})
        </button>
        <button
          onClick={() => setActiveTab('given')}
          className={`flex-1 py-2 px-4 rounded-lg transition-all ${
            activeTab === 'given'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-blue-200 hover:bg-blue-800'
          } text-sm sm:text-base`}
        >
          Given ({givenFeedback.length})
        </button>
        <button
          onClick={() => setActiveTab('received')}
          className={`flex-1 py-2 px-4 rounded-lg transition-all ${
            activeTab === 'received'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-blue-200 hover:bg-blue-800'
          } text-sm sm:text-base`}
        >
          Received ({receivedFeedback.length})
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'pending' && (
          <>
            {pendingFeedback.length === 0 ? (
              <div className="text-center py-12">
                <Star className="h-16 w-16 mx-auto mb-4 text-blue-400 opacity-50" />
                <h3 className="text-xl font-semibold text-blue-200 mb-2">No pending feedback</h3>
                <p className="text-blue-400">Complete some skill swaps to leave feedback!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {pendingFeedback.map((swap) => (
                  <div
                    key={swap.id}
                    className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl shadow-lg p-4 sm:p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-100" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-sm sm:text-base">
                            {swap.fromUserId === currentUserId ? swap.toUserName : swap.fromUserName}
                          </h3>
                          <p className="text-xs sm:text-sm text-blue-300">
                            {swap.skillOffered} ↔ {swap.skillWanted}
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setSelectedSwap(swap)}
                        className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-2 px-3 sm:px-4 rounded-lg transition-all text-sm sm:text-base"
                      >
                        Leave Feedback
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'given' && (
          <>
            {givenFeedback.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-blue-400 opacity-50" />
                <h3 className="text-xl font-semibold text-blue-200 mb-2">No feedback given</h3>
                <p className="text-blue-400">Your feedback will appear here after you submit reviews.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {givenFeedback.map((fb) => {
                  const swap = swapRequests.find(s => s.id === fb.swapRequestId);
                  return (
                    <div
                      key={fb.id}
                      className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl shadow-lg p-4 sm:p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 sm:h-10 sm:w-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-100" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-sm sm:text-base">
                              {swap?.fromUserId === currentUserId ? swap.toUserName : swap?.fromUserName}
                            </h3>
                            <p className="text-xs sm:text-sm text-blue-300">
                              {swap?.skillOffered} ↔ {swap?.skillWanted}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-blue-400" />
                          <span className="text-xs sm:text-sm text-blue-300">
                            {new Date(fb.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <StarRating rating={fb.rating} readonly />
                      </div>

                      {fb.comment && (
                        <div className="bg-blue-800 rounded-lg p-3">
                          <p className="text-blue-100">{fb.comment}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeTab === 'received' && (
          <>
            {receivedFeedback.length === 0 ? (
              <div className="text-center py-12">
                <Star className="h-16 w-16 mx-auto mb-4 text-blue-400 opacity-50" />
                <h3 className="text-xl font-semibold text-blue-200 mb-2">No feedback received</h3>
                <p className="text-blue-400">Feedback from others will appear here.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {receivedFeedback.map((fb) => {
                  const swap = swapRequests.find(s => s.id === fb.swapRequestId);
                  return (
                    <div
                      key={fb.id}
                      className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl shadow-lg p-4 sm:p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 sm:h-10 sm:w-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-100" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-sm sm:text-base">
                              {swap?.fromUserId === fb.fromUserId ? swap.fromUserName : swap?.toUserName}
                            </h3>
                            <p className="text-xs sm:text-sm text-blue-300">
                              {swap?.skillOffered} ↔ {swap?.skillWanted}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-blue-400" />
                          <span className="text-xs sm:text-sm text-blue-300">
                            {new Date(fb.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <StarRating rating={fb.rating} readonly />
                      </div>

                      {fb.comment && (
                        <div className="bg-blue-800 rounded-lg p-3">
                          <p className="text-blue-100">{fb.comment}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Feedback Modal */}
      {selectedSwap && (
        <div className="fixed inset-0 bg-blue-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4">
                Leave Feedback for {selectedSwap.fromUserId === currentUserId ? selectedSwap.toUserName : selectedSwap.fromUserName}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-blue-300 mb-2">
                    Rating
                  </label>
                  <StarRating 
                    rating={rating} 
                    onRatingChange={setRating}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-blue-300 mb-2">
                    Comment (optional)
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this skill swap..."
                    rows={4}
                    className="w-full px-3 py-2 bg-blue-800 border border-blue-600 rounded-lg text-white placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
                <button
                  onClick={() => setSelectedSwap(null)}
                  className="flex-1 px-4 py-2 border border-blue-600 text-blue-200 rounded-lg hover:bg-blue-800 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitFeedback}
                  disabled={rating === 0}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackComponent;