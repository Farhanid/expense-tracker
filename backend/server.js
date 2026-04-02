import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import { connectDB } from './config/db.js';
import userRouter from './routes/userRoutes.js';
import incomeRouter from './routes/incomeRoutes.js';
import expenseRouter from './routes/expenseRoutes.js';
import dashboardRouter from './routes/dashboardRoutes.js';

dotenv.config();

const app = express();
const port = 4000;


const allowedOrigins = [
    'https://expense-tracker-lk1q.onrender.com',  // Your frontend
    'http://localhost:4000',  // Local development
    'http://localhost:5173',
    'http://localhost:5174',

       // Vite default port
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,  // Allow cookies/authorization headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

//MIDDLEWARE
// app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))



//DB
connectDB();

//ROUTES
app.use("/api/user", userRouter)
app.use("/api/income", incomeRouter)
app.use("/api/expense", expenseRouter)
app.use("/api/dashboard", dashboardRouter)

app.get('/', (req, res) => {
   res.send('Api is working ')
})

app.listen(port , () => {
    console.log(`server working http://localhost:${port}`)
})