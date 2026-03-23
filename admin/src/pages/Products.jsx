import React, { useState, useEffect } from "react"; 
import API, { apiOrigin } from "../api/axios";
import { AnimatePresence, motion } from "framer-motion";
import { FaEdit, FaTrash, FaPlusCircle } from "react-icons/fa";
import { toast } from "react-toastify";

function Products() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name:"", category:"", purchasePrice:"", sellingPrice:"", stock:"", minStock:5, image:null });
  const [imagePreview, setImagePreview] = useState(null);
  const [filter, setFilter] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/products"); // حاليًا بدون protect
      setProducts(res.data);
      setFiltered(res.data);
    } catch (err) {
      toast.error("Failed to fetch products");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => {
    if(!filter) setFiltered(products);
    else setFiltered(products.filter(p => p.name.toLowerCase().includes(filter.toLowerCase())));
  }, [filter, products]);

  const handleEdit = (p) => {
    setEditing(p);
    setForm({ name:p.name, category:p.category, purchasePrice:p.purchasePrice, sellingPrice:p.sellingPrice, stock:p.stock, minStock:p.minStock, image:null });
    setImagePreview(p.image ? `${apiOrigin}/uploads/${p.image}` : null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      for(let key in form) if(form[key]!==null) data.append(key, form[key]);
      await API.put(`/products/${editing._id}`, data, { headers:{ "Content-Type":"multipart/form-data" }});
      toast.success("Updated!");
      setEditing(null);
      fetchProducts();
    } catch(err){ toast.error("Failed to update"); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Delete?")) return;
    try { 
      await API.delete(`/products/${id}`); 
      toast.success("Deleted!"); 
      fetchProducts(); 
    } 
    catch(err){ 
      toast.error("Failed");
      console.error(err)
    }
  };

  if(loading) return <div className="p-8 text-xl font-bold">Loading...</div>;

  return (
    <div className="p-6 pt-32 bg-[#fdfcf7] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <a href="/products/create" className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl">
          <FaPlusCircle /> Add Product
        </a>
      </div>

      <input placeholder="Search..." value={filter} onChange={e=>setFilter(e.target.value)}
        className="p-3 border rounded-xl w-full mb-6 focus:outline-none focus:ring-1 transition"/>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
        {filtered.map((p,i)=>(
          <motion.div key={p._id} initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.9}} whileHover={{scale:1.03, boxShadow:"0px 10px 20px rgba(0,0,0,0.1)"}} transition={{delay:i*0.05}}
            className="bg-white p-5 rounded-2xl shadow-md flex flex-col justify-between"
          >
            {p.image && <img src={`${apiOrigin}/uploads/${p.image}`} alt={p.name} className="w-full h-56 md:h-64 lg:h-72 object-contain rounded-xl bg-gray-100"/>}
            <div className="mt-3">
              <p className="font-bold text-lg">{p.name}</p>
              <p className="text-gray-600">{p.category}</p>
              <p>Cost: ${p.purchasePrice}</p>
              <p>Selling: ${p.sellingPrice}</p>
              <p>Stock: {p.stock}</p>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={()=>handleEdit(p)} className="flex-1 p-2 bg-yellow-400 hover:bg-yellow-300 rounded
               font-semibold text-white flex justify-center gap-2 cursor-pointer">
                <FaEdit /> Edit
              </button>
              <button onClick={()=>handleDelete(p._id)} className="flex-1 p-2 bg-red-500 hover:bg-red-400 rounded
               font-semibold text-white flex justify-center gap-2 cursor-pointer">
                <FaTrash /> Delete
              </button>
            </div>
          </motion.div>
        ))}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
      {editing && (
        <EditModal onClose={()=>setEditing(null)}>
          <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
          <form className="space-y-3" onSubmit={handleUpdate}>
            <input type="text" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full p-2 border rounded"/>
            <input type="text" placeholder="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="w-full p-2 border rounded"/>
            <input type="number" placeholder="Purchase Price" value={form.purchasePrice} onChange={e=>setForm({...form,purchasePrice:e.target.value})} className="w-full p-2 border rounded"/>
            <input type="number" placeholder="Selling Price" value={form.sellingPrice} onChange={e=>setForm({...form,sellingPrice:e.target.value})} className="w-full p-2 border rounded"/>
            <input type="number" placeholder="Stock" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} className="w-full p-2 border rounded"/>
            <input type="file" onChange={e=>{setForm({...form,image:e.target.files[0]}); setImagePreview(URL.createObjectURL(e.target.files[0]))}} className="w-full p-2 border rounded"/>
            {imagePreview && <img src={imagePreview} className="w-full h-56 object-contain rounded-xl bg-gray-100"/>}

            <div className="flex gap-2 justify-end mt-3">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500">Save</button>
              <button type="button" onClick={()=>setEditing(null)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
            </div>
          </form>
        </EditModal>
      )}
      </AnimatePresence>
    </div>
  );
}

function EditModal({ children, onClose }) {
  return (
    <>
      <motion.div className="fixed inset-0 bg-black/40 z-50" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}/>
      <motion.div className="fixed top-1/2 left-1/2 z-50 w-full max-w-md bg-white rounded-2xl shadow-xl p-6 -translate-x-1/2 -translate-y-1/2"
        initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.8,opacity:0}} onClick={e=>e.stopPropagation()}
      >
        {children}
      </motion.div>
    </>
  )
}

export default Products;
