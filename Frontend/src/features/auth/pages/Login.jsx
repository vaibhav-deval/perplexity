import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router';
import { useAuth } from '../hook/userAuth';



const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const  {handleLogin}  = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { email, password };
    await handleLogin(payload);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg w-full max-w-md shadow-md  hover:shadow-[#32b8c6] transition-ease-in-out duration-300">
        <h2 className="text-white text-2xl mb-6 text-center">Login</h2>
        <div className="mb-4">
          <label className="block text-[#32b8c6] mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded border border-[#32b8c6] focus:outline-none focus:ring-2 focus:ring-[#32b8c6]"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-[#32b8c6] mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded border border-[#32b8c6] focus:outline-none focus:ring-2 focus:ring-[#32b8c6]"
            required
          />
        </div>
        <button type="submit" className="w-full bg-[#32b8c6] hover:bg-[#32b8c6]/80 text-white p-3 rounded transition">Login</button>
        <p className="text-center mt-4 text-white">
          Don't have an account? <Link to="/register" className="text-[#32b8c6] hover:underline">Register</Link>
        </p>
      </form>
    </div>
  )
}

export default Login