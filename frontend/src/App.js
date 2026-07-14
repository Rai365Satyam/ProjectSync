import AppLayout from "./components/AppLayout";
import { Routes, Route, Navigate } from "react-router-dom";
import Task from "./components/Task";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard"; // Imported your new proper dashboard
import { Toaster } from "react-hot-toast";
import axios from "axios";
axios.defaults.baseURL = "https://projectsync-eslx.onrender.com";
// Automatically intercept and attach JWT Token to Axios requests if logged in
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

function App() {
  console.log('render app..');
  
  // Check if token exists to verify auth status
  const token = localStorage.getItem("token");

  // Router guard condition: If no token exists, route all components to the login window
  if (!token) {
    return (
      <>
        <Toaster position="top-right" gutter={8} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </>
    );
  }

  // Authenticated State: User sees the normal application workspace layout
  return (
    <AppLayout>
      <Toaster position="top-right" gutter={8} />
      <Routes>
        {/* Redirect authenticated users away from the login screen */}
        <Route path="/login" element={<Navigate to="/" replace />} />
        
        {/* Render your proper dynamic metrics dashboard at the root URL */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        
        {/* Dynamic route matching for individual project task boards */}
        <Route path="/project/:projectId" element={<Task />} />
        <Route path="/:projectId" element={<Task />} />
      </Routes>
    </AppLayout>
  );
}

export default App;