import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { Activity, LogOut } from 'lucide-react';

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleClick = () => {
    logout();
  };

  return (
    <header>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Link to="/">
          <Activity color="var(--primary)" size={28} />
          <h1>FitTrack Pro</h1>
        </Link>
        <nav className="nav-links">
          {user && (
            <div className="user-controls">
              <span>{user.email}</span>
              <button onClick={handleClick} className="outline" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <LogOut size={16} /> Log out
              </button>
            </div>
          )}
          {!user && (
            <div>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
