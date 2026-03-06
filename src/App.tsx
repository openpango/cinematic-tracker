import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BottomNav from './components/layout/BottomNav';
import Home from './pages/Home';
import Search from './pages/Search';
import Folders from './pages/Folders';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import MediaDetails from './pages/MediaDetails';
import FolderDetail from './pages/FolderDetail';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Loading...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Auth />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/folders" element={<Folders />} />
          <Route path="/folders/:id" element={<FolderDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/media/:type/:id" element={<MediaDetails />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
