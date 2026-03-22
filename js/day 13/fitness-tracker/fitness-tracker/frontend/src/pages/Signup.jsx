import { useState } from 'react';
import { useSignup } from '../hooks/useSignup';
import { UserPlus, Mail, Lock } from 'lucide-react';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup, error, isLoading } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(email, password);
  };

  return (
    <div className="auth-page">
      <div className="auth-form glass-card">
        <h3>
          Create an Account <UserPlus size={24} />
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
              placeholder="Choose a strong password"
            />
          </div>

          <button disabled={isLoading} style={{ marginTop: '10px' }}>Sign Up</button>
          {error && <div className="error-msg">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Signup;
