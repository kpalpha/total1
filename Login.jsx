
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css'

const users = [
  { email: 'steve@gmail.com', password: '12345' },
  { email: 'tony@gmail.com', password: '12345' }
];

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
      navigate('/landing');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div>
      <div className='loginpg'>

        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          /><br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          /><br />
          <button type="submit">Login</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
}

export default Login;
