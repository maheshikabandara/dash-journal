import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';

const Register = () => {
  const [error, setError] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    const lettersVali = /^[A-Za-z]+$/;
    if (!lettersVali.test(firstName) || !lettersVali.test(lastName)) {
      alert('Please enter a name with only letters');
      return;
    }

    setShowPopup(true);

    try {

      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: `${firstName} ${lastName}` });
      setError(false);
      if (!error) {
        window.location.href = '/';
      }
    } catch (error) {
      setError(true);
      console.error('Error occurred while registering:', error);
    } finally {
      setShowPopup(false);
    }
  };

  return (
    <div className="auth">
      <form onSubmit={handleRegister}>
        <h1>Register</h1>
        <input
          type="text"
          placeholder="First Name"
          name='fname'
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Register</button>
        <span>
          Already have an account? <Link to="/login">Login</Link>
        </span>
        {error && <span className="err">Registration failed.</span>}
      </form>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <span>Registering...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
