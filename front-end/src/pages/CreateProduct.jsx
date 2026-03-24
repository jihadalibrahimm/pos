import {useState } from "react"
import API from "../api/axios"
import { AnimatePresence, motion } from "framer-motion"
import { Package, AlertCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

function CreateProduct() {
    const [name , setName ] = useState("")
    const [category , setCategory ] = useState("")
    const [purchasePrice , setPurchasePrice ] = useState("")
    const [sellingPrice , setSellingPrice ] = useState("")
    const [stock , setStock] = useState("")
    const [minStock , setMinStock ] = useState(5)
    const [imageFile, setImageFile] = useState(null)

    const [loading , setLoading ] = useState(false)
    const [error , setError ] = useState("")

    const nav = useNavigate()

    const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("category", category);
        formData.append("purchasePrice", purchasePrice);
        formData.append("sellingPrice", sellingPrice);
        formData.append("stock", stock);
        formData.append("minStock", minStock);
        if (imageFile) formData.append("image", imageFile); // imageFile متغير جديد

        await API.post("/products", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        setLoading(false);
        nav("/products");
    } catch (err) {
        setError(err.response?.data?.message || "Something went wrong!");
        setLoading(false);
    }
};

    return (
        <div className="min-h-screen pt-28 p-10 bg-linear-to-b from-[#f8f6f1] to-[#f0e5d2]
        flex justify-center">
            <motion.div initial={{opacity:0, y:-20}} animate={{opacity:1, y:0}} transition={{delay:0.15,duration:0.6}}
            className="w-full max-w-lg p-6 bg-white/90 backdrop-blur-xl border
            border-[#C9A86A]/25 rounded-xl shadow-xl flex flex-col gap-5">
                
                <h1 className="text-4xl font-semibold text-neutral-900 tracking-wide flex items-center gap-3">
                    <Package size={36} className='text-[#C9A86A]'/> Add New Product
                </h1>
                {error &&(
                    <div className="flex p-2 items-center gap-2 bg-red-100 
                    border border-red-300 text-red-700 rounded-md">
                        <AlertCircle size={20}/> {error}
                    </div>
                )}

                <form onSubmit={submit} className="flex flex-col gap-4">
                    
                    <input type="text" placeholder="Product Name" value={name} 
                    onChange={(e) => setName(e.target.value)} className="p-3 border border-neutral-300
                    rounded-xl focus:outline-none focus:ring-2  focus:ring-yellow-400" required/>

                    <input type="text" placeholder="Category" value={category} 
                    onChange={(e) => setCategory(e.target.value)} className="p-3 border border-neutral-300
                    rounded-xl focus:outline-none focus:ring-2  focus:ring-yellow-400" required/>

                    <input type="number" placeholder="Purchase Price" value={purchasePrice} 
                    onChange={(e) => setPurchasePrice(e.target.value)} className="p-3 border border-neutral-300
                    rounded-xl focus:outline-none focus:ring-2  focus:ring-yellow-400" required/>

                    <input type="number" placeholder="Selling Price" value={sellingPrice} 
                    onChange={(e) => setSellingPrice(e.target.value)} className="p-3 border border-neutral-300
                    rounded-xl focus:outline-none focus:ring-2  focus:ring-yellow-400" required/>

                    <input type="number" placeholder="Stock" value={stock} 
                    onChange={(e) => setStock(e.target.value)} className="p-3 border border-neutral-300
                    rounded-xl focus:outline-none focus:ring-2  focus:ring-yellow-400" required/>

                    <input type="number" placeholder="Min Stock(optional)" value={minStock} 
                    onChange={(e) => setMinStock(e.target.value)} className="p-3 border border-neutral-300
                    rounded-xl focus:outline-none focus:ring-2  focus:ring-yellow-400" required/>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      className="p-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />

                    <button type="submit" disabled={loading} className="mt-4 py-3 bg-linear-to-r
                    from-yellow-400 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg
                    hover:shadow-yellow-300/40 cursor-pointer transition-all">
                        {loading ? "Saving..." : "Save Prodcut"}
                    </button>

                </form> 

            </motion.div>
        </div>
    )
}

export default CreateProduct