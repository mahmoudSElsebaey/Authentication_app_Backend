import express from "express";
import { connectionDB } from "./config/db/connectionDB.js";
import { config } from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
// import { corsOptions } from "./config/corsOptions.js";
import cookieParser from "cookie-parser";
import * as routes from "./src/Routes/Root.route.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config();
const PORT = process.env.PORT || 5000;
const app = express();

//________________________________ Connect to MongoDB ________________________________
connectionDB();

// ________________________________ CORS configuration and middleware setup ________________________________
const corsOptions= 
  {
  origin: "https://authentication-app-frontend-seven.vercel.app",
  credentials: true,
  optionsSuccessStatus: 200,
 
}

app.use(cors(corsOptions));
// app.options("*", cors(corsOptions)); // Enable pre-flight for all routes 
 
// ________________________________ Middleware setup ________________________________
app.use(cookieParser()); 
app.use(express.json());

// ________________________________ Serve static files from the "public" directory ________________________________
app.use(express.static(path.join(__dirname, "public")));

// ________________________________ Basic route ________________________________
app.use("/", routes.rootRouter);
app.use("/auth", routes.authRouter);
app.use("/users", routes.userRouter);

// ________________________________ 404 Error handling for unmatched routes ________________________________
app.use((req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "error.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// ________________________________ Error handling middleware ________________________________
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// ________________________________ Start the server after successful DB connection ________________________________
mongoose.connection.once("open", () => {
  app.listen(PORT, "0.0.0.0", () =>
    console.log(`Server running on port ${PORT}`)
  );
});

// ________________________________ Handle DB connection errors ________________________________
mongoose.connection.on("error", (err) => {
  console.log(err);
});
