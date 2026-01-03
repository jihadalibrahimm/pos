import React, {useState, useEffect } from "react"
import API from "../api/axios"
import { 
    FiUsers,
    FiBox,
    FiFileText,
    FiDollarSign,
    FiArrowRight,
    FiUser,
} from "react-icons/fi"
import { motion } from "framer-motion"

function Dashboard() {
    const [dashboardData, setDashboardData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(()=>{
        const fetchDashboardData = async() => {
            const res = await API.get("/admin/dashboard")
            setDashboardData(res.data)
        }catch(err){
            setError(`Failed to load : ${err}`)
        }finally{
            setLoading(false)
        }
    },[])

    if(loading) return <div className="p-8 text-xl font-semibold">Loading...</div>
    if(error) return <div className="p-8 text-xl text-red-600">Error : {error}</div>
    return (
        <div className="p-6 bg-linear-to-b from-[#faf6ef] to-[#e8ddc9] pt-32 h-[110vh]">
            <motion.h2 initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} 
            className="text-3xl font-bold mb-6">
                Dashboard overview
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                
                <StatCard 
                icon={<FiUsers size={32}/>}
                label="Total Admins"
                value={dashboardData.totalAdmins}
                color="#4F46E5"
                />

                <StatCard 
                icon={<FiBox size={32}/>}
                label="Total Products"
                value={dashboardData.totalProducts}
                color="#0EA5E9"
                />
                
                <StatCard 
                icon={<FiFileText size={32}/>}
                label="Total Invoices"
                value={dashboardData.totalInvoices}
                color="#F59E0B"
                />

                <StatCard 
                icon={<FiDollarSign size={32}/>}
                label="Total Sales"
                value={dashboardData.totalSales + " $"}
                color="#10B982"
                />
            </div>
            {dashboardData.recentInvoices?.length > 0 && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}}  className="mt-10 bg-white p-6 
                rounded-xl shadow-md border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <FiFileText/> Recent Invoices
                    </h2>
                    <div className="space-y-3">
                        {dashboardData.recentInvoices.map((inv) =>(
                            <motion.div key={inv._id} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} 
                            className="p-4 bg-gray-50 rounded-lg  border-gray-200 flex justify-between
                            text-center hover:bg-gray-100 transition">
                                <div>
                                    <p className="font-semibold">
                                        Invoice #{inv.number}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Total : {inv.finalTotal}
                                    </p>
                                    <FiArrowRight className="text-neutral-400"/>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    )
}

function StatCard({icon, label, value, color}){
    return (
        <motion.div 
        initial={{opacity:0, y:20}}
        animate={{opacity:1, y:0}}
        className="bg-white p-6 rounded-2xl 
        shadow-md border border-gray-200 flex
        items-center gap-4 hover:shadow-xl transition"
        >

            <div 
            className="w-14 h-14 rounded-xl flex items-center justify-center text-white"
            style={{backgroundColor:color}}>
                {icon}
            </div>

            <div>
                <p className="text-gray-600">{label}</p>
                <h3 className="text-2xl font-bold">{value}</h3>
            </div>

        </motion.div>
    )
}

export default Dashboard