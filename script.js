const todoList = document.getElementById('todo_list');

var data = [];
const limitToView = 5;
var leftTodo = 0;
var sortType='all'
var sortData =[]
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
    var dataId = this.parentNode.dataset.id;
    var item = todoList.querySelector("[data-id="+"'"+dataId+"']")

    data.forEach((arr,i) => {
        if (arr.id == dataId) {
            data[i].completed = !data[i].completed;
        }
    });

    toggleTodoStatus(dataId, this.checked)
}

function sendTodo() {
    console.log('1')
    const formAdd = document.querySelector('#todo-form');
    const input = formAdd.querySelector('input[name="todo__text"]');
    const checkbox = formAdd.querySelector('input[name="todo__statuc"]');
    if (validateInput(input)) {
        console.log(input.value)
        console.log(checkbox.checked)
        addTodoItem({
            title: input.value,
            completed: checkbox.checked   
        })
        input.value = ''
    } else return
}

function validateInput(input) {
    console.log(input)
    if (input.value == '' || input.value == ' ') {
        alert('input empty')
    } else {
        return true
    }
}

/***** SORT *****/

function sortTodos() {
    console.log(this.dataset.sort)
    sortType = this.dataset.sort;
    printTodosFooter()

    switch(this.dataset.sort) {
        case 'all': {
            sortData = data;
            createTodoList(sortData)
        }break;
        case 'active':{
            sortData = []
            data.forEach((arr) => {
                if (arr.completed == false) {
                    sortData.push(arr)
                }
            })
            console.log(sortData)
            createTodoList(sortData)
        }break;
        case 'complited':{
            sortData = []
            data.forEach((arr) => {
                if (arr.completed == true) {
                    sortData.push(arr)
                }
            })
            console.log(sortData)
            createTodoList(sortData)
        }break;
    }
}
/***** DOM events *****/

function createTodoList(data) {
    console.log(data)
    todoList.innerHTML=''
    for (var i = 0; i<data.length; i++) {
        createTodoItem(data[i]);
    }

    printTodosFooter()
}

function createTodoItem(data) {
    console.log('createTodoItem')
    console.log(data)
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

function printTodosFooter() {
    var footer = document.querySelector('.todo-items_footer');
    footer.innerHTML='';

    var leftItems = document.createElement('div');
    leftItems.className = '_left-items';
    leftItems.innerHTML = `<span> <span> items left`
    console.log('leftItems')

    footer.prepend(leftItems)

    var sortItems = document.createElement('div');
    sortItems.classList='_sort-items';

        var allSort = document.createElement('span');
        allSort.dataset.sort='all'
        allSort.innerHTML='<span>All</span>'

        var activeSort = document.createElement('span');
        activeSort.dataset.sort='active'
        activeSort.innerHTML='<span>Active</span>'

        var complitedSort = document.createElement('span');
        complitedSort.dataset.sort='complited'
        complitedSort.innerHTML='<span>Complited</span>'



        sortItems.prepend(complitedSort)
        sortItems.prepend(activeSort)
        sortItems.prepend(allSort)

    footer.append(sortItems)

    switch(sortType) {
        case 'all': {
            allSort.classList.add('active');
            allSort.removeEventListener('click',sortTodos)

            activeSort.classList.remove('active')
            activeSort.addEventListener('click', sortTodos)

            complitedSort.classList.remove('active')
            complitedSort.addEventListener('click', sortTodos)

            console.log('swithCase All')
        } break;
        case 'active': {
            activeSort.classList.add('active');
            activeSort.removeEventListener('click', sortTodos)

            allSort.classList.remove('active')
            allSort.addEventListener('click', sortTodos)

            complitedSort.classList.remove('active')
            complitedSort.addEventListener('click', sortTodos)

            console.log('swithCase active')
        } break;
        case 'complited': {
            complitedSort.classList.add('active');
            complitedSort.removeEventListener('click', sortTodos)

            allSort.classList.remove('active')
            allSort.addEventListener('click', sortTodos)

            activeSort.classList.remove('active')
            activeSort.addEventListener('click', sortTodos)

            console.log('swithCase complited')
        } break;
    }


    var clearItems = document.createElement('div');
    clearItems.className = '_clear-todos';
    clearItems.innerHTML = 'Clear Completed';
    clearItems.setAttribute('onclick', 'testFunc()');
    footer.append(clearItems)
}

/***** Events *****/
document.addEventListener('DOMContentLoaded', initApp);

document.addEventListener('DOMContentLoaded', ()=> {
    const sendTodoBtn = document.querySelector('._send-todo');
    const sendTodoForm = document.querySelector('#todo-form');
    sendTodoBtn.addEventListener('click', sendTodo);
    sendTodoForm.addEventListener('submit', (e)=>{
        e.preventDefault()
        sendTodo()
    })
})

function initApp() {
    Promise.all([getAllTodos()])
        .then (values => {[data] = values;
            createTodoList(data)
        })
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

async function toggleTodoStatus(dataId, completed) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${dataId}`, {
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

async function addTodoItem(todo) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos`, {
            method: 'POST',
            body: JSON.stringify(todo),
            headers: {'Content-Type': 'application/json'}
        })

        const newTodo = await response.json();

        data.push(newTodo)
        createTodoItem(newTodo)
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