import React, { useState } from 'react';
import Login from './components/Login';
import Navigation from './components/Navigation';
import Profile from './components/Profile';
import BrowseSkills from './components/BrowseSkills';
import SwapRequests from './components/SwapRequests';
import FeedbackComponent from './components/Feedback';
import AdminDashboard from './components/AdminDashboard';
import type { User, SwapRequest, Feedback, AdminMessage } from './types';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('profile');
  
  // Mock current user (in a real app, this would come from authentication)
  const [currentUser, setCurrentUser] = useState<User>({
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    location: 'San Francisco, CA',
    skillsOffered: ['JavaScript', 'React', 'Node.js'],
    skillsWanted: ['Python', 'Machine Learning', 'UI/UX Design'],
    availability: ['Weekends', 'Evenings'],
    isPublic: true,
    rating: 4.5,
    totalRatings: 12,
    createdAt: new Date('2024-01-15'),
    isActive: true,
    isBanned: false
  });

  // Mock data - in a real app, this would come from a database
  const [users, setUsers] = useState<User[]>([
    currentUser,
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      location: 'New York, NY',
      skillsOffered: ['Python', 'Data Science', 'Machine Learning'],
      skillsWanted: ['JavaScript', 'Frontend Development'],
      availability: ['Weekdays', 'Mornings'],
      isPublic: true,
      rating: 4.8,
      totalRatings: 23,
      createdAt: new Date('2024-01-10'),
      isActive: true,
      isBanned: false
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike@example.com',
      location: 'Seattle, WA',
      skillsOffered: ['UI/UX Design', 'Figma', 'Adobe Creative Suite'],
      skillsWanted: ['React', 'TypeScript', 'Backend Development'],
      availability: ['Flexible'],
      isPublic: true,
      rating: 4.2,
      totalRatings: 8,
      createdAt: new Date('2024-01-20'),
      isActive: true,
      isBanned: false
    },
    {
      id: '4',
      name: 'Emily Rodriguez',
      email: 'emily@example.com',
      location: 'Austin, TX',
      skillsOffered: ['Digital Marketing', 'SEO', 'Content Writing'],
      skillsWanted: ['Web Development', 'Analytics'],
      availability: ['Weekends'],
      isPublic: true,
      rating: 4.6,
      totalRatings: 15,
      createdAt: new Date('2024-01-25'),
      isActive: true,
      isBanned: false
    }
  ]);

  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([
    {
      id: 'sr1',
      fromUserId: '2',
      toUserId: '1',
      fromUserName: 'Sarah Johnson',
      toUserName: 'John Doe',
      skillOffered: 'Python',
      skillWanted: 'JavaScript',
      message: 'Hi! I\'d love to learn JavaScript from you. I have extensive Python experience and can teach you data science fundamentals.',
      status: 'pending',
      createdAt: new Date('2024-01-28'),
      updatedAt: new Date('2024-01-28')
    },
    {
      id: 'sr2',
      fromUserId: '1',
      toUserId: '3',
      fromUserName: 'John Doe',
      toUserName: 'Mike Chen',
      skillOffered: 'React',
      skillWanted: 'UI/UX Design',
      message: 'Your design portfolio looks amazing! I\'d love to learn UI/UX principles from you.',
      status: 'accepted',
      createdAt: new Date('2024-01-26'),
      updatedAt: new Date('2024-01-27')
    },
    {
      id: 'sr3',
      fromUserId: '4',
      toUserId: '1',
      fromUserName: 'Emily Rodriguez',
      toUserName: 'John Doe',
      skillOffered: 'Digital Marketing',
      skillWanted: 'React',
      message: 'I can help you with digital marketing strategies in exchange for React lessons.',
      status: 'completed',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-25')
    }
  ]);

  const [feedback, setFeedback] = useState<Feedback[]>([
    {
      id: 'f1',
      swapRequestId: 'sr3',
      fromUserId: '1',
      toUserId: '4',
      rating: 5,
      comment: 'Emily was fantastic! Her marketing insights were incredibly valuable and she was very patient with my questions.',
      createdAt: new Date('2024-01-26')
    },
    {
      id: 'f2',
      swapRequestId: 'sr3',
      fromUserId: '4',
      toUserId: '1',
      rating: 4,
      comment: 'John is a great teacher! His React explanations were clear and he provided helpful resources.',
      createdAt: new Date('2024-01-26')
    }
  ]);

  const [adminMessages, setAdminMessages] = useState<AdminMessage[]>([
    {
      id: 'am1',
      title: 'Platform Update v2.1',
      content: 'We\'ve added new features including improved search functionality and better mobile experience.',
      type: 'info',
      createdAt: new Date('2024-01-25'),
      isActive: true
    },
    {
      id: 'am2',
      title: 'Scheduled Maintenance',
      content: 'The platform will be under maintenance on Sunday, February 4th from 2:00 AM to 4:00 AM EST.',
      type: 'maintenance',
      createdAt: new Date('2024-01-30'),
      isActive: true
    }
  ]);

  // Check if current user is admin (in a real app, this would be based on user roles)
  const isAdmin = currentUser.email === 'john@example.com'; // Mock admin check

  const handleLogin = (email: string, password: string) => {
    // Mock authentication - in a real app, this would validate against a backend
    if ((email === 'john@example.com' && password === 'password123') ||
        (email === 'admin@skillswap.com' && password === 'admin123')) {
      
      // Update current user based on login
      if (email === 'admin@skillswap.com') {
        setCurrentUser({
          ...currentUser,
          email: 'admin@skillswap.com',
          name: 'Admin User'
        });
      }
      
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials. Use demo credentials from the login form.');
    }
  };

  const handleRegister = (name: string, email: string, password: string) => {
    // Mock registration - in a real app, this would create a new user in the backend
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      skillsOffered: [],
      skillsWanted: [],
      availability: [],
      isPublic: true,
      rating: 0,
      totalRatings: 0,
      createdAt: new Date(),
      isActive: true,
      isBanned: false
    };
    
    setCurrentUser(newUser);
    setUsers(prev => [...prev, newUser]);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('profile');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleSendSwapRequest = (toUserId: string, skillOffered: string, skillWanted: string, message: string) => {
    const toUser = users.find(u => u.id === toUserId);
    if (!toUser) return;

    const newRequest: SwapRequest = {
      id: `sr${Date.now()}`,
      fromUserId: currentUser.id,
      toUserId,
      fromUserName: currentUser.name,
      toUserName: toUser.name,
      skillOffered,
      skillWanted,
      message,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setSwapRequests(prev => [...prev, newRequest]);
  };

  const handleUpdateSwapRequest = (id: string, status: 'accepted' | 'rejected' | 'cancelled') => {
    setSwapRequests(prev => prev.map(req => 
      req.id === id 
        ? { ...req, status, updatedAt: new Date() }
        : req
    ));
  };

  const handleDeleteSwapRequest = (id: string) => {
    setSwapRequests(prev => prev.filter(req => req.id !== id));
  };

  const handleSubmitFeedback = (swapRequestId: string, rating: number, comment: string) => {
    const swap = swapRequests.find(s => s.id === swapRequestId);
    if (!swap) return;

    const newFeedback: Feedback = {
      id: `f${Date.now()}`,
      swapRequestId,
      fromUserId: currentUser.id,
      toUserId: swap.fromUserId === currentUser.id ? swap.toUserId : swap.fromUserId,
      rating,
      comment,
      createdAt: new Date()
    };

    setFeedback(prev => [...prev, newFeedback]);

    // Update user rating
    const targetUserId = newFeedback.toUserId;
    setUsers(prev => prev.map(user => {
      if (user.id === targetUserId) {
        const userFeedback = [...feedback, newFeedback].filter(f => f.toUserId === targetUserId);
        const totalRating = userFeedback.reduce((sum, f) => sum + f.rating, 0);
        const avgRating = totalRating / userFeedback.length;
        
        return {
          ...user,
          rating: avgRating,
          totalRatings: userFeedback.length
        };
      }
      return user;
    }));
  };

  const handleBanUser = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, isBanned: true, isActive: false } : u
    ));
  };

  const handleUnbanUser = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, isBanned: false, isActive: true } : u
    ));
  };

  const handleSendAdminMessage = (title: string, content: string, type: 'info' | 'warning' | 'maintenance') => {
    const newMessage: AdminMessage = {
      id: `am${Date.now()}`,
      title,
      content,
      type,
      createdAt: new Date(),
      isActive: true
    };
    setAdminMessages(prev => [...prev, newMessage]);
  };

  const handleDownloadReport = (type: 'users' | 'swaps' | 'feedback') => {
    // In a real app, this would generate and download actual reports
    const reportData = {
      users: users.map(u => ({
        name: u.name,
        email: u.email,
        skillsOffered: u.skillsOffered.length,
        skillsWanted: u.skillsWanted.length,
        rating: u.rating,
        isActive: u.isActive,
        isBanned: u.isBanned,
        createdAt: u.createdAt
      })),
      swaps: swapRequests.map(s => ({
        from: s.fromUserName,
        to: s.toUserName,
        skillOffered: s.skillOffered,
        skillWanted: s.skillWanted,
        status: s.status,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt
      })),
      feedback: feedback.map(f => ({
        swapRequestId: f.swapRequestId,
        rating: f.rating,
        comment: f.comment,
        createdAt: f.createdAt
      }))
    };

    const dataStr = JSON.stringify(reportData[type], null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${type}-report-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} onRegister={handleRegister} />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'profile':
        return <Profile user={currentUser} onUpdateUser={handleUpdateUser} />;
      case 'browse':
        return (
          <BrowseSkills
            users={users}
            currentUserId={currentUser.id}
            onSendSwapRequest={handleSendSwapRequest}
          />
        );
      case 'requests':
        return (
          <SwapRequests
            swapRequests={swapRequests}
            currentUserId={currentUser.id}
            onUpdateSwapRequest={handleUpdateSwapRequest}
            onDeleteSwapRequest={handleDeleteSwapRequest}
          />
        );
      case 'feedback':
        return (
          <FeedbackComponent
            swapRequests={swapRequests}
            feedback={feedback}
            currentUserId={currentUser.id}
            onSubmitFeedback={handleSubmitFeedback}
          />
        );
      case 'admin':
        return isAdmin ? (
          <AdminDashboard
            users={users}
            swapRequests={swapRequests}
            feedback={feedback}
            adminMessages={adminMessages}
            onBanUser={handleBanUser}
            onUnbanUser={handleUnbanUser}
            onSendAdminMessage={handleSendAdminMessage}
            onDownloadReport={handleDownloadReport}
          />
        ) : (
          <div className="max-w-4xl mx-auto p-6 text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h1>
            <p className="text-blue-200">You don't have permission to access the admin dashboard.</p>
          </div>
        );
      default:
        return <Profile user={currentUser} onUpdateUser={handleUpdateUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-900">
      <Navigation
        currentView={currentView}
        onViewChange={setCurrentView}
        currentUser={currentUser}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />
      
      <main className="pt-2 sm:pt-4">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;