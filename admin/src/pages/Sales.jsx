import React, {useState, useEffect } from "react"
import axios from "../api/axios"
import { AnimatePresence, motion } from "framer-motion"
import { 
    FiShoppingCart,
    FiUser,
    FiBox,
    FiDollarSign,
    FiCalendar,
} from "react-icons/fi"
import {FaDollarSign, FaShoppingCart} from "react-icons/fa"

function Sales() {
    const [sales, setSales] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    
    const fetchSales = async() => {
        try {
            const res = await API.get('/admin/transactions')
            setSales(res.data)
        } catch(err) {
            console.log(err)
        }finally{
            setLoading(true)
        }
    }

    useEffect(() => {
        fetchSales()
    },[])

    if(loading) return <div className="p-8 text-xl font-semibold">Loading...</div>
    if(error) return <div className="p-8 text-xl text-red-600">Error : {error}</div>
    
    return (
        <div className="p-6 bg-linear-to-b from-[#faf6ef] to-[#e8ddc9] pt-32 h-screen mx-auto">
            
            <h2 className="text-4xl font-bold flex items-center gap-2 mb-6">
                <FiShoppingCart/> Sales
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {sales.map((sale, index) => {
                        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} 
                        exit={{opacity:0,y:-20}} transition={{delay:index*0.05}} className="bg-white border-gray-200 
                        rounded-xl shadow-md hover:shadow-lg flex flex-col justify-between">
                            <div className="space-y-2">
                                <p className="text-xl font-semibold flex items-center gap-2">
                                    <FaDollarSign className="text-green-500" /> Amount : {sale.amount} USD
                                </p>

                                <p className="text-gray-700 flex items-center gap-2">
                                    <FiUser /> User : {sale.userId?.name || ""} 
                                </p>

                                <p className="text-xl font-semibold flex items-center gap-2">
                                    <FaShoppingCart/> Project : {sale.projectId?.name || ""}
                                </p>

                                <p className="text-xl font-semibold flex items-center gap-2">
                                    <FiCalendar/> Status : {sale.status} | Payment : {sale.PaymentMethod}
                                </p>

                            </div>
                        </motion.div>
                    })}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default Sales