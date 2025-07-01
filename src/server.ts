import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";

let server: Server;
const PORT = 3000;
async function Main() {
  try {
    await mongoose.connect(
      "mongodb+srv://loverumi36:12345@cluster0.g9ncr.mongodb.net/library-management-system?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

Main();
