//유저가 값을 입력한다
// + 버튼을 클릭하면 할 일이 추가된다
// delete 버튼을 누르면 할 일이 삭제된다
// check 버튼을 누르면 할 일이 끝나면서 밑줄이 간다
// 진행중 끝남 탭을 누르면 언더바가 이동한다
// 끝남 탭은 끝난 아이템만, 진행중 탭은 진행중인 아이템만 나온다
// 전체 탭을 누르면 모든 아이템이 나온다


let taskInput = document.getElementById("task-input");
let addButton = document.getElementById("add-button");
let taskList = [];
addButton.addEventListener("click", addTask);

function addTask() {
    let taskContent = taskInput.value;
    taskList.push(taskContent);
    console.log(taskList);
    render();
    taskInput.value = "";
}

function render() {
    let resultHTML = "";
    for (let i = 0; i < taskList.length; i++) {
        resultHTML += `<div class="task">
            <div>${taskList[i]}</div>
            <div>
                <button onclick="checkTask(${i})">check</button>
                <button onclick="deleteTask(${i})">delete</button>
            </div>
      </div>`;
    }
    document.getElementById("task-board").innerHTML = resultHTML;
}

// 엔터키로 추가 기능
taskInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});
