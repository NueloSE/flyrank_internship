const express = require('express');
const app = express()
const port = 3000

const tasks = [
    {id: 1, title: 'pray', done: true},
    {id: 2, title: 'eat', done: false},
    {id: 3, title: 'bath', done: false}
]

app.get('/health', (req, res) => {
    res.json({ "status": "ok" })
})

app.get('/', (req, res) => {
    res.json({"name": "Task API", "version": "1.0", "endpoints": ["/tasks"] })
})

app.get('/tasks', (req, res) => {
    res.json(tasks)
})

app.get('/tasks/:id', (req, res) => {
    
        const selectedTask = tasks.filter((task) => task.id == req.params.id)

        if (selectedTask.length === 0) {
            res.status(404).json({ "error": "Task 99 not found"})
        } else {
            res.status(200).json(selectedTask)
        }
    
    
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})
