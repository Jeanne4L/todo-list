let taskForm = document.querySelector('form');
let taskInput = document.querySelector('#task-input');
let deleteAllBtn = document.querySelector('.delete-all');

// display existing lists
let todoList = [];
let doneList = [];

todoList = JSON.parse(localStorage.getItem('todoList'));
doneList = JSON.parse(localStorage.getItem('doneList'));

if ((doneList.length === 0 && todoList.length === 0) || todoList === null) {
	document.querySelector('.done').style.display = 'none';
} else {
	displayTodoList();
	displayDoneList();
}

// Create a new task
taskForm.addEventListener('submit', (e) => {
	e.preventDefault();

	createTaskId();

	let taskInputValue = taskInput.value;
	let listName = 'todoList';
	checkListLocalStorage(todoList, taskId, taskInputValue, listName);

	if (todoList !== null) {
		document.querySelector('.todo__list').innerHTML = '';
	}
	todoList = JSON.parse(localStorage.getItem('todoList'));
	displayTodoList();
	if (doneList !== null) {
		document.querySelector('.done__list').innerHTML = '';
	}
	document.querySelector('.done').style.display = 'block';
	displayDoneList();

	taskForm.reset();
});

// model to display the lists
function displayList(list, listPlace) {
	for (let i = 0; i < list.length; i++) {
		document.querySelector(`.${listPlace}`).innerHTML += `
        <div class="line" data-id="${list[i].id}">
            <div class="container">
                <div class="checkbox">
                    <i class="fa-solid fa-check"></i>
                </div>
                <p class="label">${list[i].task}</p>
                <i class="fa-solid fa-xmark delete"></i>
            </div>
        </div>`;
	}
	changeTaskStatus();
	deleteTask();
	deleteAllDoneTasks();
}

// Display todo and done List
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

// Create a task id
function createTaskId() {
	taskId = 'tdl' + Date.now();
}

// Check if lists exist in localStorage and it
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
		task: task,
	});
	localStorage.setItem(`${listName}`, JSON.stringify(list));
}

// Modify status of task (todo -> done)
function changeTaskStatus() {
	let checkbox = document.querySelectorAll('.checkbox');

	for (let i = 0; i < checkbox.length; i++) {
		checkbox[i].onclick = function () {
			let datasetId = checkbox[i].closest('[data-id]').dataset.id;
			let index = todoList.findIndex((task) => task.id === datasetId);

			if (index !== -1) {
				moveTaskFromTodo(datasetId, index);
			} else {
				index = doneList.findIndex((task) => task.id === datasetId);
				moveTaskFromDone(datasetId, index);
			}
			changeTaskStatus();
		};
	}
}
changeTaskStatus();

// Move task to other status
function moveTaskFromTodo(datasetId, index) {
	// add to done list
	let id = todoList[index].id;
	let task = todoList[index].task;
	let listName = 'doneList';

	checkListLocalStorage(doneList, id, task, listName);
	if (doneList !== null) {
		document.querySelector('.done__list').innerHTML = '';
	}
	doneList = JSON.parse(localStorage.getItem('doneList'));
	displayDoneList();

	// delete from to do list
	listName = 'todoList';
	let listPlace = 'todo__list';
	removeItemLocalStorage(
		datasetId,
		todoList,
		listName,
		listPlace,
		displayTodoList
	);
}
function moveTaskFromDone(datasetId, index) {
	// add to todo list
	let id = doneList[index].id;
	let task = doneList[index].task;
	let listName = 'todoList';

	checkListLocalStorage(todoList, id, task, listName);
	if (todoList !== null) {
		document.querySelector('.todo__list').innerHTML = '';
	}
	todoList = JSON.parse(localStorage.getItem('todoList'));
	displayTodoList();

	// delete from done list
	listName = 'doneList';
	let listPlace = 'done__list';
	removeItemLocalStorage(
		datasetId,
		doneList,
		listName,
		listPlace,
		displayDoneList
	);
}

// Remove task from localStorage and website
function deleteTask() {
	let deleteBtns = document.querySelectorAll('.delete');

	for (let i = 0; i < deleteBtns.length; i++) {
		deleteBtns[i].addEventListener('click', () => {
			let datasetId = deleteBtns[i].closest('[data-id]').dataset.id;

			let listName = 'todoList';
			let listPlace = 'todo__list';
			removeItemLocalStorage(
				datasetId,
				todoList,
				listName,
				listPlace,
				displayTodoList
			);

			listName = 'doneList';
			listPlace = 'done__list';
			removeItemLocalStorage(
				datasetId,
				doneList,
				listName,
				listPlace,
				displayDoneList
			);
		});
	}

	if (todoList.length === 0 && doneList.length === 0) {
		document.querySelector('.done').style.display = 'none';
	}
}
function removeItemLocalStorage(
	datasetId,
	list,
	listName,
	listPlace,
	displayFunction
) {
	for (let i = 0; i < list.length; i++) {
		if (list[i].id === datasetId) {
			let index = list.indexOf(list[i]);
			list.splice(index, 1);
			localStorage.setItem(`${listName}`, JSON.stringify(list));

			document.querySelector(`.${listPlace}`).innerHTML = '';
			displayFunction();
		}
	}
}
function deleteAllDoneTasks() {
	deleteAllBtn.addEventListener('click', () => {
		document.querySelector('.done__list').innerHTML = '';

		doneList.splice(0, doneList.length);
		localStorage.setItem('doneList', JSON.stringify(doneList));
	});
}
