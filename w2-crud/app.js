const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());
const log = console.log

let tasks = [
  { id: 1, title: "pray", done: true },
  { id: 2, title: "eat", done: false },
  { id: 3, title: "bath", done: false },
];

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.json({ name: "Task API", version: "1.0", endpoints: ["/tasks"] });
});

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.get("/tasks/:id", (req, res) => {
  const selectedTask = tasks.filter((task) => task.id == req.params.id);

  if (selectedTask.length === 0) {
    res.status(404).json({ error: "Task 99 not found" });
  } else {
    res.status(200).json(selectedTask);
  }
});

app.post("/tasks", (req, res) => {
  const newTask = req.body;

  if (Object.keys(newTask).length == 0) {
    res.status(404).json({ error: "Bad request body" });
    return;
  } else if (newTask["title"].length == 0) {
    res.status(400).json({ error: "Title cannot be empty" });
    return;
  }

  tasks.push({ id: tasks.length + 1, title: newTask["title"], done: false });
  res.status(201).json({ "created task ": tasks.length - 1 });
});

app.put("/tasks/:id", (req, res) => {
  let updatedTask = req.body;

  if (!tasks.find((task) => task.id == req.params.id)) {
    res.status(404).json({ error: "id not found" });
    return;
  } else if (Object.keys(updatedTask).length == 0) {
    res.status(400).json({ error: "invalid body" });
    return;
  }

  let titles = Object.keys(updatedTask);
  tasks.map((task) => {
    if (task.id == req.params.id) {
      titles.map((title) => {
        tasks[title] = updatedTask[title];
      });
    }
  });
  log(titles)
  
  res.status(201).json({"titles" : `${titles}`})
});

app.delete("/tasks/:id", (req, res) => {
  if (!tasks.find((task) => req.params.id == task.id)) {
    res.status(404).json({ error: "Unknown id" });
    return;
  }
  tasks = tasks.filter((task) => task.id != req.params.id);
  res.status(204).json({});
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
