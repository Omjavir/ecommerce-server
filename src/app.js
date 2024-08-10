import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";
import bodyParser from "body-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import categoryRouter from "./routes/category.route.js";
import productRouter from "./routes/product.route.js";

//routes declaration
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/product", productRouter);

// Error handling middleware
app.use(errorHandler);

export { app };
