import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import survey from './routes/survey_route';
import user from './routes/user_route';
import auth from './routes/auth_route'


// Load environment variables from .env file
dotenv.config();

const app = express();

// Use environment variable for MongoDB connection string
const mongo_url = "mongodb+srv://hello:hello@gigger.a3cwnzw.mongodb.net/?retryWrites=true&w=majority&appName=GIGGER";

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(mongo_url, {  })
    .then(() => console.log("DB connected"))
    .catch(err => console.error("DB connection error:", err));

// Routes
app.get('/', (req, res) => {   
  res.send('Hello World!');   
});
app.use("/api/auth", user);
app.use("/api/survey", survey);
app.use("/auth/login", auth);

// Start server
const PORT = 8080;
app.listen(PORT, () => {    
  console.log(`Server is running on port ${PORT}`);
});