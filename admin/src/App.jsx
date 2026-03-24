import { useContext } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Header from "./components/Header"
import AdminAuthContext, { AdminAuthProvider } from "./context/AdminAuthContext"
import Login from './pages/AdminLogin'
import Register from './pages/AdminRegister'
import Products from './pages/Products'
import Customers from './pages/Customer'
import Invoices from './pages/Invoices'
import CreateProduct from './pages/CreateProduct'
import Notifications from './pages/Notifications'
import Reports from './pages/Reports'
import ProtectedRoute from './components/ProtectedRoutes'
import Dashboard from './pages/Dashboard'

import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import './index.css'
import Transactions from "./pages/Transactions"
import Sales from "./pages/Sales"
import Users from "./pages/Users"
import Projects from "./pages/Projects"
import { Navigate } from "react-router-dom"

function PublicRoute({ children }) {
  const { admin, loading } = useContext(AdminAuthContext)

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-lg">Checking session...</div>
  }

  if (admin) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function App(){
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <Header/>
          <ToastContainer position="top-center" autoClose={500} />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={
            <PublicRoute>
              <Login/>
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register/>
            </PublicRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
          }/>

           <Route path="/users" element={
            <ProtectedRoute>
              <Users/>
            </ProtectedRoute>
          }/>

          <Route path="/products" element={
            <ProtectedRoute>
              <Products/>
            </ProtectedRoute>
          }/>

          <Route path="/projects" element={
            <ProtectedRoute>
              <Projects/>
            </ProtectedRoute>
          }/>

          <Route path="/invoices" element={
            <ProtectedRoute>
              <Invoices/>
            </ProtectedRoute>
          }/>

          <Route path="/sales" element={
            <ProtectedRoute>
              <Sales/>
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

          <Route path="/admin/notifications" element={
            <ProtectedRoute>
              <Notifications/>
            </ProtectedRoute>
          }/>

          <Route path="/transactions" element={
            <ProtectedRoute>
              <Transactions/>
            </ProtectedRoute>
          }/>

           <Route path="/products/create" element={
            <ProtectedRoute>
              <CreateProduct/>
            </ProtectedRoute>
          }/>

          <Route path="*" element={<h1>404 Page Not Found </h1>} />
        
        </Routes>
      </BrowserRouter>
    </AdminAuthProvider>
  )
}


export default App