"use strict"

const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const log = console.log;

let tasks = [
  { id: 1, title: "pray", done: true },
  { id: 2, title: "eat", done: false },
  { id: 3, title: "bath", done: false },
];
let idCount = 3;

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.json({ name: "Task API", version: "1.0", endpoints: ["/tasks"] });
});

app.get("/tasks", (req, res) => {
  res.status(200).json(tasks);
});

app.get("/tasks/:id", (req, res) => {
  const selectedTask = tasks.find((task) => task.id == req.params.id);

  if (! selectedTask) {
    res.status(404).json({ "error": `id ${req.params.id} not found` });
  } else {
    res.status(200).json(selectedTask);
  }
});

app.post("/tasks", (req, res) => {
  const newTask = req.body;

  if (Object.keys(newTask).length == 0) {
    res.status(400).json({ error: "Bad request body" });
    return;
  }
  if (typeof (newTask['title']) != 'string' || newTask['title'].trim().length == 0 ){
	res.status(400).json({"error": "Invalid Title"})
	return
  }
  let updatedTask = { id: idCount + 1, title: newTask["title"].trim(), done: false };

  tasks.push(updatedTask);
  idCount += 1;
  res.status(201).json(updatedTask);
});

// i decide to use PUT and auto set done to true if it exist in the request body
app.put("/tasks/:id", (req, res) => {
  let updatedTask = req.body;

  if (!tasks.find((task) => task.id == req.params.id)) {
    res.status(404).json({ error: "id not found" });
    return;
  } else if (Object.keys(updatedTask).length == 0) {
    res.status(400).json({ error: "invalid body" });
    return;
  }

  let titles = ["title"];

  tasks.find((task) => {
    if (task.id == req.params.id) {
		if (Object.hasOwn(updatedTask, "done")) {
			task["done"] = true
		} else {
			task["done"] = false
		}
      for (const item of titles) {
		if ( typeof (updatedTask[item]) != 'string' || updatedTask[item].trim().length == 0 ) {
			res.status(400).json({"error": "Title cannot be empty"})
			return
		}
        task[item] = updatedTask[item];
      }
      res.status(200).json(task);
    }
  });
});

app.delete("/tasks/:id", (req, res) => {
  if (!tasks.find((task) => req.params.id == task.id)) {
    res.status(404).json({ error: "Unknown id" });
    return;
  }
  tasks = tasks.filter((task) => task.id != req.params.id);
  res.status(204).end();
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
