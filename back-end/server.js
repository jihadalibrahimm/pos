import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'

import userAuthRoutes from "./routes/userAuthRoutes.js"
import adminAuthRoutes from './routes/adminAuthRoutes.js'
import adminSettingsRoutes from './routes/adminSettingsRoutes.js'
import adminProjectsRoutes from './routes/adminProjectsRoutes.js'
import adminNotificationsRoutes from './routes/adminNotificationsRoutes.js'
import adminDashboardRoutes from './routes/adminDashboardRoutes.js'
import reportsRoutes from './routes/reportsRoutes.js'
import settingsRoutes from './routes/settingsRoutes.js'
import productRoutes from './routes/productRoutes.js'
import notificationsRoutes from './routes/notificationsRoutes.js'
import invoiceRoutes from './routes/invoiceRoutes.js'
import customerRoutes from './routes/customerRoutes.js'
import adminUsersRoutes from './routes/adminUsersRoutes.js'
import adminTransactionsRoutes from './routes/adminTransactionsRoutes.js'
dotenv.config()

const app = express()

app.use(cors({
    origin:["http://localhost:5173","http://localhost:5174"],
    credentials:true,
}))

app.use(express.json())
app.use(cookieParser())

app.get('/', (req,res) => res.json({message:"API is running..."}))

app.use("/api/admin/auth",adminAuthRoutes)
app.use("/api/admin/users",adminUsersRoutes)
app.use("/api/admin/dashboard",adminDashboardRoutes)
app.use("/api/admin/projects",adminProjectsRoutes)
app.use("/api/admin/transactions",adminTransactionsRoutes)
app.use("/api/admin/notifications",adminNotificationsRoutes)
app.use("/api/admin/settings",adminSettingsRoutes)

app.use("/api/auth", userAuthRoutes)
app.use("/api/products",productRoutes)
app.use("/api/invoices",invoiceRoutes)
app.use("/api/customers",customerRoutes)
app.use("/api/reports",reportsRoutes)
app.use("/api/notifications",notificationsRoutes)
app.use("/api/settings",settingsRoutes)
app.use("/uploads", express.static("uploads"));

app.use((req,res) => res.status(404).json({message:"Route Not Found"}))

app.use((err,req,res,next) => {
    console.log(err)
    res.status(500).json({message:err.message})
})

const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Mongo Connected")
        app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))
    })
    .catch((err) => console.log(err))