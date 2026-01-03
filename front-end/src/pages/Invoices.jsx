import { useEffect, useState } from 'react'
import API from '../api/axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Receipt, Plus, User , DollarSign, Package, CreditCard , X } from 'lucide-react'
import {toast} from 'react-toastify'

function Invoices() {
    const [invoices, setInvoices]   = useState([])
    const [products, setProducts]   = useState([])
    const [customers, setCustomers] = useState([])
    const [open, setOpen] = useState(false)
    const [newInvoice, setNewInvoice] = useState({
        items:[],
        discount:0,
        tax:0,
        paymentMethod:"cash",
        customer:"",
    })

    const fetchAll = async() => {
        try {
            const [invRes, proRes, custRes] = await Promise.all([
                API.get('/invoices'),
                API.get('/products'),
                API.get('/customers'),
            ])
            setInvoices(invRes.data)
            setProducts(proRes.data)
            setCustomers(custRes.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchAll()
    },[])

    const addItem = () => {
    setNewInvoice(prev => ({
        ...prev,
        items: [...prev.items, { productId: "", qty: 1, total: 0 }]
    }))}

    
    const updateItem = (idx, field, value) => {
        const items = [...newInvoice.items]
        items[idx][field] = field === "qty" ? Number(value) : value

        const product = products.find(p => p._id === items[idx].productId)
        if (product) {
            items[idx].total = product.sellingPrice * items[idx].qty
        }
        setNewInvoice(prev => ({ ...prev, items }))
    }
    
    const saveInvoice = async () => {
        if (newInvoice.items.length === 0) {
            toast.error("Please add at least one item")
            return
        }

        try {
            const itemsTotal = newInvoice.items.reduce(
            (acc, i) => acc + i.total,0)

            const finalTotal = itemsTotal - newInvoice.discount + newInvoice.tax

            await API.post('/invoices', {
            ...newInvoice,
            total: itemsTotal,
            finalTotal,
            })
            toast.success("Invoice Aded successfully")

            await fetchAll()
            setOpen(false)
            setNewInvoice({
            items: [],
            discount: 0,
            tax: 0,
            paymentMethod: "cash",
            customer: "",
            })

        } catch (error) {
            console.error(error.response?.data || error.message)
            toast.error("Failed to create an invoice ")
        }
    }

    return (
        <div className='pt-32 p-10 bg-[#f6f4ef] min-h-screen'>
            <motion.div 
                initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}
                className='flex items-center justify-between mb-10'>
                
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#C9A86A]/20 border-[#C9A86A]/40 rounded-xl">
                        <Receipt size={30} className='text-[#C9A86A]'/>
                    </div>
                    <h1 className="text-4xl font-bold text-neutral-900 tracking-wide">
                        Invoices
                    </h1>
                </div>
                <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.98}}
                onClick={() => setOpen(true)} className='px-5 py-3 flex items-center 
                gap-2 text-white bg-[#C9A86A] cursor-pointer rounded-xl shadow-md hover:bg-[#b8965f] transition '>
                    <Plus size={20}/> Add Invoice
                </motion.button>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                
                {invoices.map((inv) => (
                    <motion.div key={inv._id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
                    whileHover={{scale:1.03}} transition={{type:"spring", stiffness:200, damping:18}}
                    className='p-6 bg-white border border-neutral-200 rounded-xl shadow-sm 
                    hover:shadow-xl cursor-pointer transition group'>
                        
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-xl font-semibold text-neutral-800">
                                Invoice # {inv.invoiceNumber}
                            </h2>
                            <DollarSign className='text-[#C9A86A]'/>
                        </div>
                        
                        <p className="mb-1 text-neutral-600">
                            <span className="font-medium"> Customer: </span>
                            {inv.customer ? inv.customer.name : "Walk-in"}
                        </p>

                          <p className="mb-1 text-neutral-600">
                            <span className="font-medium"> Items: </span>
                            {inv.items.length}
                        </p>
                        <div className="text-neutral-800 font-bold mt-3 text-lg">
                            {inv.finalTotal} USD
                        </div>
                    </motion.div>
                ))}
            </div>
            <AnimatePresence>
                {open && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                        className='fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-100'>
                            
                            <motion.div initial={{scale:0.85,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.85,opacity:0}}
                            transition={{type:"spring", stiffness:180, damping:20}} className='w-full max-w-2xl bg-white p-8 rounded-3xl
                            shadow-2xl border border-[#C9A86A]/40'>
                                
                                <div className="flex items-center justify-between mb-6">
                                    
                                    <h2 className="text-2xl font-bold text-neutral-900">
                                        Create Invoice
                                    </h2>
                                    <button onClick={() => setOpen(false)}>
                                        <X className='text-neutral-600 hover:text-red-500 transition'/>
                                    </button>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor='select' className="text-sm">
                                        Select Customer
                                    </label>
                                    <select id='select' value={newInvoice.customer} 
                                        className='w-full mt-1 p-3 border rounded-xl bg-neutral-50'
                                        onChange={(e) => setNewInvoice({...newInvoice,customer:e.target.value})}>
                                        <option value=""> No Customer </option>
                                        {customers.map((c) => (
                                            <option key={c._id} value={c._id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {/* Items */}
                                <div className="mb-4">
                                    
                                    <h3 className="font-semibold text-neutral-800 mb-2">
                                        Items
                                    </h3>
                                    {newInvoice.items.map((item,idx) => (
                                        <div key={idx} className="flex gap-3 mb-3 p-3 border bg-neutral-50 rounded-xl">
                                            <select className='flex-1 p-2 rounded-lg border'
                                                value={item.productId} 
                                                onChange={(e) => updateItem(idx, "productId", e.target.value)}>
                                                <option value="">Product</option>
                                                {products.map((p) => (
                                                    <option key={p._id} value={p._id}>
                                                        {p.name} ${p.sellingPrice}
                                                    </option>
                                                ))}
                                            </select>
                                            <input type="number" className='w-24 rounded-lg border'
                                                value={item.qty} onChange={(e) => updateItem(idx,"qty", e.target.value)} />
                                            <input type="number" className='w-28 p-2 rounded-lg border bg-white'
                                                value={item.total} disabled />
                                        </div>
                                    ))}
                                    <button onClick={addItem} className='mt-2 py-3 px-4 bg-[#C9A86A] text-white 
                                        rounded-xl hover:bg-[#b8965f] transition'>
                                        + Add Item
                                    </button>
                                </div>
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <label> Discount </label>
                                        <input type="number" value={newInvoice.discount}
                                        className='w-full mt-1 p-2 border rounded-xl 
                                        bg-neutral-50' onChange={(e) => {
                                            setNewInvoice({
                                                ...newInvoice,
                                                discount:parseFloat(e.target.value),
                                            })
                                        }} />
                                    </div>
                                    <div>
                                        <label> Tax </label>
                                        <input type="number" value={newInvoice.tax}
                                        className='w-full mt-1 p-2 border rounded-xl 
                                        bg-neutral-50' onChange={(e) => {
                                            setNewInvoice({
                                                ...newInvoice,
                                                tax:parseFloat(e.target.value),
                                            })
                                        }} />
                                        
                                    </div>
                                    <div>
                                        <label> Payment Method </label>
                                        <select value={newInvoice.paymentMethod} onChange={(e) => {
                                            setNewInvoice({
                                                ...newInvoice,
                                                paymentMethod:e.target.value,
                                            })
                                        }} className='w-full p-2 mt-1 border rounded-xl bg-neutral-50'> 
                                            <option value="cash">cash</option>
                                            <option value="card">card</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end mt-6">
                                    <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.96}}
                                    onClick={saveInvoice} className='px-6 py-3 bg-[#C9A86A] text-white
                                    rounded-xl shadow-lg hover:bg-[#b8965f] cursor-pointer transition'>
                                        Save Invoice
                                    </motion.button>
                                </div>
                            </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
export default Invoices