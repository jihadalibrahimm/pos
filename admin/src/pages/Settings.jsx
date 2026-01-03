import React, {useState, useEffect } from "react"
import API from "../api/axios"
import { 
    FiFileText,
    FiDollarSign,
    FiCalendar,
    FiInfo,
    FiBarChart,
} from "react-icons/fi"
import { AnimatePresence, motion } from "framer-motion"
const [loading, setLoading] = useState(true)

function Settings() {
    const [settings, setSettings] = useState(null)
    
    useEffect(() => {
        const fetchSettings = async() => {
            try {
                const res = await API.get('/admin/settings')
                setSettings(res.data)
            }catch(err){
                console.log(err)
            }finally{
                setLoading(false)
            }
            fetchSettings()
        }
    },[])

    const handleUpdateSettings = async(updatedSettings) => {
        try {
            const res = await API.put('/admin/settings', updatedSettings)
            setSettings(res.data)
        }catch(err){
            console.log(err)
        }
    }

    if(loading)
        return(
            <div className="p-8 text-xl font-semibold animate-pulse">
                Loading Invoices...
            </div>
        )

    return (
        <div>
            <h2>Settings</h2>
            {settings ? (
                <div>
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        const updatedSettings = {
                            storeName: e.target.storeName.value,
                            taxRate: e.target.taxRate.value,
                        }
                        handleUpdateSettings(updatedSettings)
                    }}>
                        <div>
                            <label htmlFor="storeName">Store Name: </label>
                            <input type="text" id="storeName" name="storeName" 
                            defaultValue={settings.storeName} />
                        </div>
                        <div>
                            <label htmlFor="taxRate">Tax Rate (%) : </label>
                            <input type="number" id="taxRate" name="taxRate" 
                            defaultValue={settings.taxRate} />
                        </div>
                        <div>
                            <label htmlFor=""></label>
                            <input type="text" />
                        </div>
                        <button type="submit">Save Changes</button>
                    </form>
                </div>
            ) : (
                <p>Loading Settings ...</p>
            )}
        </div>
    )
}

export default Settings
