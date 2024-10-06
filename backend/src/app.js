import express from 'express'

import { config } from "dotenv"
import appRouter from './routes/index.js'
import cors from 'cors'

config()


const app = express()

//middleware
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};


app.use(cors(corsOptions));
app.use(express.json())
app.use("/api/v1", appRouter)




export default app