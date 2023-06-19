const URL = "http://localhost:3030";
const messagePanes = {};
let socket = null;

$(function () {
  // $("#nav-PrivateChat-tab").trigger("click");

  $("#nav-Broadcast>button").click(function () {
    newConnectWebSocket();
  });
  $("#tab2Connect").on("click", function () {
    const userName = $("#tab2username").val();
    if (userName === "") return;
    newConnectWebSocket(userName);
  });
});

// 建立WebSocket連線
function newConnectWebSocket(userName = "") {
  // check if socket is already connected, then close it
  if (socket) {
    removeEventHandlers();
    socket.close();
  }

  // connect to socket.io server
  socket = io(URL, {
    auth: { userName },
  });
  setUpEventHandlers();
}

// 建立監聽事件
function setUpEventHandlers() {
  //監聽connectStatus事件(接收websocket訊息)
  //自己連線成功時會觸發
  socket.on("connectStatus", (data) => {
    console.log("check point 收到甚麼status訊息:", data);
    const { message } = data;
    sweetMsg(message);
  });

  //監聽broadcast事件(接收websocket訊息)
  //任何人加入或退出websocket都會觸發
  socket.on("broadcast", (data) => {
    console.log("check point 收到甚麼broadcast訊息:", data);
    const { message } = data;
    sweetMsg(message);
  });

  //監聽broadcastMsg事件(接收websocket訊息)
  socket.on("broadcastMsg", (data) => {
    console.log("check point 收到甚麼message訊息:", data);
    const { message } = data;
    updateTab1Pane(message);
  });

  //監聽privateMsg事件(接收websocket訊息)
  socket.on("privateMsg", (data) => {
    console.log("check point 收到甚麼message訊息:", data);
    const { userName, message, createAt } = data;
    updateTab2Pane(userName, message);
  });

  //監聽tab1傳送按鈕(發送websocket訊息)
  $("#nav-Broadcast").on("click", "button#tab1BroadcastBtn", function () {
    const message = $("#tab1BroadcastInp").val();
    if (message === "") return;
    socket.emit("broadcastMsg", { message });
    $("#tab1Inp").val("");
  });

  //監聽tab2傳送按鈕(發送websocket訊息)
  $("#nav-PrivateChat").on("click", "button#tab2PrivateBtn", function () {
    const friendName = $("#tab2friendName").val();
    if (friendName === "") return;
    const message = $("#tab2PrivateInp").val();
    if (message === "") return;
    socket.emit("privateMsg", { friendName, message });
    $("#tab2PrivateInp").val("");
  });
}

// 移除監聽事件
function removeEventHandlers() {
  socket.off("message");
  socket.off("connectStatus");
  socket.off("errorMsg");
  $("#roomSection").off("click", "button.btn-send");
}

// 更新訊息顯示區(tab1廣播)
function updateTab1Pane(msg) {
  const content = `
  <div class="d-flex *align-items-start mb-3">
    <p class="me-3">匿名:</p>
    <p class="bg-body-secondary">${msg}</p>
  </div>`;
  $("#tab1Pane").append(content);
}

// 更新訊息顯示區(tab2私訊)
function updateTab2Pane(userName, msg) {
  const content = `
  <div class="d-flex *align-items-start mb-3">
    <p class="me-3">${userName}:</p>
    <p class="bg-body-secondary">${msg}</p>
  </div>`;
  $("#tab2Pane").append(content);
}

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 1000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

function sweetMsg(msg, level = "info") {
  Toast.fire({
    icon: level,
    title: msg,
  });
}
