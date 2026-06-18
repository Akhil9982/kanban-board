// Global Variables Declarations
let tasksData = {};
const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
const columns = [todo, progress, done];
let dragElement = null;

function addTask(title, desc, column) {
  const div = document.createElement("div");
  div.classList.add("task");
  div.setAttribute("draggable", "true");

  div.innerHTML = `
      <h2>${title}</h2>
      <p>${desc}</p>
      <button>Delete</button>
      `;
  column.appendChild(div);
  div.addEventListener("drag", () => {
    dragElement = div;
  });

  const deleteButton = div.querySelector("button");
  deleteButton.addEventListener("click", () => {
    div.remove();
    updateTaskCount();
  });

  return div;
}

function updateTaskCount() {
  columns.forEach((col) => {
    const tasks = col.querySelectorAll(".task");
    const count = col.querySelector(".right");

    tasksData[col.id] = Array.from(tasks).map((t) => {
      return {
        title: t.querySelector("h2").innerText,
        desc: t.querySelector("p").innerText,
      };
    });
    localStorage.setItem("tasks", JSON.stringify(tasksData));

    count.innerText = tasks.length;
  });
}

if (localStorage.getItem("tasks")) {
  const data = JSON.parse(localStorage.getItem("tasks"));

  for (const col in data) {
    const column = document.querySelector(`#${col}`);
    data[col].forEach((task) => {
      addTask(task.title, task.desc, column);
    });
  }
  updateTaskCount();
}

const tasks = document.querySelectorAll(".task");

tasks.forEach((task) => {
  task.addEventListener("drag", (evt) => {
    // console.log("dragging", evt);
    dragElement = task;
  });
});

function addDragEventsOnColumn(column) {
  column.addEventListener("dragenter", (evt) => {
    evt.preventDefault();
    column.classList.add("hover-over");
  });
  column.addEventListener("dragleave", (evt) => {
    evt.preventDefault();
    column.classList.remove("hover-over");
  });
  column.addEventListener("dragover", (evt) => {
    evt.preventDefault();
  });
  column.addEventListener("drop", (evt) => {
    evt.preventDefault();

    column.appendChild(dragElement);
    column.classList.remove("hover-over");

    updateTaskCount();
  });
}

addDragEventsOnColumn(todo);
addDragEventsOnColumn(progress);
addDragEventsOnColumn(done);

// Modal related
const toggleModalButton = document.querySelector("#toggle-modal");
const modal = document.querySelector(".modal");
const modalBg = document.querySelector(".bg");
const addTaskButton = document.querySelector(".modal #add-new-task");
toggleModalButton.addEventListener("click", () => {
  modal.classList.toggle("active");
});

modalBg.addEventListener("click", () => {
  modal.classList.remove("active");
});

addTaskButton.addEventListener("click", () => {
  const taskTitle = document.querySelector("#task-title-input").value.trim();
  const taskDesc = document.querySelector("#task-desc-input").value.trim();

  if (!taskTitle || !taskDesc) return;

  addTask(taskTitle, taskDesc, todo);
  updateTaskCount();
  modal.classList.remove("active");

  document.querySelector("#task-title-input").value = "";
  document.querySelector("#task-desc-input").value = "";
});
