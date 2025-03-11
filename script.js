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

function closeModalWindow() {
  modal = document.getElementById("addEditModal").style.display = "none";
}
function openModalWindow() {
  modal = document.getElementById("addEditModal").style.display = "flex";
}
function openModalWindowEdit() {
  modal = document.getElementById("addEditModal").style.display = "flex";
  header = document.getElementById("headerText").textContent = "Edit";
}

document.addEventListener("DOMContentLoaded", function () {
  const editButtons = document.getElementsByClassName("editBut");

  for (let i = 0; i < editButtons.length; i++) {
    editButtons[i].addEventListener("click", function () {
      document.getElementById("addEditModal").style.display = "flex";
      document.getElementById("headerText").textContent = "Edit";
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("addEditModal");
  const okBut = document.getElementById("okBut");
  const createBut = document.getElementById("createBut");
  const table = document.getElementById("mainTable");

  function getInputValues() {
    return {
      group: document.getElementById("group").value,
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      gender: document.getElementById("gender").value,
      birthday: document.getElementById("birthday").value,
      status: "active",
    };
  }

  function addNewRow(values) {
    let newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>
        <input type="checkbox"></input>
      </td>
      <td>${values.group}</td>
      <td>${values.firstName} ${values.lastName}</td>
  <td>${values.gender == "male" ? "M" : "F"}</td>
  <td>${values.birthday}</td>
     <td>
        <svg width="20px" height="20px">
          <circle cx="10" cy="10" r="5" stroke="none" fill="${
            values.status === "active" ? "green" : "gray"
          }"></circle>
        </svg>
      </td>
      <td>
        <button class="editBut"><img class="opticon" src="pencil.png" alt="Pencil"></button>
        <button class="delBut"><img class="opticon" src="trash.png" alt="Trash"></button>
      </td>
    `;
    table.appendChild(newRow);
  }

  function okClick() {
    let values = getInputValues();
    if (
      values.group &&
      values.firstName &&
      values.lastName &&
      values.gender &&
      values.birthday
    ) {
      addNewRow(values);
    }
    modal.style.display = "none";
  }
  function createClick() {
    let values = getInputValues();
    if (
      values.group &&
      values.firstName &&
      values.lastName &&
      values.gender &&
      values.birthday
    ) {
      addNewRow(values);
      modal.style.display = "none";
    } else {
      alert("Не усі поля заповнені");
    }
  }
  okBut.addEventListener("click", okClick);
  createBut.addEventListener("click", createClick);
});

