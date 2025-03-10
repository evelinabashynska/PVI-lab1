function hideCircle() {
  document.getElementById("notification").style.display = "none";
  //window.location.href = "messages.html";
}
function drawCloud(c, ctx) {
  ctx.beginPath();
}
function drawClouds() {
  let c = document.querySelector(".cloud");
  let ctx = c.getContext("2d");
  drawCloud(c, ctx);
}

document.addEventListener("DOMContentLoaded", function () {
  const bellIcon = document.getElementById("bellIcon");

  bellIcon.addEventListener("dblclick", function () {
    bellIcon.classList.add("shaking");
    document.getElementById("notification").style.display = "inline";
    setTimeout(() => {
      bellIcon.classList.remove("shaking");
    }, 600);
  });
});

/*
function showAddEditWindow() {
  modal = document.getElementById("modal").style.display = "flex";
}
*/

function showModalMessages() {
  modal = document.getElementById("messagesPreview").style.display = "flex";
}
function hideModalMessages() {
  modal = document.getElementById("messagesPreview").style.display = "none";
}

function showModalUser() {
  modal = document.getElementById("userModalWindow").style.display = "flex";
}
function hideModalUser() {
  modal = document.getElementById("userModalWindow").style.display = "none";
}

function showNavModal() {
  modal = document.getElementById("navModal");
  if (modal.style.display === "flex") {
    modal.style.display = "none";
  } else {
    modal.style.display = "flex";
  }
}
window.addEventListener("resize", function () {
  const modal = document.getElementById("navModal");
  // Якщо меню відкрите, приховуємо його при зміні розміру вікна
  if (modal.style.display === "flex") {
    modal.style.display = "none";
  }
});
