import { useState } from 'react';
import { useLogin } from '../hooks/useLogin';
import { LogIn, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="auth-page">
      <div className="auth-form glass-card">
        <h3>
          Welcome Back <LogIn size={24} />
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><Mail size={16} /> Email address:</label>
            <input 
              type="email" 
              onChange={(e) => setEmail(e.target.value)} 
              value={email} 
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label><Lock size={16} /> Password:</label>
            <input 
              type="password" 
              onChange={(e) => setPassword(e.target.value)} 
              value={password} 
              required
              placeholder="Enter your password"
            />
          </div>

          <button disabled={isLoading} style={{ marginTop: '10px' }}>Log In</button>
          {error && <div className="error-msg">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Login;
