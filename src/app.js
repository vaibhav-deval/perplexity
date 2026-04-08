import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRouter);
app.get("/", (req, res) => {
  res.json({ message: "Hello from Express with ES modules!" });
});

export default app;
