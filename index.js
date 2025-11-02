const InputBox = document.getElementById("InputBox");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");

InputBox.addEventListener("keypress",(e)=>{
    if(e.key == "Enter"){
        e.preventDefault();
        addTask();
        saveTaskToLocalStorage();
    }
});

addTaskButton.addEventListener("click",()=>{
    addTask();
    saveTaskToLocalStorage();
})

const saveTaskToLocalStorage = () =>{
    const tasks = Array.from(taskList.querySelectorAll("li")).map(listItem => ({
        text: listItem.querySelector('span').textContent,
        completed: listItem.querySelector(".checkbox").checked
    }));
    localStorage.setItem('tasks' ,JSON.stringify(tasks));
};

const loadTaskFromLocalStorage = () => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    taskList.innerHTML = "";
    savedTasks.forEach(({text, completed}) => addTask(text, completed, false));
};

function addTask(Text, completed = false,save = true){
    if (!Text) Text = InputBox.value.trim();
    if(Text === ""){
        return;
    }
    else{
        const listItem = document.createElement("li");
        listItem.innerHTML = `
        <div class="taskBox">

        <div class="checkboxAndSpan">
        <input type="checkbox" class = "checkbox">
        <span class = "displaylistItem">${Text}</span>
        </div>
        <div class = "editAndDeleteBtns">
            <button class = "editButton">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round-pen-icon lucide-user-round-pen"><path d="M2 21a8 8 0 0 1 10.821-7.487"/><path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/><circle cx="10" cy="8" r="5"/></svg>
            </button>

            <button class = "deleteButton">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
        </div>

        </div>
        <hr>
        `;
        taskList.appendChild(listItem);
        InputBox.value = "";
        saveTaskToLocalStorage();
        const editButton = listItem.querySelector(".editButton");
        const checkbox =  listItem.querySelector(".checkbox");

        if (completed) {
            checkbox.checked = true;
            editButton.classList.add("editButtonDisabled");
        }

        checkbox.addEventListener("click",()=>{
            if(!checkbox.checked){
                editButton.classList.remove("editButtonDisabled");
                listItem.querySelector(".displaylistItem").style.textDecoration = "none";
                listItem.querySelector(".displaylistItem").style.color = "#000000ff";
                saveTaskToLocalStorage();
				// Re-apply current filter when status changes
				const activeFilterBtn = document.querySelector(".filterBox span.active");
				if (activeFilterBtn) {
					const key = (activeFilterBtn.dataset && activeFilterBtn.dataset.filter) || activeFilterBtn.id || activeFilterBtn.textContent.trim().toLowerCase();
					filterTasks(key);
				}
            }
            else {
                editButton.classList.add("editButtonDisabled");
                listItem.querySelector(".displaylistItem").style.textDecoration = "line-through";
                listItem.querySelector(".displaylistItem").style.color = "#ff0000ff";

				saveTaskToLocalStorage();
				// Re-apply current filter when status changes
				const activeFilterBtn = document.querySelector(".filterBox span.active");
				if (activeFilterBtn) {
					const key = (activeFilterBtn.dataset && activeFilterBtn.dataset.filter) || activeFilterBtn.id || activeFilterBtn.textContent.trim().toLowerCase();
					filterTasks(key);
				}
            }
        });


        editButton.addEventListener("click",()=>{
            if(!checkbox.checked){
                listItem.remove();
                InputBox.value = Text;
                InputBox.focus();
                saveTaskToLocalStorage();
            }
        });


        const deletedButton = listItem.querySelector(".deleteButton");
        deletedButton.addEventListener("click",()=>{
            listItem.remove();
            saveTaskToLocalStorage();
        });

        const clearAll = document.getElementById("clearAll");
        const deleteButtonAll = listItem.querySelectorAll(".deleteButton");
        clearAll.addEventListener("click",()=>{
            taskList.innerHTML = "";
            saveTaskToLocalStorage();
        });
       
    };

	const filterBox = document.querySelectorAll(".filterBox span");
	filterBox.forEach(Btn => {
		Btn.addEventListener("click",()=>{
			document.querySelector("span.active").classList.remove("active");
			Btn.classList.add("active");
			const key = (Btn.dataset && Btn.dataset.filter) || Btn.id || Btn.textContent.trim().toLowerCase();
			filterTasks(key);
		});
	});

 if (save) {
    saveTaskToLocalStorage();
  }
};

window.addEventListener('DOMContentLoaded', () => {
    loadTaskFromLocalStorage();
});


// Filtering helper: 'all' | 'pending' | 'completed'
function filterTasks(filterKey){
	const items = taskList.querySelectorAll("li");
	items.forEach(li => {
		const isChecked = li.querySelector(".checkbox").checked;
		if (filterKey === "all" || !filterKey) {
			li.style.display = "";
		} else if (filterKey === "pending") {
			li.style.display = isChecked ? "none" : "";
		} else if (filterKey === "completed") {
			li.style.display = isChecked ? "" : "none";
		} else {
			// Fallback to show all if unknown key
			li.style.display = "";
		}
	});
}


