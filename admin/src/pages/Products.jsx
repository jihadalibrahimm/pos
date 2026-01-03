import React, {useState, useEffect } from "react"
import API from "../api/axios"
import { AnimatePresence, motion } from "framer-motion"
import { 
    FiShoppingCart,
    FiUser,
    FiBox,
    FiDollarSign,
    FiCalendar,
    FiPlus,
    FiCheckCircle,
    FiAlertTriangle,
    FiInfo,
    FiX,
    FiMail,
    FiShield,
    FiFolder,
} from "react-icons/fi"
import {FaDollarSign, FaEdit, FaShoppingCart, FaTrash2} from "react-icons/fa"
import { useId } from "react"

function Products() {
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    
    const [form, setForm] = useState({
        projectId,
        userId:"",
        amount:"",
        paymentMethod:"cash",
    })

    const [editingId, setEditingId] = useState(null)
    
    const fetchTransactions = async() => {
        try {
            const res = await API.get('/admin/transactions')
            setTransactions(res.data)
        } catch(err) {
            setError(err)
        }finally{
            setLoading(true)
        }
    }

    useEffect(()=>{
        fetchTransactions()
    },[])

    const handleSubmit = async(e) => {
        e.preventDefault()
        try {
            if(editingId){
                await API.put(`/admin/transactions/${editingId}`, form)
            }else{
                await API.post(`/admin/transactions/`, form)            
            }
            setForm({projectId:"", userId:"", amount:"", paymentMethod:"cash"})
            setEditingId(null)
            fetchTransactions()

        } catch(err) {
            console.log(err)
            
        }
    }

    const handleEdit = async(tx) => {
        setForm({
            projectId: tx.projectId._id,
            userId: tx.useId._id,
            amount: tx.amount,
            paymentMethod: tx.paymentMethod,
        })
        setEditingId(tx._id)
    }

    const handleDelete = async(id) => {
        if(!window.confirm("Are you sure you want to delete this transaction")) return;

        try {
            await API.delete(`/admin/transactions/${id}`)
            fetchTransactions();
        } catch(err) {
            console.log(err)
            setError("Failed to delete transaction : ",err)
        }
    }

    if(loading) return <div className="p-8 text-xl font-semibold">Loading...</div>
    if(error) return <div className="p-8 text-xl text-red-600">Error : {error}</div>
    
    return (
        <div className="p-6 bg-linear-to-b from-[#faf6ef] to-[#e8ddc9] pt-32 h-screen mx-auto">
            
            <h1 className="text-3xl font-bold flex items-center gap-2 mb-6">
                <FiDollarSign/> Transactions
            </h1>

            <form onSubmit={handleSubmit} className="mb-6 grid 
            grid-cols-1 md:grid-cols-4 gap-4 items-end">

                <input type="text" placeholder="Project ID" value={form.projectId} 
                onChange={(e) => setForm({...form, projectId:e.target.value})} 
                className="p-2 border rounded w-full" required />

                <input type="number" placeholder="User ID" value={form.userId} 
                onChange={(e) => setForm({...form, userId:e.target.value})} 
                className="p-2 border rounded w-full" required />

                <input type="number" placeholder="Amount" value={form.amount} 
                onChange={(e) => setForm({...form, amount:e.target.value})} 
                className="p-2 border rounded w-full" required />

                <select value={form.paymentMethod}
                onChange={(e) => setForm({...form, paymentMethod:e.target.value})}
                className="border p-2 rounded w-full">

                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="online">Online</option>

                </select>
                <button type="submit" className="bg-blue-600 text-white 
                px-4 py-2 rounded hover:bg-blue-700 transition-colors col-span-full
                md:col-span-2">
                    {editingId ? "Update" : "Create"}
                </button>
            </form>

            <div className="space-y-4">
                <AnimatePresence>
                    {transactions.map((tx, index) => {
                        <motion.div key={tx._id} initial={{opacity:0, y:-20}} animate={{opacity:1, y:0}}
                        exit={{opacity:0, x:20}} transition={{delay:index*0.05}} 
                        className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm 
                        hover:shadow-lg flex justify-between items-center">

                            <div className="space-y-1">
                                <p className="text-lg font-semibold flex items-center gap-2 ">
                                    <FiFolder className="to-green-500"/> {tx.projectId.name}
                                </p>
                                <p className="text-lg font-semibold flex items-center gap-2 ">
                                    <FiUser/> ({tx.projectId.email})
                                </p>
                                <p className="flex items-center gap-1 text-gray-700">
                                    <FiDollarSign /> ({tx.amount}) USD
                                </p>
                                <p className="text-gray-500">{tx.paymentMethod}</p>
                                <p className={`font-medium ${tx.status === "completed" ? 
                                    "text-green-600" : "text-yellow-600"}`}>
                                    Status : {tx.status}
                                </p>
                            </div>
                            
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(tx)} 
                                className="p-2 bg-yellow-200 rounded
                                 hover:bg-yellow-300 transition">
                                    <FaEdit/>
                                </button>

                                <button onClick={() => handleDelete(tx._id)} 
                                className="p-2 bg-yellow-200 rounded
                                 hover:bg-yellow-300 transition">
                                    <FaTrash2/>
                                </button>
                            </div>
                        </motion.div>
                    })}
                </AnimatePresence>
            </div>

            {transactions.length === 0 &&(
                <motion.p initial={{opacity:0}} animate={{opacity:1}}
                className="text-gray-500 text-center mt-10">
                    No Transactions found.
                </motion.p>
            )}

        </div>
    )
}

export default Products