from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

tasks =[
    {"id": 1, "task": "Build frontend", "status": "In Progress"},
    {"id": 2, "task": "Build backend", "status": "Pending"},
]

@app.get("/tasks")
def get_tasks():
    return tasks

@app.post("/tasks")
def create_task(task:dict):
    new_id = max([t["id"] for t in tasks], default=0) +1
    task["id"] = new_id
    tasks.append(task)
    return task

@app.put("/tasks/{task_id}")
def update_task(task_id:int, updated_task:dict):
    for task in tasks:
        if task["id"] == task_id:
            task.update(updated_task)
            return task
        raise HTTPException(status_code=404, detail="Task not found")
    
@app.delete("/tasks/{task_id}")
def delete_task(task_id:int):
    global tasks
    tasks = [task for task in tasks if task["id"] != task_id]
    return {"message": "Task deleted"}