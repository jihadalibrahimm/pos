import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

function FramerMotion() {
    const [view, setView] = useState(true)
    useEffect(()=>{
        setTimeout(() => {
            setView(false)
        }, 3000);
    },[])
    return (
        <div>
            <motion.input className="border-2" whileFocus={{scale:1.1}}></motion.input>
            <motion.button
                className="border-2 p-4"
                initial={{x:0}}
                animate={{x:500}}
                transition={{duration:0.2,delay:0.2,type:'spring',stiffness:120,mass:0.8,damping:5}}
                whileDrag={{scale:1}}
                drag="x"
                dragConstraints={{left:0,right:5}}
            >
                Submit
            </motion.button>
            <AnimatePresence>
                {view && (
                    <motion.button
                        exit={{opacity:0,x:200}}
                        transition={{duration:2}}
                    >
                        Code! 
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    )
}

export default FramerMotion