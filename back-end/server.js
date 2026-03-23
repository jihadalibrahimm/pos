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
import adminCustomersRoutes from "./routes/adminCustomersRoutes.js"
import adminReportsRoutes from "./routes/adminReportsRoutes.js"
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGO_URL = process.env.MONGO_URL
const isProduction = process.env.NODE_ENV === "production"
const allowedOrigins = [
    "https://poss-iksh.onrender.com",
    "https://poss.onrender.com",
]

if (process.env.CLIENT_URL) {
    allowedOrigins.push(process.env.CLIENT_URL)
}

if (process.env.ADMIN_URL) {
    allowedOrigins.push(process.env.ADMIN_URL)
}

app.use(cors({
    origin(origin, callback) {
        if (!origin) return callback(null, true)

        const isAllowedStaticOrigin = allowedOrigins.includes(origin)
        const isLocalhostOrigin = !isProduction && /^http:\/\/localhost:\d+$/.test(origin)

        if (isAllowedStaticOrigin || isLocalhostOrigin) {
            return callback(null, true)
        }

        return callback(new Error(`CORS blocked for origin: ${origin}`))
    },
    credentials: true,
}))

app.use(express.json())
app.use(cookieParser())

app.get('/', (req,res) => res.json({message:"API is running..."}))

app.use("/api/admin/auth",adminAuthRoutes)
app.use("/api/admin/users",adminUsersRoutes)
app.use("/api/admin/dashboard",adminDashboardRoutes)
app.use("/api/admin/projects",adminProjectsRoutes)
app.use("/api/admin/transactions",adminTransactionsRoutes)
app.use("/api/admin/customers", adminCustomersRoutes)
app.use("/api/admin/reports", adminReportsRoutes)
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

const RETRY_BASE_DELAY_MS = 5000
const RETRY_MAX_DELAY_MS = 60000

if (!MONGO_URL) {
    throw new Error("Missing MONGO_URL in environment variables")
}

const startServer = () => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

const connectMongoWithRetry = async (attempt = 1) => {
    try {
        await mongoose.connect(MONGO_URL, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
        })
        console.log("Mongo Connected")
    } catch (err) {
        const delay = Math.min(RETRY_BASE_DELAY_MS * attempt, RETRY_MAX_DELAY_MS)
        console.error(`Mongo connection failed (attempt ${attempt}). Retrying in ${delay / 1000}s`)
        console.error(err.message)
        setTimeout(() => connectMongoWithRetry(attempt + 1), delay)
    }
}

mongoose.connection.on("disconnected", () => {
    console.warn("Mongo disconnected. Reconnecting...")
    connectMongoWithRetry()
})

mongoose.connection.on("error", (err) => {
    console.error("Mongo error:", err.message)
})

connectMongoWithRetry()
startServer()