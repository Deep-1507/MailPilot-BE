import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from "socket.io";
import 'dotenv/config';
import path from "path";
import { fileURLToPath } from "url";
import mongoose from 'mongoose';

// Routes
import userRoutes from "./routers/userRouter.js";
import credRoutes from "./routers/credRouter.js";
import templateRoutes from "./routers/templateRouter.js";
import mainRoutes from "./routers/mainRouter.js";
import apiRoutes from "./routers/apiRouter.js";
import busineessUserGroup from "./routers/businessUserGroupRouter.js";
import adminRoutes from "./routers/adminRouter.js";

// NEW
import mailRoutes from "./routers/mailRouter.js";

// DB Connection
import { MONGO_URI } from '../config.js';

const app = express();
const server = http.createServer(app);

// SOCKET.IO
const io = new Server(server,{
    cors:{
        origin:"*"
    }
});

app.set("io",io);

io.on("connection",(socket)=>{

    console.log("Socket Connected :",socket.id);

    socket.on("join",(userId)=>{

        socket.join(userId);

        console.log("Joined :",userId);

    });

    socket.on("disconnect",()=>{

        console.log("Socket Disconnected");

    });

});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Could not connect to MongoDB', err));

// Routes
app.use("/api/v1", userRoutes);
app.use("/api/v2", credRoutes);
app.use("/api/v3", templateRoutes);
app.use("/api/v4", mainRoutes);
app.use("/api/v5", apiRoutes);
app.use("/api/v6", busineessUserGroup);
app.use("/api/v7", adminRoutes);

// NEW
app.use("/api/mail",mailRoutes);

process.removeAllListeners("SIGINT");

process.on('SIGINT', () => {

    console.log("Shutting down");

    server.close(()=>{

        process.exit(0);

    });

});

// Error Handling
app.use((req,res,next)=>{

    res.status(404).json({
        error:"Route not found"
    });

});

app.use((err,req,res,next)=>{

    console.error(err);

    res.status(500).json({
        error:"Internal Server Error"
    });

});

const port=process.env.PORT||3000;

server.listen(port,()=>{

    console.log(`Server listening on ${port}`);

});