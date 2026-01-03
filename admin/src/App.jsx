import { BrowserRouter, Route, Routes } from "react-router-dom"
import Header from "./components/Header"
import { AdminAuthProvider } from "./context/AdminAuthContext"
import Login from './pages/AdminLogin'
import Register from './pages/AdminRegister'
import Home from './pages/Home'
import Products from './pages/Products'
import Customers from './pages/Customer'
import Invoices from './pages/Invoices'
import CreateProduct from './pages/CreateProduct'
import Notifications from './pages/Notifications'
import Profile from './pages/Profile'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import EditProduct from './pages/EditProduct'
import ProtectedRoute from './components/ProtectedRoutes'

import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import './index.css'

function App(){
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <Header/>
          <ToastContainer position="top-center" autoClose={500} />
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

           <Route path="/products/edit/:id" element={
            <ProtectedRoute>
              <EditProduct/>
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
    </AdminAuthProvider>
  )
}

export default App