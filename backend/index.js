import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js"; // Ensure the .js extension is included
import authRoute from "./routes/authRoute.js";
import cookieparser from "cookie-parser"
import cors from "cors"
dotenv.config();

const app = express();
const port = 3000;

// Connect to the database
connectDB();
// Middleware to parse JSON
app.use(cors({origin:"http://localhost:5173", credentials:true}))
app.use(express.json());
app.use(cookieparser())
console.log("JWT_SECRET:", process.env.JWT_SECRET);

app.use("/api/auth",authRoute)
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
