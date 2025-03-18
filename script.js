function hideCircle() {
  document.getElementById("notification").style.display = "none";
  //window.location.href = "messages.html";
}

//Анімація дзвіночка
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

function showNavModal() {
  modal = document.getElementById("navModal");
  if (modal.style.display === "flex") {
    modal.style.display = "none";
  } else {
    modal.style.display = "flex";
  }
}

//Щоб при збільшенні екрану зникало бургер меню
window.addEventListener("resize", function () {
  const modal = document.getElementById("navModal");
  // Якщо меню відкрите, приховуємо його при зміні розміру вікна
  if (modal.style.display === "flex") {
    modal.style.display = "none";
  }
});

//Кнопки редагування
document.addEventListener("DOMContentLoaded", function () {
  const editButtons = document.getElementsByClassName("editBut");

  for (let i = 0; i < editButtons.length; i++) {
    editButtons[i].addEventListener("click", function () {
      document.getElementById("addEditModal").style.display = "flex";
      document.getElementById("headerText").textContent = "Edit";
    });
  }
});

//Обробка додавання
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("addEditModal");
  const okBut = document.getElementById("okBut");
  const createBut = document.getElementById("createBut");
  const table = document.getElementById("mainTable");

  //Кнопка відкриття вікна
  addButton = document.getElementById("addButton");
  addButton.addEventListener("click", function () {
    modal.style.display = "flex";
  });
  //Кнопка закриття вікна
  exitButton = document.getElementById("addEditExitBut");
  exitButton.addEventListener("click", function () {
    modal.style.display = "none";
  });

  //Отримання вхідних значень
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
  //Додавання нового рядку
  function addNewRow(values) {
    let newRow = document.createElement("tr");
    newRow.classList.add("rows");

    newRow.innerHTML = `
      <td>
        <input type="checkbox"></input>
      </td>
      <td>${values.group}</td>
      <td class="username">${values.firstName} ${values.lastName}</td>
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
    updateStatus(newRow);
  }
  //Кнопка Ok
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
  //Кнопка Create
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

document.addEventListener("DOMContentLoaded", function () {
  let modal = document.getElementById("delModal");
  let okBut = document.getElementById("delOkButton");
  let exitBut = document.getElementById("delExit");
  let cancelBut = document.getElementById("delCancelButton");
  let question = document.getElementById("question");
  let selectAllCheckbox = document.getElementById("selectAll");
  let rowCheckboxes = document.querySelectorAll(".rowCheckbox");
  let selectedRows = [];

  function closeDelModalWindow() {
    modal.style.display = "none";
  }

  // Вибір усіх чекбоксів при зміні чекбоксу в заголовку
  selectAllCheckbox.addEventListener("change", function () {
    rowCheckboxes.forEach((checkbox) => {
      checkbox.checked = selectAllCheckbox.checked;
    });
  });

  exitBut.addEventListener("click", closeDelModalWindow);
  cancelBut.addEventListener("click", closeDelModalWindow);

  // Обробка натискання кнопки "Ok"
  document
    .getElementById("mainTable")
    .addEventListener("click", function (event) {
      if (event.target.closest(".delBut")) {
        modal.style.display = "flex";

        // Отримуємо всі вибрані рядки
        selectedRows = Array.from(
          document.querySelectorAll(".rowCheckbox:checked")
        ).map((checkbox) => checkbox.closest("tr"));

        if (selectedRows.length === 0) {
          question.textContent =
            "Please select at least one user before deleting.";
          return;
        }

        if (selectedRows.length === 1) {
          let userName = selectedRows[0].querySelector(".username").textContent;
          question.textContent = `Are you sure you want to delete user ${userName}?`;
        } else {
          question.textContent = `Are you sure you want to delete ${selectedRows.length} users?`;
        }
      }
    });

  // Видалення обраних рядків
  okBut.addEventListener("click", function () {
    selectedRows.forEach((row) => row.remove());
    modal.style.display = "none";
    selectedRows = [];
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const profileName = "James Bond";
  let rows = document.querySelectorAll(".rows");

  rows.forEach((row) => {
    let userNameCell = row.querySelector(".username");
    let statusCircle = row.querySelector("circle");

    if (userNameCell && statusCircle) {
      if (userNameCell.textContent.trim() === profileName) {
        statusCircle.setAttribute("fill", "green");
      } else {
        statusCircle.setAttribute("fill", "grey");
      }
    }
  });
});

function updateStatus(row) {
  const profileName = "James Bond";
  let userNameCell = row.querySelector(".username");
  let statusCircle = row.querySelector("circle");

  if (userNameCell && statusCircle) {
    if (userNameCell.textContent.trim() === profileName) {
      statusCircle.setAttribute("fill", "green");
    } else {
      statusCircle.setAttribute("fill", "grey");
    }
  }
}
