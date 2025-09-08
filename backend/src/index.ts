import app from "./app";
import { connectDB } from "./config/db";
import { PORT } from "./config/env";

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
connectDB();