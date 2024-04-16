const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "public")));
mongoose
  .connect("mongodb+srv://mohamed:12345SmS...@cluster0.2ybsxia.mongodb.net/")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.use(cors());
app.use(express.json());

const quizSchema = new mongoose.Schema({
  title: String,
  teacherId: String,
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: String,
    },
  ],
});

const Quiz = mongoose.model("Quiz", quizSchema);

app.post("/teacher/quizzes", async (req, res) => {
  try {
    console.log(req.body);
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.status(201).json({ message: "Quiz created successfully" });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/student/quizzes", async (req, res) => {
  try {
    const quizzes = await Quiz.find({});
    res.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const PORT = 3333;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.delete("/teacher/quizzes/:id", async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
