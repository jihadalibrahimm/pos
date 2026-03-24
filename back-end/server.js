import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

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

const isTrustedOrigin = (origin) => {
    if (!origin) return true
    if (allowedOrigins.includes(origin)) return true
    if (!isProduction && /^http:\/\/localhost:\d+$/.test(origin)) return true
    return false
}

app.set("trust proxy", 1)

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
}))

app.use(cors({
    origin(origin, callback) {
        if (isTrustedOrigin(origin)) {
            return callback(null, true)
        }

        return callback(new Error(`CORS blocked for origin: ${origin}`))
    },
    credentials: true,
}))

app.use((req, res, next) => {
    const stateChangingMethods = ["POST", "PUT", "PATCH", "DELETE"]
    if (!stateChangingMethods.includes(req.method)) return next()

    const origin = req.get("origin")
    if (!isTrustedOrigin(origin)) {
        return res.status(403).json({ message: "Invalid request origin" })
    }

    return next()
})

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests, please try again later." },
})

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many authentication attempts. Please try later." },
})

app.use("/api", apiLimiter)
app.use("/api/auth", authLimiter)
app.use("/api/admin/auth", authLimiter)

app.use(express.json({ limit: "100kb" }))
app.use(cookieParser())

const sanitizeObject = (value) => {
    if (!value || typeof value !== "object") return

    for (const key of Object.keys(value)) {
        if (key.startsWith("$") || key.includes(".")) {
            delete value[key]
            continue
        }

        const nested = value[key]
        if (Array.isArray(nested)) {
            nested.forEach((item) => sanitizeObject(item))
        } else if (nested && typeof nested === "object") {
            sanitizeObject(nested)
        }
    }
}

app.use((req, res, next) => {
    sanitizeObject(req.body)
    sanitizeObject(req.query)
    sanitizeObject(req.params)
    next()
})

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
    console.error(err)
    res.status(err.status || 500).json({
        message: isProduction ? "Internal Server Error" : err.message,
    })
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