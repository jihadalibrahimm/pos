import { createContext, useState, useEffect } from "react";
import API from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/auth/me")
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const register = async (name, email, password) => {
    const res = await API.post("/auth/register", { name, email, password });
    setUser(res.data.user || res.data)

  };

  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    setUser(res.data.user || res.data)
  };

  const logout = async () => {
    await API.get("/auth/logout");
    setUser(null);
  };

  if (loading) { 
    return (
    <div className="w-full pt-10 animate-bounce flex
    justify-center items-center text-2xl">
      Loading...
    </div>
    )
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};