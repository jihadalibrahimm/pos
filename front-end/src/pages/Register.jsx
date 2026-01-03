import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, Mail } from 'lucide-react';
import { toast } from 'react-toastify';

function Register() {
    const year = new Date()    
    const { register } = useContext(AuthContext);
    const navigate = useNavigate()
    const [error , setError] = useState("")
    const [name , setName] = useState("")
    const [email , setEmail] = useState("")
    const [password , setPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            await register( name, email, password )
            toast.success("Account created successfully 🎉")
            setTimeout(() => {
                navigate('/')
            }, 500);
        }catch(err) {
            setError(err.response?.data.message || "Register Failed!")            
        }
    }
    return (
        <div className='min-h-screen bg-linear-to-b from-[#faf6ef]
            to-[#f0e5d2] flex items-center justify-center p-6 mt-6 '> 
            <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}}
                transition={{duration:0.7}} className="w-full max-w-md bg-white/70
                backdrop-blur-xl border border-[#C9A86A]/30 rounded-3xl shadow-2xl p-7">
                    <div className="flex flex-col items-center mb-8">
                        <div className="p-4 rounded-2xl bg-[#C9A86A]/20 border border-[#C9A86A]/30 mb-3">
                            <Lock size={36} className="text-[#C9A86A]/30" />
                        </div>
                        <h1 className="text-3xl text-neutral-900 font-bold"> Create Your Account </h1>
                        <p className="mt-2 text-neutral-600 text-center">
                            Register to access your account 
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 " >
                        
                        <motion.div
                            initial={{opacity:0,x:-20}}
                            animate={{opacity:1,x:0}}
                            transition={{delay:0.1}}>
                                <label className='text-neutral-800 font-medium '> Enter your name </label>
                                <div className="flex items-center border border-neutral-300
                                rounded-xl p-2 bg-white shadow-sm focus-within:border-[#C9A86A] transition">
                                    <User size={20} className='text-[#C9AB8A] mr-2'/>
                                    <input type="text" placeholder='Cihat Alibrahim...' required
                                        value={name} onChange={(e) => setName(e.target.value)}
                                        className='w-full outline-none p-2 bg-transparent' />                                    
                                </div>
                        </motion.div>

                        <motion.div
                            initial={{opacity:0,x:-20}}
                            animate={{opacity:1,x:0}}
                            transition={{delay:0.1}}>
                                <label className='text-neutral-800 font-medium '> Enter your email </label>
                                <div className="flex items-center border border-neutral-300
                                rounded-xl p-2 bg-white shadow-sm focus-within:border-[#C9A86A] transition">
                                    <Mail size={20} className='text-[#C9AB8A] mr-2'/>
                                    <input type="email" placeholder='you@example.com' required
                                        value={email} onChange={(e) => setEmail(e.target.value)}
                                        className='w-full outline-none p-2 bg-transparent' />                                    
                                </div>
                        </motion.div>

                        <motion.div
                            initial={{opacity:0,x:-20}}
                            animate={{opacity:1,x:0}}
                            transition={{delay:0.1}}>
                                <label className='text-neutral-800 font-medium '> Enter your password </label>
                                <div className="flex items-center border border-neutral-300
                                rounded-xl p-2 bg-white shadow-sm focus-within:border-[#C9A86A] transition">
                                    <User size={20} className='text-[#C9AB8A] mr-2'/>
                                    <input type="password" placeholder='**********' required
                                        value={password} onChange={(e) => setPassword(e.target.value)}
                                        className='w-full outline-none p-2 bg-transparent'/>
                                </div>
                        </motion.div>

                        {error && (
                            <motion.div initial={{opacity:0}} animate={{opacity:1}} className='text-red-600 text-sm'>
                                {error}
                            </motion.div>
                        )}

                        <motion.button 
                            whileHover={{scale:1.03}} whileTap={{scale:0.97}} type='submit'
                            className='mt-4 py-2 cursor-pointer font-semibold text-white bg-[#C9A86A] rounded-xl 
                            shadow-lg hover:bg-[#b8964f] transition text-lg'
                        >
                            Register
                        </motion.button>

                    </form>

                    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} 
                        className='mt-8 text-center text-neutral-600 text-sm'>
                        &copy; {year.getFullYear()} POS System
                    </motion.div>

            </motion.div>
        </div>
    )
}

export default Register