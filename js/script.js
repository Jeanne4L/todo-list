let addTaskForm = document.querySelector('form');
let taskInput = document.querySelector('#task-input');

taskInput.addEventListener('change', (e) => {
    let taskInputValue = e.target.value;

    if( taskInputValue !== null ) {
        addTaskForm.addEventListener('submit', (e) => {
            e.preventDefault();

            createTaskId(taskInputValue);

            document.querySelector('.todo').innerHTML += `
            <div class="line" dataset="${taskId}">
                <div class="container">
                    <div class="checkbox" id="${taskId}"></div>
                    <p class="label">${taskInputValue}</p>
                    <i class="fa-solid fa-xmark"></i>
                </div>
            </div>`
        })
    }
})

function createTaskId(taskInputValue) {
    taskId = 'tdl' + Date.now();
}