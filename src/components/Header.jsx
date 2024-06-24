import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashJournal1 from '../images/DashJournal1.png';
import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import SearchBar from './SearchBar';
import HeaderLinks from './HeaderLinks';
import { auth } from '../firebase';
import { AuthContext } from '../context/AuthContext';


const Header = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const user = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        setLoggedIn(false);
        navigate('/login');
      })
      .catch((error) => {
        console.error('Error occurred while logging out:', error);
      });
  };

  const handleLogin = () => {
    navigate('/login');
  };

  useEffect(() => {
    const checkUserAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });

    return () => {
      checkUserAuth();
    };
  }, []);

  return (
    <div className="navbar">
      <div className="container">
        <div className="logo">
          <a href="/">
            <img src={DashJournal1} alt="" />
          </a>
        </div>
        <div className="searchbar">
          <SearchBar />
        </div>
        <div className="left">
          <span className="write">
            {loggedIn && (
              <>
              <div className="icon">
                <DrawOutlinedIcon />
              </div>
                <Link className="link" to="/write">
                  Write
                </Link>
                </>
              )}
          </span>
          {user ? (
              <Link className="link" to={`/user/${user.uid}/blogs`}>
                {user.displayName.split(' ')[0].charAt(0).toUpperCase() + user.displayName.split(' ')[0].slice(1)}
              </Link>
            ) : (
              <span className="login" onClick={handleLogin}>
                Login
              </span>
            )}
          {loggedIn && (
            <span className="logout" onClick={handleLogout}>
              Logout
            </span>
          )}
        </div>
      </div>
      <div className="headerlinks">
        <HeaderLinks />
      </div>
    </div>
  );
};

export default Header;
