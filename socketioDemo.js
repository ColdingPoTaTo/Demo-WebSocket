const URL = "http://localhost:3030";
const messagePanes = {};
let socket = null;

// #region Socket.io
// Write your code here

// #endregion Socket.io

// #region SweetAlert2
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
// #endregion SweetAlert2
