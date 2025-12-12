import { useEffect, useState } from "react";

interface Task {
  id: number;
  name: string;
  completed: boolean;
  user: number;
  topics: string[];
}

export default function Tasks() {
  //const [tasks, setTasks] = useState<Task[]>([]);
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, name: "Buy milk", completed: false, user: 1, topics: ["shopping"] },
    { id: 2, name: "Finish project", completed: true, user: 1, topics: ["work"] },
    { id: 3, name: "Read for 20 minutes", completed: false, user: 1, topics: ["personal development"] },
  ]);
  //const [loading, setLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // async function loadTasks() {
    //   try {
    //     const response = await fetch("http://localhost:8000/api/planner/tasks/user/1/")
    //     const data = await response.json()
    //     setTasks(data)
    //   } catch (err) {
    //     console.error("Failed to load tasks:", err)
    //   } finally {
    //     setLoading(false)
    //   }
    // }
    // loadTasks()
  }, [])

  if (loading) {
    return <p>Loading tasks…</p>
  }

  function toggleTaskCompletion(taskId: number) {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  }

  return (
    <div>
      <h1>Tasks</h1>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task.id)}
            />
            {task.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

