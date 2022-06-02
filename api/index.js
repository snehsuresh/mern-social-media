const express = require("express");
const app = express();

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

const userRoute = require("./routes/users.js");
const authRoute = require("./routes/auth.js");
const postRoute = require("./routes/posts");

const multer = require("multer");
const path = require("path");

dotenv.config();

mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
  },

  () => {
    console.log("connected to MongoDB");
  }
);

app.use("/images", express.static(path.join(__dirname, "public/images"))); //pointing to images folder since lh5000/images wont point to any folder as it is rest api would try to make a post request instead. So we are essentially saying her that if we do lh5000/images dont make any request just go to the directory mentioned

//MIDDLEWARE
//body parser
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.get("/", (req, res) => {
  res.send("Welcome to homepage");
});

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

//multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name); //filename
  },
});
const upload = multer({ storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploaded Successfully!");
  } catch (error) {
    console.log(error);
  }
});

app.listen(5000, () => {
  console.log("backend running at 5000!");
});
