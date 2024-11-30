const todoForm = document.querySelector("#todoForm");
const todoInput = document.querySelector("#todoInput");
const todoList = document.querySelector("#todoList");

// Load tasks from localStorage when page loads
document.addEventListener('DOMContentLoaded', function() {
  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  savedTasks.forEach(taskObj => {
    addTask(taskObj.text, taskObj.completed);
  });
});

todoForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const newTask = todoInput.value;
  
  if (newTask === ''){
    alert('Please enter a valid task');
    return;
  }
  
  addTask(newTask, false);
  todoInput.value = '';
});

function addTask(task, completed = false) {
  const listItem = document.createElement('li');

  const taskItem = document.createElement('span');
  taskItem.textContent = task;
  if (completed) {
    taskItem.style.textDecoration = 'line-through';
  }
  listItem.appendChild(taskItem);

  const checkBox = document.createElement('input');
  checkBox.setAttribute('type', 'checkbox');
  checkBox.checked = completed;
  listItem.appendChild(checkBox);

  const deleteButton = document.createElement('button');    
  deleteButton.textContent = 'Delete';
  listItem.appendChild(deleteButton);

  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  listItem.appendChild(editButton);

  checkBox.addEventListener('change', function() {
    if (this.checked) {
      taskItem.style.textDecoration = 'line-through';
    } else {
      taskItem.style.textDecoration = 'none';
    }
    saveToLocalStorage();
  });

  deleteButton.addEventListener('click', function() {
    listItem.remove();
    saveToLocalStorage();
  });

  editButton.addEventListener('click', function() {
    const isEditing = listItem.classList.contains('editing');
    if (isEditing) {
      const input = listItem.querySelector('input[type="text"]');
      taskItem.textContent = input.value;
      listItem.removeChild(input);
      listItem.appendChild(taskItem);
      listItem.classList.remove('editing');
      editButton.textContent = 'Edit';
      saveToLocalStorage();
    } else {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = taskItem.textContent;
      listItem.insertBefore(input, taskItem);
      listItem.removeChild(taskItem);
      listItem.classList.add('editing');
      editButton.textContent = 'Save';
    }
  });
  
  todoList.appendChild(listItem);
  saveToLocalStorage();
}
// save data to local storage so when page is refreshed to to list items are still listed
function saveToLocalStorage() {
  const tasks = [];
  document.querySelectorAll('#todoList li').forEach(li => {
    const taskText = li.querySelector('span')?.textContent || li.querySelector('input[type="text"]')?.value;
    const completed = li.querySelector('input[type="checkbox"]').checked;
    if (taskText) {
      tasks.push({
        text: taskText,
        completed: completed
      });
    }
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}