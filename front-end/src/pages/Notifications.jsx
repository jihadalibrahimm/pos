import { useEffect, useState } from "react"
import API from "../api/axios"
import { AnimatePresence, motion } from "framer-motion"
import { Bell } from "lucide-react"

function Notifications() {
    const [ notifications , setNotifications ] = useState([])
    
    useEffect(() => {
        API.get('/notifications')
        .then(res => setNotifications(res.data))
        .catch(err => console.log(err))
    },[])

    return (
        <div className="pt-32 min-h-screen p-10 bg-linear-to-b from-[#faf6ef] to-[#f0e5d2] ">
            <motion.div
                initial={{opacity:0, y:-25}} animate={{opacity:1, y:0}}
                className="flex items-center gap-4 mb-10">
                
                <div className="p-3 bg-[#C9A86A] border border-[#C9A86A]/30 rounded-xl">
                    <Bell size={32} className="text-white"/>
                </div>
                <h1 className="text-4xl font-bold text-neutral-900 tracking-wide">
                    Notifications
                </h1>
            </motion.div>
            <div className="flex flex-col max-w-4xl">
                <AnimatePresence>
                    {notifications.length === 0 ? (
                        <motion.p initial={{opacity:0}} animate={{opacity:1}}
                            className="text-neutral-600 text-lg">
                                No Notifications
                        </motion.p>
                    ) : (
                        notifications.map((n) => (
                            <motion.div
  key={n._id}
  initial={{ opacity: 0, y: 15 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -10 }}
  transition={{ type: "spring", stiffness: 250, damping: 20 }}
  className="bg-white rounded-2xl p-5 mb-4 border border-neutral-200 
             shadow-sm hover:shadow-lg transition-all flex gap-4"
>
                                    
                                    <p className="text-neutral-800 font-medium">
                                        {n.message}
                                    </p>
                                    <span className="text-sm text-neutral-500 mt-1 block">
{n.createdAt
  ? new Date(n.createdAt).toLocaleString()
  : "Just now"}

                                    </span>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1,y:0}} 
                className="mt-16 text-center text-neutral-600">
                    <p> End of notifications timeline </p>
            </motion.div>
        </div>
    )
}
export default Notifications