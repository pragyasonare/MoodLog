
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const [reminder, setReminder] = useState(null);

    useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
      fetchReminder(); // Load reminder when token exists
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await axios.get('/api/users/me');
      setUser(res.data);
    } catch (err) {
      logout();
    }
  };

  const fetchReminder = async () => {
  try {
    const res = await axios.get('/api/moods/reminders');  // Updated endpoint
    if (res.data) {
      setReminder(res.data.time);
      localStorage.setItem('moodifyReminder', res.data.time);
    }
  } catch (err) {
    console.error('Failed to fetch reminder:', err);
  }
};

const setUserReminder = async (time) => {
  try {
    const res = await axios.post('/api/moods/reminders', { time });  // Updated endpoint
    setReminder(time);
    localStorage.setItem('moodifyReminder', time);
    return { success: true };
  } catch (err) {
    return { error: err.response?.data?.error || 'Failed to set reminder' };
  }
};

const deleteReminder = async () => {
  try {
    await axios.delete('/api/moods/reminders');  // Updated endpoint
    setReminder(null);
    localStorage.removeItem('moodifyReminder');
  } catch (err) {
    console.error('Failed to delete reminder:', err);
  }
};

  const register = async (email, password) => {
    try {
      const res = await axios.post('/api/users/register', { email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      return { success: true };
    } catch (err) {
      return { error: err.response?.data?.error || 'Registration failed' };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/users/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      return { success: true };
    } catch (err) {
      console.error('Login error:', err.response?.data);
      return { error: err.response?.data?.error || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };
 return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      reminder,
      register, 
      login, 
      logout,
      setUserReminder,
      deleteReminder,
      fetchReminder
    
    }}>
      {children}
    </AuthContext.Provider>
  );
}

 export const useAuth = () => useContext(AuthContext);


