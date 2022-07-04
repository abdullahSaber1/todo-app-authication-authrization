const app = require("./app");
const connectDB = require("./helper/connectDB");

const PORT = process.env.PORT || 8000;

const MONGODB_URL =
  "mongodb+srv://todoList:01066773356@cluster0.4tbk1gj.mongodb.net/Todos?retryWrites=true&w=majority";

connectDB(MONGODB_URL);

app.listen(PORT, console.log(`Server listening on PORT ${PORT}`));
