let allTodos = JSON.parse(localStorage.getItem("Todos")) || [];
const todoName = document.querySelector(".name");
const todoDate = document.querySelector(".date");
const addButton = document.querySelector(".add-todo");
const editButton = document.querySelector(".edit-todo");
const tBody = document.querySelector("tbody");
const deleteAll = document.querySelector("#delete-all");
const allButton = document.querySelector("#all");
const pendingButton = document.querySelector("#pending");
const completedButton = document.querySelector("#completed");

function addTodo() {
  const name = todoName.value;
  const date = todoDate.value;
  if (name) {
    todoName.value = "";
    todoDate.value = "";
    showAlert("Todo added successfully", "green");
    const todo = {
      id: idMaker(),
      name: name,
      date: date,
      completed: false,
    };
    allTodos.push(todo);
    localStorage.setItem("Todos", JSON.stringify(allTodos));
    addToTable();
  } else {
    showAlert("Please enter todo name!", "red");
  }
}

function showAlert(message, color) {
  const alert = document.querySelector("#alert");
  alert.style.backgroundColor = color;
  alert.innerText = message;
  alert.style.display = "block";
  setTimeout(() => {
    alert.style.display = "none";
  }, 2000);
}

function idMaker() {
  const id = Math.round(
    Math.random() * Math.random() * Math.random() * Math.pow(10, 10)
  );
  return id;
}

function addToTable(todosArray) {
  const todosList = todosArray || allTodos;
  tBody.innerHTML = "";
  if (!todosList.length) {
    tBody.innerHTML = "<tr><td colspan='4'> No Task Found !</td></tr>";
  } else {
    todosList.forEach((object) => {
      tBody.innerHTML += `
      <tr>
        <td> ${object.name} </td>
        <td> ${object.date || "No Date"} </td>
        <td> ${object.completed ? "Completed" : "Pending"} </td>
        <td>
          <button class = "edit" onclick="editTodo(${
            object.id
          })"> Edit </button>
          <button class = "do" onclick="doAndUndoHandler(${object.id}, ${
        object.completed
      })"> ${object.completed ? "Undo" : "Do"}</button>
          <button class = "delete" onclick="deleteTodo(${
            object.id
          })"> Delete </button>
        </td>
      </tr>`;
    });
  }
}

function deleteAllTodos() {
  if (!allTodos.length) {
    showAlert("مرض داری ؟", "orange");
  } else {
    allTodos = [];
    localStorage.clear();
    tBody.innerHTML = "<tr><td colspan='4'> No Task Found !</td></tr>";
    showAlert("All todos deleted successfully", "blue");
  }
}

function deleteTodo(id) {
  const newTodos = allTodos.filter((object) => {
    if (object.id != id) {
      return object;
    }
  });
  localStorage.setItem("Todos", JSON.stringify(allTodos));
  addToTable(newTodos);
  showAlert("Todo deleted successfully", "yellow");
}

function doAndUndoHandler(id, status) {
  if (!status) {
    allTodos.find((object) => {
      if (object.id == id) {
        object.completed = true;
      }
    });
  } else {
    allTodos.find((object) => {
      if (object.id == id) {
        object.completed = false;
      }
    });
  }
  localStorage.setItem("Todos", JSON.stringify(allTodos));
  addToTable();
  showAlert("Status changed successfully", "brown");
}

// Better Way (Down Below...)
// function doAndUndoHandler(id){
//   allTodos.find(object => object.id == id)
//   localStorage.setItem("Todos", JSON.stringify(allTodos));
//   addToTable();
//   showAlert("Status changed successfully", "brown");
//

function editTodo(id) {
  const todo = allTodos.find((object) => object.id == id);
  todoName.value = todo.name;
  todoDate.value = todo.date;
  editButton.style.display = "inline-block";
  addButton.style.display = "none";
  editButton.dataset.id = id;
}

function confirmEditHandler(event) {
  const id = event.target.dataset.id;
  const todo = allTodos.find((object) => object.id == id);
  if (todoName.value) {
    todo.name = todoName.value;
    todo.date = todoDate.value;
    todoName.value = "";
    todoDate.value = "";
    localStorage.setItem("Todos", JSON.stringify(allTodos));
    addToTable();
    showAlert("Todo edited successfully", "pink");
    editButton.style.display = "none";
    addButton.style.display = "inline-block";
  } else {
    showAlert("Please enter todo name!", "red");
    editButton.style.display = "none";
    addButton.style.display = "inline-block";
    return;
  }
}

function showAllTodos() {
  showAlert("Here there are all todos", "purple");
  addToTable();
}

function showPendingTodos() {
  const newTodos = allTodos.filter((object) => {
    if (!object.completed) {
      return object;
    }
  });
  showAlert("Here there are pending todos", "purple");
  addToTable(newTodos);
}

function showCompletedTodos() {
  const newTodos = allTodos.filter((object) => {
    if (object.completed) {
      return object;
    }
  });
  showAlert("Here there are completed todos", "purple");
  addToTable(newTodos);
}

addButton.addEventListener("click", addTodo);
window.addEventListener("load", () => addToTable()); // to show (No Task Found !) message .
deleteAll.addEventListener("click", deleteAllTodos);
editButton.addEventListener("click", confirmEditHandler);
allButton.addEventListener("click", showAllTodos);
pendingButton.addEventListener("click", showPendingTodos);
completedButton.addEventListener("click", showCompletedTodos);
