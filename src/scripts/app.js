import remove from "../images/icon-cross.svg";

const form = document.forms[0],
  root = document.firstElementChild,
  list = document.querySelector(".list div"),
  count = document.querySelector(".todo-count"),
  clear_btn = document.querySelector(".clear-btn"),
  all_btn = document.querySelector(".categs .all"),
  options = document.querySelectorAll(".categs span"),
  theme_toggle = document.querySelector(".theme-toggle"),
  active_btn = document.querySelector(".categs .active"),
  completed_btn = document.querySelector(".categs .completed");

let todoList = JSON.parse(localStorage.getItem("todoList")) ?? [];

let getTheme = () => localStorage.getItem("todoAppTheme") || "light";
const setTheme = (theme) => localStorage.setItem("todoAppTheme", theme);
root.classList.add(getTheme());

options.forEach((option) => {
  option.addEventListener("click", () => {
    for (const option of options) {
      option.classList.remove("selected");
    }
    option.classList.add("selected");
  });
});

function setCount() {
  count.textContent = `${
    todoList.filter((todo) => !todo.completed).length
  } items left`;
}

function createTodo(item) {
  const todo = document.createElement("div");
  todo.classList.add("todo");
  item.completed && todo.classList.add("completed");
  todo.innerHTML = `
        <div class="check-ball"></div>
            <p>${item.todo}</p>
        <div class="remove"><img src=${remove.src} alt=""></div>`;
  return todo;
}

function addTodo(e) {
  let text = e.target.querySelector("input").value;
  const id = () => Math.ceil(Math.random() * 99_999_999_999);
  const item = {
    todo: text,
    completed: false,
    id: id(),
  };
  if (text.trim()) {
    todoList.unshift(item);
    const todo = createTodo(item);
    list.appendChild(todo);
    localStorage.setItem("todoList", JSON.stringify(todoList));
    render(todoList);
    e.target.querySelector("input").value = "";
    count.textContent = `${
      todoList.filter((todo) => !todo.completed).length
    } items left`;
  }
}

function setDone(todo, item) {
  const done_btn = todo.querySelector(".check-ball");
  done_btn.addEventListener("click", () => {
    todo.classList.toggle("completed");
    const done = todoList.find((todo) => todo.id == item.id);
    done.completed ? (done.completed = false) : (done.completed = true);
    localStorage.setItem("todoList", JSON.stringify(todoList));
    setCount();
  });
}

function removeTodo(todo, done) {
  const removeBtn = todo.querySelector(".remove");
  removeBtn.addEventListener("click", () => {
    todo.remove();
    const filtered = todoList.filter((item) => item.id != done.id);
    todoList = filtered;
    localStorage.setItem("todoList", JSON.stringify(filtered));
    setCount();
  });
}

function render(items) {
  list.innerHTML = "";
  items.forEach((item) => {
    const todo = createTodo(item);
    list.appendChild(todo);
    removeTodo(todo, item);
    setDone(todo, item);
  });
  setCount();
}
render(todoList);

/******  filtering ******/
// completed
completed_btn.addEventListener("click", () => {
  const completed = todoList.filter((todo) => todo.completed);
  render(completed);
});
// all
all_btn.addEventListener("click", () => {
  render(todoList);
});
// active
active_btn.addEventListener("click", () => {
  const active = todoList.filter((todo) => !todo.completed);
  render(active);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  addTodo(e);
});

clear_btn.addEventListener("click", (e) => {
  const active = todoList.filter((todo) => !todo.completed);
  todoList = active;
  localStorage.setItem("todoList", JSON.stringify(active));
  render(todoList);
  for (const option of options) {
    option.classList.remove("selected");
  }
  options[0].classList.add("selected");
});

theme_toggle.addEventListener("click", () => {
  const theme = getTheme();
  theme == "light" ? setTheme("dark") : setTheme("light");
  root.classList.toggle("dark");

  const imgSrc = theme_toggle.querySelector("img").src;
  if (imgSrc.includes("sun")) {
    const replaced = imgSrc.replace("sun", "moon");
    theme_toggle.querySelector("img").src = replaced;
  } else {
    const replaced = imgSrc.replace("moon", "sun");
    theme_toggle.querySelector("img").src = replaced;
  }
});

if (ServiceWorker in navigator) {
    try {
    navigator.serviceWorker
      .register("./serviceWorker.js")
      .then(() => console.log("service worker registered"));
    } catch {}
  }

