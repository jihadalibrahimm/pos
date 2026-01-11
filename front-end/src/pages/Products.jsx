import { useEffect, useState } from 'react'
import API from '../api/axios'
import { motion } from 'framer-motion'
import { AlertCircle, Package } from 'lucide-react'

function Products() {
    const [products, setProducts] = useState([])
    const [error, setError] = useState("")

    useEffect(() => {
        API.get('/products')
        .then((res) => setProducts(res.data))
        .catch((err) => {
            console.log(err)
            setError("Failed to fetch products!")
        })

    },[])
    return (
        <div className="pt-32 min-h-screen p-10 bg-transparent  ">
            <motion.h1 initial={{opacity:0, y:-20}} animate={{opacity:1, y:0}}
            className='text-4xl font-bold text-neutral-900 mb-10 flex items-center gap-3'>
                <Package size={36} className='text-[#C9A86A]'/>
                Products
            </motion.h1>
            {error && (
                <motion.div 
                    initial={{opacity:0}} animate={{opacity:1}}
                    className='flex items-center gap-2 p-3 bg-red-100 border
                 border-red-300  text-red-700 rounded-md mb-6'>
                    <AlertCircle size={20} />
                    {error}
                </motion.div>
            )}
            {products.length === 0 ? (
                <motion.p initial={{opacity:0}} animate={{opacity:1}}
                className='text-neutral-600 text-lg'>
                    No Products Found
                </motion.p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((p) => (
                        <motion.div key={p._id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
                        transition={{type:"spring", stiffness:200 ,damping:10}}
                        className='p-6 bg-white/90 backdrop-blur-xl border border-[#C9A86A]/25 rounded-2xl 
                        shadow-md hover:shadow-2xl cursor-pointer transition-all'>
                            <div className="flex items-center gap-3 mb-4">
                                
                                <div className='p-3 rounded-xl bg-[#C9A86A]/10 border-[#C9A86A]/30'>
                                    <Package size={28} className='text-[#C9A86A]' />
                                </div>
                                <h2 className="text-xl font-semibold text-neutral-800">
                                    {p.name}
                                </h2>
                            </div>
                            <p className="text-neutral-700 font-medium">
                                Purchase Price:${p.purchasePrice}
                            </p>
                            <p className="text-neutral-700 font-medium">
                                Selling Price:${p.sellingPrice}
                            </p>
                            <p className="text-neutral-500 mt-1">Stock : {p.stock}</p>
                            <p className="text-neutral-500 mt-1">Category : {p.category}</p>
                            {p.stock < p.minStock && (
                                <p className="text-sm mt-2 text-red-600 font-semibold">Low Stock! Min: {p.minStock}</p>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Products