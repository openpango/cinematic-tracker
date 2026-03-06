import { NavLink } from 'react-router-dom';
import { Home, Search, Folder, User } from 'lucide-react';
import './BottomNav.css';

export default function BottomNav() {
  return (
    <nav className="bottom-nav glass">
      <div className="bottom-nav-content">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Home size={24} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/search" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Search size={24} />
          <span>Search</span>
        </NavLink>
        <NavLink to="/folders" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Folder size={24} />
          <span>Folders</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <User size={24} />
          <span>Profile</span>
        </NavLink>
      </div>
    </nav>
  );
}
