import mongoose from "mongoose";
import app from "./app";

const uri =
  "mongodb+srv://iqbal:12345@cluster0.axpgb1h.mongodb.net/library-management-system?retryWrites=true&w=majority&appName=Cluster0";
const PORT = 3000;
async function Main() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

Main();
