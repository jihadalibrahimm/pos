import { BrowserRouter, Route, Routes } from "react-router-dom"
import Header from "./components/Header"
import { AuthProvider } from "./context/AuthContext"
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Products from './pages/Products'
import Customers from './pages/Customers'
import Invoices from './pages/Invoices'
import CreateProduct from './pages/CreateProduct'
import Notifications from './pages/Notifications'
import Profile from './pages/Profile'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

import ProtectedRoute from "./components/ProtectedRoutes"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header/>

        <ToastContainer
          position="top-center"
          autoClose={800}
          hideProgressBar={false}
          pauseOnHover
          closeOnClick
          theme="light"
        />
        
        <Routes>

          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Home/>
            </ProtectedRoute>
          }/>

          <Route path="/products" element={
            <ProtectedRoute>
              <Products/>
            </ProtectedRoute>
          }/>

          <Route path="/invoices" element={
            <ProtectedRoute>
              <Invoices/>
            </ProtectedRoute>
          }/>

          <Route path="/customers" element={
            <ProtectedRoute>
              <Customers/>
            </ProtectedRoute>
          }/>

          <Route path="/reports" element={
            <ProtectedRoute>
              <Reports/>
            </ProtectedRoute>
          }/>

          <Route path="/notifications" element={
            <ProtectedRoute>
              <Notifications/>
            </ProtectedRoute>
          }/>

          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings/>
            </ProtectedRoute>
          }/>

           <Route path="/products/create" element={
            <ProtectedRoute>
              <CreateProduct/>
            </ProtectedRoute>
          }/>

          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile/>
            </ProtectedRoute>
          }/>

          <Route path="*" element={<h1>404 Page Not Found </h1>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App