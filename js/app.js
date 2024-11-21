const loadTasks = () => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => {
    addTaskToDOM(task.text, task.completed);
  });
};

const saveTasks = () => {
  const tasks = Array.from(document.querySelectorAll(".task-text")).map(
    (taskSpan) => ({
      text: taskSpan.textContent,
      completed: taskSpan.classList.contains("completed"),
    })
  );
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const addTaskToDOM = (taskText, completed = false) => {
  const li = document.createElement("li");

  const taskSpan = document.createElement("span");
  taskSpan.classList.add("task-text");
  taskSpan.textContent = taskText;

  if (completed) {
    taskSpan.classList.add("completed");
  }

  taskSpan.addEventListener("click", () => {
    taskSpan.classList.toggle("completed");
    saveTasks();
  });

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Eliminar";
  deleteButton.addEventListener("click", () => {
    li.remove();
    saveTasks();
  });

  li.appendChild(taskSpan);
  li.appendChild(deleteButton);
  document.getElementById("taskList").appendChild(li);
};

document.addEventListener("DOMContentLoaded", () => {
  loadTasks();

  document.getElementById("addTaskButton").addEventListener("click", () => {
    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();

    if (taskText) {
      addTaskToDOM(taskText);
      saveTasks();
      taskInput.value = "";
    } else {
      alert("Por favor, ingresa una tarea");
    }
  });

  const shareButton = document.getElementById("shareButton");
  shareButton.addEventListener("click", () => {
    const tasks = Array.from(document.querySelectorAll(".task-text"))
      .map((task) => task.textContent)
      .join("\n");

    if (navigator.share) {
      navigator
        .share({
          title: "Mis tareas",
          text: tasks,
          url: window.location.href,
        })
        .then(() => console.log("Contenido compartido exitosamente"))
        .catch((error) => console.log("Error al compartir:", error));
    } else {
      alert(
        "La funcionalidad de compartir no está disponible en este dispositivo."
      );
    }
  });
});
