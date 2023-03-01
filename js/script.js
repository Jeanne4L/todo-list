let taskForm = document.querySelector('form');
let taskInput = document.querySelector('#task-input');
let deleteAllBtn = document.querySelector('.delete-all');

// display existing lists
let todoList = [];
todoList = JSON.parse(localStorage.getItem('todoList'));
if(todoList !== null) {
    displayTodoList();
}

let doneList = [];
doneList = JSON.parse(localStorage.getItem('doneList'));
if(doneList !== null) {
    displayDoneList();
}

// add new task
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    createTaskId();

    let taskInputValue = taskInput.value;
    let listName = 'todoList';
    checkListLocalStorage(todoList, taskId, taskInputValue, listName);

    if(todoList !== null) {
        document.querySelector('.todo__list').innerHTML = '';
    } 
    todoList = JSON.parse(localStorage.getItem('todoList'));
    displayTodoList();

    taskForm.reset();
})

function displayList(list, listPlace) {
    for (let i=0; i<list.length; i++) {
        document.querySelector('.'+listPlace+'').innerHTML += `
        <div class="line" data-id="${list[i].id}" data-part="todo">
            <div class="container">
                <div class="checkbox">
                    <i class="fa-solid fa-check"></i>
                </div>
                <p class="label">${list[i].task}</p>
                <i class="fa-solid fa-xmark delete"></i>
            </div>
        </div>`
    }
    deleteTask();
    changeTaskStatus();
    deleteAllDoneTasks();
}

function displayTodoList() {
    let list = todoList;
    let listPlace = 'todo__list';

    displayList(list, listPlace);
}
function displayDoneList() {
    let list = doneList;
    let listPlace = 'done__list';

    displayList(list, listPlace);
}

function createTaskId() {
    taskId = 'tdl' + Date.now();
}

function checkListLocalStorage(list, id, task, listName) {
    if (list !== null) {
        saveListLocalStorage(list, id, task, listName);
    } else {
        list = [];
        saveListLocalStorage(list, id, task, listName);
    }
}

function saveListLocalStorage(list, id, task, listName) {
    list.push({
        id: id,
        task: task
    })
    localStorage.setItem(`${listName}`, JSON.stringify(list));
}

function deleteTask() {
    let deleteBtns = document.querySelectorAll('.delete');

    for( let i=0; i<deleteBtns.length; i++) {
        deleteBtns[i].addEventListener('click', () => {
            let datasetId = deleteBtns[i].closest('[data-id]').dataset.id;
    
            let listName = 'todoList';
            let listPlace = 'todo__list';
            removeItemLocalStorage(datasetId, todoList, listName, listPlace, displayTodoList);

            listName = 'doneList';
            listPlace = 'done__list';
            removeItemLocalStorage(datasetId, doneList, listName, listPlace, displayDoneList);
        })
    }
}

function deleteAllDoneTasks() {
    deleteAllBtn.addEventListener('click', () => {
        document.querySelector('.done__list').innerHTML = '';

        doneList.splice(0, doneList.length);
        localStorage.setItem('doneList', JSON.stringify(doneList));
    })
}

function removeItemLocalStorage(datasetId, list, listName, listPlace, displayFunction) {
    for (let i=0; i< list.length; i++) {
        if(list[i].id === datasetId) {
            let index = list.indexOf(list[i]);
            list.splice(index, 1);
            localStorage.setItem(`${listName}`, JSON.stringify(list));
        
            document.querySelector(`.${listPlace}`).innerHTML = '';
            displayFunction();
        }
    }
}

function changeTaskStatus() {
    let checkbox = document.querySelectorAll('.checkbox');

    for( let i=0; i<checkbox.length; i++) {
        checkbox[i].onclick = function() {
            let datasetId = checkbox[i].closest('[data-id]').dataset.id;
            let index = todoList.findIndex((task) => task.id === datasetId)

            if(index !== -1) {
                moveTaskFromTodo(datasetId, index)
            } else {
                index = doneList.findIndex((task) => task.id === datasetId)
                moveTaskFromDone(datasetId, index)
            }
            changeTaskStatus()
        }
    }
};
changeTaskStatus()
function moveTaskFromTodo(datasetId, index) {
    // add to done list
    let id = todoList[index].id;
    let task = todoList[index].task;
    let listName = 'doneList';

    checkListLocalStorage(doneList, id, task, listName);
    if(doneList !== null) {
        document.querySelector('.done__list').innerHTML = '';
    } 
    doneList = JSON.parse(localStorage.getItem('doneList'));
    displayDoneList();
    
    // delete from to do list
    listName = 'todoList';
    let listPlace = 'todo__list';
    removeItemLocalStorage(datasetId, todoList, listName, listPlace, displayTodoList);
}
function moveTaskFromDone(datasetId, index) {
    // add to todo list
    let id = doneList[index].id;
    let task = doneList[index].task;
    let listName = 'todoList';

    checkListLocalStorage(todoList, id, task, listName);
    if(todoList !== null) {
        document.querySelector('.todo__list').innerHTML = '';
    } 
    todoList = JSON.parse(localStorage.getItem('todoList'));
    displayTodoList();
    
    // delete from done list
    listName = 'doneList';
    let listPlace = 'done__list';
    removeItemLocalStorage(datasetId, doneList, listName, listPlace, displayDoneList);
}