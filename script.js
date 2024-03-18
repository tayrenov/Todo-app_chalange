const todoList = document.getElementById('todo_list');

var data = [];

/***** Helpers *****/

function removeTodo() {
    var dataId = this.parentNode.dataset.id;
    var item = todoList.querySelector("[data-id="+"'"+dataId+"']")

    data = data.filter(data => data.id !== dataId);

    item.querySelector('input').removeEventListener('change', changeComplited)
    item.querySelector('div').removeEventListener('click', removeTodo)

    deleteTodoItem(dataId)
    item.remove()
}

function changeComplited() {
    console.log('1')
}

/***** DOM events *****/

function createTodoList() {
    console.log(data)
    for (var i = 0; i<data.length; i++) {
        createTodoItem(data[i]);
    }

}

function createTodoItem(data) {
    const div = document.createElement('div');
    div.dataset.id = data.id;
    div.innerHTML = `
        <span>${data.title}</span>
    ` 

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = data.completed;
    input.addEventListener('change', changeComplited);

    const closeIcon = document.createElement('div');
    closeIcon.className = 'todo-item__close';
    closeIcon.addEventListener('click', removeTodo)

    todoList.prepend(div)
    div.prepend(input)
    div.append(closeIcon)
}


/***** Events *****/
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    Promise.all([getAllTodos()])
        .then (values => {[data] = values;
            createTodoList()
        })
}


function deleteRemoveTodoEvent(div) {
    div.removeEventListener('click',removeTodo);
}

function createToggleStatus(div) {
    div.querySelector('input').addEventListener('change',()=>toggleTodoStatus());
}

document.addEventListener('DOMContentLoaded', getAllTodos)

/***** Async *****/

async function getAllTodos() {
    try {
        const responce = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=10')
        const data = await responce.json()
       
        return data
    } catch(error) {
        console.log('Error:_' + error)
    }
}

async function toggleTodoStatus(dataId, status) {
    try {
        const response = await fetch(`'https://jsonplaceholder.typicode.com/todos?_limit=10/${dataId}'`, {
            method: 'PATCH' ,
            body: JSON.stringify({completed:completed}),
            headers: {'Content-Type': 'application/json'}
        })

        if (!response.ok) {
            throw new Error('Failed to connect with the server! Please try later');
        }
    } catch(error) {
        console.log('PATH_Error:_' + error)
    }
}

async function deleteTodoItem(dataId) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${dataId}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        })
        console.log('DELETE complited')
        if (!response.ok) {
            throw new Error('Failed to connect with the server! Please try later');
        }
    } catch(error) {
        console.log('DELETE_Error:_' + error)
    }
        
}
/***** Helpers *****/

function checkStatus(status) {
    if (status) {
        console.log(status)
        return 'checked'
    } else {
        console.log(status)
        return ''
    }
}