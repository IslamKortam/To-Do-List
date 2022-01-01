class Task {
    constructor(description, done) {
        this.description = description;
        this.done = done;
    }
}

/** **************************************  Gloabal Variables ************************************** **/

var dummyNotDoneItem = document.getElementById("tmplateNotDoneListItem");
var addNewTaskButton = document.getElementById("addNewTaskButton");
var taskField = document.getElementById("newTaskNameField");
var searchField = document.getElementById("searchField");
var notDoneList = document.getElementById("notDoneList");
var doneList = document.getElementById("doneList")


var tasksGenerated = 0;
const tasksLocalStorageKey = "todolistProjectKey"
var tasks = new Object();










/** **************************************  Script ************************************** **/

/** **********  Retrieving Old Tasks from the Local Storage ********** **/
retrieveLocalStorageData();
diplayRetrivedItems();


/** **********  Action Listeners for inputting new Tasks ********** **/
addNewTaskButton.addEventListener('click', addNewTaskFromInputField)

taskField.addEventListener('keyup', (e) => {
    if(e.key == 'Enter' || e.keyCode == 13){
        addNewTaskFromInputField();
    }
})


/** **********  Search Function ********** **/

searchField.addEventListener('keyup', () =>{
    var searchKey = searchField.value;
    for (var id in tasks){
        var element = document.getElementById(id);
        if(tasks[id].description.indexOf(searchKey) == -1){ //Deos not contain the search key
            element.style.display = 'none';    
        }
        else{
            element.style.display = 'inline-block';   
        }
    }
})








/** **************************************  Functions ************************************** **/


function pushToLocalStorage(data) {
    data = JSON.stringify(data);
    localStorage.setItem(tasksLocalStorageKey, data);
    console.log("data Logged Successfuly");
}


function retrieveLocalStorageData() {
    if(localStorage.getItem(tasksLocalStorageKey)){     //If there is data on local storage
        var data = localStorage.getItem(tasksLocalStorageKey);
        tasks = JSON.parse(data);
    }
}


function generateTaskId() {
    var id = "" + tasksGenerated;
    console.log("+new Id genreated: " + id);
    tasksGenerated++;
    return id;
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
        newNode.style.display = 'inline-block';
        
        

        tasksGenerated = Math.max(tasksGenerated, parseInt(id) + 1);

        
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
}



function addNewTaskFromInputField(){
    var taskDescription = taskField.value;

    if (taskDescription == "") {
        console.log("Cannot Add empty Tsak");
        taskField.focus();
        return;
    }

    var task = new Task(taskDescription, false);
    var id = generateTaskId();

    tasks[id] = task;

    pushToLocalStorage(tasks);

    var dummyNode = dummyNotDoneItem;
    var newNode = dummyNode.cloneNode(true);
    newNode.children[0].textContent = taskDescription;
    newNode.children[1].addEventListener('input', toggleDoneState)
    newNode.children[2].addEventListener('click', deleteAction);
    newNode.id = id;
    newNode.style.display = 'inline-block';

    taskField.value = "";
    taskField.focus();

    notDoneList.appendChild(newNode);
}



function toggleDoneState(e) {
    var targetCheckBox = e.target;
    var targetItem = targetCheckBox.parentNode;
    
    if (targetCheckBox.checked == true) {
        console.log("Changing into Done");
        var newNode = targetItem.cloneNode(true);
        targetItem.remove();
        newNode.children[1].addEventListener('input', toggleDoneState);
        newNode.children[2].addEventListener('click', deleteAction);
        
        doneList.appendChild(newNode);
        var id = newNode.id;
        tasks[id].done = true;
    } 
    
    else {
        console.log("Changing into not Done");
        var newNode = targetItem.cloneNode(true);
        targetItem.remove();
        newNode.children[1].addEventListener('input', toggleDoneState);
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
    
    pushToLocalStorage(tasks);
}