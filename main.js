//유저가 값을 입력한다
// + 버튼을 클릭하면 할 일이 추가된다
// delete 버튼을 누르면 할 일이 삭제된다
// check 버튼을 누르면 할 일이 끝나면서 밑줄이 간다
//1. check 버튼을 클릭하는 순간 true false
//2. true이면 끝난걸로 간주하고 밑줄 보여주기
//3. false이면 진행중인걸로 간주하고 밑줄 제거하기

// 진행중 끝남 탭을 누르면 언더바가 이동한다
// 끝남 탭은 끝난 아이템만, 진행중 탭은 진행중인 아이템만 나온다
// 전체 탭을 누르면 모든 아이템이 나온다

let bgMusic = document.getElementById("bg-music");
let playOverlay = document.getElementById("play-overlay");
let taskInput = document.getElementById("task-input");
let addButton = document.getElementById("add-button");
let tabs = document.querySelectorAll(".task-tab div");
let taskList = [];
let mode = "all";
let filterList = [];  

// 투명 오버레이 클릭 시 음악 재생
if (playOverlay) {
    playOverlay.addEventListener("click", function() {
        playOverlay.style.display = "none"; // 오버레이 즉시 제거
        bgMusic.play()
            .then(() => {
                console.log("음악 재생 시작!");
            })
            .catch(error => {
                console.log("음악 재생 실패:", error);
            });
    });
}

// 스페이스바로 음악 재생/정지
document.addEventListener("keydown", function(event) {
    // 입력창에 포커스가 있으면 스페이스바 정상 입력
    if (document.activeElement === taskInput) {
        return;
    }
    
    if (event.code === "Space") {
        event.preventDefault(); // 페이지 스크롤 방지
        if (bgMusic.paused) {
            bgMusic.play();
            console.log("음악 재생");
        } else {
            bgMusic.pause();
            console.log("음악 정지");
        }
    }
});

addButton.addEventListener("click", addTask);
console.log(tabs);
for (let i = 1; i < tabs.length; i++) {
    tabs[i].addEventListener("click", function(event) {
        filter(event);
        moveUnderline(event.target);
    });
}

// 밑줄을 클릭한 탭으로 이동
function moveUnderline(clickedTab) {
    const underLine = document.getElementById("under-line");
    const tabRect = clickedTab.getBoundingClientRect();
    const tabContainer = clickedTab.parentElement.getBoundingClientRect();
    const leftPosition = tabRect.left - tabContainer.left;
    
    underLine.style.left = leftPosition + "px";
    underLine.style.width = tabRect.width + "px";
}

// 페이지 로드 시 "모두" 탭에 under-line 초기화
window.addEventListener("load", function() {
    const allTab = document.getElementById("all");
    if (allTab) {
        moveUnderline(allTab);
    }
});

function updateAddButtonState() {
    addButton.disabled = taskInput.value.trim() === "";
}
taskInput.addEventListener("input", updateAddButtonState);
updateAddButtonState(); // 초기 상태 반영


function addTask() {

    const value = taskInput.value.trim();

    // 빈 입력 방지
    if (value === "") {
        alert("할 일을 입력해주세요.");
        return;
    }

    const task = {
        id: randomIDGenerate(),
        taskContent: taskInput.value,
        isComplete: false
    };

    taskList.push(task);
    console.log(taskList);
    render();

    taskInput.value = "";
    updateAddButtonState(); // 추가 후 버튼 상태 업데이트
    taskInput.focus(); // 바로 다음 입력 가능
}

function render() {
    // 1. 내가 선택한 탭에 따라서 
    let list =[];
    if(mode === "all") {
        list = taskList;
    } else if(mode === "ongoing") {
        list = taskList.filter(task => task.isComplete === false);
    } else if(mode === "done") {
        list = taskList.filter(task => task.isComplete === true);
    }
    // 2. 리스트를 달리 보여준다
    let resultHTML = "";
    for (let i = 0; i < list.length; i++) {
        if(list[i].isComplete==true) {
            resultHTML += `<div class="task">
            <div class="task-done">${list[i].taskContent}</div>
            <div>
                <button class="check-btn is-complete" onclick="toggleComplete('${list[i].id}')"><img src="image/double-check.png" alt="check"></button>
                <button class="delete-btn" onclick="deleteTask('${list[i].id}')"><img src="image/garbage.png" alt="delete"></button>
            </div>
        </div>`
        }else {resultHTML += `<div class="task">
            <div>${list[i].taskContent}</div>
            <div>
                <button class="check-btn" onclick="toggleComplete('${list[i].id}')"><img src="image/double-check.png" alt="check"></button>
                <button class="delete-btn" onclick="deleteTask('${list[i].id}')"><img src="image/garbage.png" alt="delete"></button>
            </div>
        </div>`;
        }

    }
    document.getElementById("task-board").innerHTML = resultHTML;
}

function toggleComplete(id) {
    console.log("id:",id)
    for (let i =0; i < taskList.length; i++) {
        if(taskList[i].id == id) {
            taskList[i].isComplete = !taskList[i].isComplete;
            break;
        }
    }
    render();
    console.log(taskList);
}

function deleteTask(id) {
    for (let i =0; i < taskList.length; i++) {
        if(taskList[i].id == id) {
            taskList.splice(i,1);
            break;
        }   
    }
    render();
}


function filter(event) {
    mode = event.target.id;
    filterList = [];
    if(mode === "all") {
        //전체 리스트를 보여준다
        render();
    } else if(mode == "ongoing") {
        //진행중인 아이템을 보여준다
        //task.isComplete=false
        for(let i = 0; i < taskList.length; i++) {
            if(taskList[i].isComplete === false) {
                filterList.push(taskList[i]);
            }
        } 
         render();
        console.log("진행중 :", filterList);
    } else if(mode == "done") {
        //끝나는 케이스
        //task.isComplete=true
        for(let i=0;i<taskList.length;i++) {
            if(taskList[i].isComplete === true) {
                filterList.push(taskList[i]);
            }
        }
        render();
    }

}
function randomIDGenerate() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// 엔터키로 추가 기능
taskInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});
