import React, { useEffect, useContext, useState } from 'react'
import API from '../api/axios'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiLock, FiShield} from 'react-icons/fi'
import AdminAuthContext from '../context/AdminAuthContext'

function AdminLogin() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [showError, setShowError] = useState(false)
    const {login, error} = useContext(AdminAuthContext)

    const navigate = useNavigate()

    useEffect(() => {
    if (error) {
        setShowError(true)
        const timer = setTimeout(() => {
            setShowError(false)
    }, 3000)

      return () => clearTimeout(timer)
    }
  }, [error])

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        const success = await login(email, password)
        if (success) {
            navigate("/dashboard")
        }
        setLoading(false)
    }

    return (
        <div className='min-h-screen flex items-center justify-center 
        bg-linear-to-b from-[#f0e5d2] to-[#e2d1b8] p-6'>
            <motion.div initial={{opacity:0,y:-30}} animate={{opacity:1,y:0}}
            transition={{duration:0.6}} className='w-full max-w-md bg-white/90 
            backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-[#C9A86A]/30'>
                
                <div className="text-center mb-6">
                    
                    <motion.div initial={{scale:0.8}} animate={{scale:1}}
                    className='flex justify-center mb-3'>
                        
                        <FiShield className='text-[#C9A86A] text-5xl'/>
                    
                    </motion.div>
                    <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>

                    <p className="text-gray-500 text-sm mt-1"> Sign in to access the dashboard </p>
                </div>

                <form onSubmit={handleLogin} className='space-y-4'>
                    <div>
                        <label className='block text-gray-700 mb-1'></label>
                        <div className="py-3 flex items-center gap-2 border p-2 rounded-lg bg-gray-50">
                            <FiUser className='text-gray-500'/>

                            <input type="email" placeholder='admin@example.com'
                            onChange={(e) => setEmail(e.target.value)} required
                            className='w-full outline-none bg-transparent'/>

                        </div>
                    </div>
                    <div>
                        <div className="py-3 flex items-center gap-2 border p-2 rounded-lg bg-gray-50">
                            <FiLock className="text-gray-500" />
                            <input type="password"
                            placeholder="••••••••" onChange={(e) => setPassword(e.target.value)} required
                            className="w-full outline-none bg-transparent"
                            />
                        </div>
                    </div>

                    {showError && (
                        <div className="p-1 bg-red-500 rounded-md text-center">
                        <p className="text-white">{error}</p>
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="w-full bg-[#C9A86A]
                    text-white py-2 rounded-lg hover:bg-[#C9A86A]/80 cursor-pointer transition">
                        {loading ? "Processing..." : "Login"}
                    </button>

                </form>
            </motion.div>
        </div>
    )
}

export default AdminLogin