import express from "express"
import cors from "cors"
import 'dotenv/config'
import cookieParser from "cookie-parser"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import morgan from "morgan"
import mongoSanitize from "express-mongo-sanitize"
import xss from "xss-clean"

import connectDB from "./config/db.js"

import authRouter from "./routes/authRoute.js"
import vehicleRouter from "./routes/vehicleRoutes.js"
import bookingRouter from "./routes/bookingRoutes.js"
import parkingRouter from "./routes/parkingRoute.js"

const app = express();
const port = process.env.PORT || 3000;

connectDB();

// Security middleware
// app.use(helmet()); // Set security HTTP headers
// app.use(mongoSanitize()); // Prevent NoSQL injection
// app.use(xss()); // Prevent XSS attacks

// Request size limiting
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(cookieParser());

// Implement CORS with more specific configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
    max: 1000, // 1000 requests
    windowMs: 60 * 60 * 1000, // per 1 hour
    message: 'Too many requests, please try again in an hour!'
});
app.use('/api', limiter);

// Request logging
app.use(morgan('dev'));

// Test route
app.get('/', (req, res) => {
        console.log(req.originalUrl);
        res.send("APIs is currently running...");
});

// Auth routes
app.use('/api/auth', authRouter);
// Vehicle routes
app.use('/api/vehicles', vehicleRouter);
// Booking routes
app.use('/api/bookings', bookingRouter);
// Parking routes
app.use('/api/parking', parkingRouter);

// Global error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: 'error',
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
});