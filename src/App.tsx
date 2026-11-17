import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { SaveToBoardModal } from './components/pins/SaveToBoardModal';
import { AuthModal } from './components/common/AuthModal';
import { Toast } from './components/common/Toast';
import { LandingPage } from './pages/LandingPage';
import { HomeFeedPage } from './pages/HomeFeedPage';
import { ExplorePage } from './pages/ExplorePage';
import { PinDetailPage } from './pages/PinDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { BoardDetailPage } from './pages/BoardDetailPage';
import { CreatePinPage } from './pages/CreatePinPage';

const AppRouter: React.FC = () => {
  const { route } = useApp();

  const renderPage = () => {
    switch (route.name) {
      case 'landing':
        return <LandingPage />;
      case 'home':
        return <HomeFeedPage />;
      case 'explore':
        return <ExplorePage initialCollectionId={route.collectionId} />;
      case 'pin':
        return <PinDetailPage pinId={route.pinId} />;
      case 'profile':
        return <ProfilePage username={route.username} />;
      case 'board':
        return <BoardDetailPage boardId={route.boardId} />;
      case 'create':
        return <CreatePinPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />
      {renderPage()}
      <MobileNav />
      <SaveToBoardModal />
      <AuthModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
