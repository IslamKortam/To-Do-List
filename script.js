class Task {
    constructor(description, done) {
        this.description = description;
        this.done = done;
    }
}




var dummyNotDoneItem = document.getElementById("tmplateNotDoneListItem");

var tasksGenerated = 0;
const tasksLocalStorageKey = "todolistProjectKey"

var tasks = new Object();


var addNewTaskButton = document.getElementById("addNewTaskButton");
var taskField = document.getElementById("newTaskNameField");
var notDoneList = document.getElementById("notDoneList");
var doneList = document.getElementById("doneList")

retrieveLocalStorageData();
diplayRetrivedItems();







function generateTaskId() {
    var id = "" + tasksGenerated;
    console.log("+new Id genreated: " + id);
    tasksGenerated++;
    return id;
}

function pushToLocalStorage(data) {
    data = JSON.stringify(data);
    localStorage.setItem(tasksLocalStorageKey, data);
    console.log("data Logged Successfuly");
}


function retrieveLocalStorageData() {
    if(localStorage.getItem(tasksLocalStorageKey)){     //If there is data on local storage
        var data = localStorage.getItem(tasksLocalStorageKey);
        tasks = JSON.parse(data);
        console.log("Length: " + Object.keys(tasks).length);
    }
}




function diplayRetrivedItems() {
    for (var id in tasks) {
        var description = tasks[id].description;
        var done = tasks[id].done;
        var newNode = dummyNotDoneItem.cloneNode(true);
        newNode.children[0].textContent = description;
        newNode.children[1].addEventListener('input', toggleDoneState)
        newNode.children[2].addEventListener('click', deleteAction);
        newNode.id = id;
        newNode.style.display = 'list-item';
        
        

        tasksGenerated = Math.max(tasksGenerated, parseInt(id) + 1);
        console.log(tasksGenerated);
        console.log(typeof tasksGenerated);
        
        if (done) {
            newNode.children[1].checked = true;
            doneList.appendChild(newNode);
        } 
        
        else {
            newNode.children[1].checked = false;
            notDoneList.appendChild(newNode);
        }
    }
    console.log("Done Retrieving Data");
   
    console.log(tasksGenerated);
    console.log(typeof tasksGenerated);
}





addNewTaskButton.addEventListener('click', () => {
    var taskDescription = taskField.value;

    if (taskDescription == "") {
        console.log("Cannot Add empty Tsak");
        taskField.focus();
        return;
    }

    var task = new Task(taskDescription, false);
    var id = generateTaskId();
    console.log("New Id = " + id);
    console.log(typeof id);
    tasks[id] = task;

    pushToLocalStorage(tasks);
    console.log(tasks);

    var dummyNode = dummyNotDoneItem;
    var newNode = dummyNode.cloneNode(true);
    newNode.children[0].textContent = taskDescription;
    newNode.children[1].addEventListener('input', toggleDoneState)
    newNode.children[2].addEventListener('click', deleteAction);
    newNode.id = id;
    newNode.style.display = 'list-item';

    taskField.value = "";
    taskField.focus();

    console.log(newNode);
    console.log(notDoneList);


    notDoneList.appendChild(newNode);
})



function toggleDoneState(e) {
    var targetCheckBox = e.target;
    var targetItem = targetCheckBox.parentNode;
    
    if (targetCheckBox.checked == true) {
        console.log("Changing into Done");
        var newNode = targetItem.cloneNode(true);
        targetItem.remove();
        newNode.addEventListener('input', toggleDoneState);
        newNode.children[2].addEventListener('click', deleteAction);
        doneList.appendChild(newNode);
        var id = newNode.id;
        tasks[id].done = true;
    } 
    
    else {
        console.log("Changing into not Done");
        var newNode = targetItem.cloneNode(true);
        targetItem.remove();
        newNode.addEventListener('input', toggleDoneState);
        newNode.children[2].addEventListener('click', deleteAction);
        notDoneList.appendChild(newNode);
        var id = newNode.id;
        tasks[id].done = false;
    }
    pushToLocalStorage(tasks);
}

function deleteAction(e) {
    var targetItem = e.target.parentNode;
    var targetItem_ID = targetItem.id;
    targetItem.remove();
    delete tasks[targetItem_ID]
    
    console.log(targetItem_ID);
    console.log(tasks);
    pushToLocalStorage(tasks);
}



