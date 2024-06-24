import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const Login = () => {
  const [error, setError] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setShowPopup(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError(false);
      navigate('/');
    } catch (error) {
      setError(true);
      console.error('Error occurred while logging in:', error);
    } finally {
      setShowPopup(false);
    }
  };

  return (
    <div className="auth">
      <form onSubmit={handleLogin}>
        <h1>Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        <span>
          Don't have an account? <Link to="/register">Register</Link>
        </span>
        {error && <span className="err">Invalid username or password.</span>}
      </form>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <span>Login...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
