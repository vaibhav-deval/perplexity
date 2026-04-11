import { config } from "dotenv";

import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import { generateResponse } from "./src/services/ai.service.js";
generateResponse();

config();

await connectDB();

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
