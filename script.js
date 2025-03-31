let studentIdCounter = 3;

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
  const okBut = document.getElementById("okBut");
  const createBut = document.getElementById("createBut");
  createBut.dataset.mode = "edit";
  okBut.dataset.mode = "edit";
  let modal = document.getElementById("addEditModal");
  document
    .getElementById("mainTable")
    .addEventListener("click", function (event) {
      if (event.target.closest(".editBut")) {
        // Отримуємо всі вибрані рядки
        selectedRows = Array.from(
          document.querySelectorAll(".rowCheckbox:checked")
        ).map((checkbox) => checkbox.closest("tr"));

        if (selectedRows.length === 0) {
          window.alert("Please select at least one user before deleting.");
          return;
        }

        if (selectedRows.length === 1) {
          modal.style.display = "flex";
          document.getElementById("headerText").textContent = "Edit";

          // Отримуємо дані студента для редагування
          const selectedRow = selectedRows[0];
          let group = selectedRow.cells[1].textContent.trim();

          const fullName = selectedRow.cells[2].textContent; // Ім'я та прізвище разом
          const [name, surname] = fullName.split(" "); // Розділяємо на ім'я та прізвище
          let genderText = selectedRow.cells[3].textContent.trim();
          let birthdayText = selectedRow.cells[4].textContent.trim();
          let groupSelect = document.getElementById("group");

          // Заповнюємо форму для редагування
          // Перевіряємо, чи є така група в списку
          let groupExists = Array.from(groupSelect.options).some(
            (option) => option.value === group
          );

          // Заповнюємо форму для редагування
          groupSelect.value = groupExists ? group : "";
          document.getElementById("group").value = groupExists ? group : "";
          document.getElementById("firstName").value = name;
          document.getElementById("lastName").value = surname;
          document.getElementById("gender").value =
            genderText === "M" ? "male" : "female";
          // Форматування дати народження в формат YYYY-MM-DD
          let birthdayParts = birthdayText.split(".");
          let birthdayFormatted = `${birthdayParts[2]}-${birthdayParts[1]}-${birthdayParts[0]}`;

          // Записуємо дату народження в поле
          document.getElementById("birthday").value = birthdayFormatted;

          // Зберігаємо інформацію про вибраний рядок для подальшого редагування
          document.getElementById("studentId").value =
            selectedRow.getAttribute("data-id");
        } else {
          window.alert("Please select only one student to edit.");
          return;
        }
      }
    });
});

//Обробка додавання
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("addEditModal");
  const okBut = document.getElementById("okBut");
  const createBut = document.getElementById("createBut");
  const table = document.getElementById("mainTable");
  createBut.dataset.mode = "create";
  okBut.dataset.mode = "create";

  //Кнопка відкриття вікна
  addButton = document.getElementById("addButton");
  addButton.addEventListener("click", function () {
    modal.style.display = "flex";
    document.getElementById("headerText").textContent = "Add student";
    document.getElementById("group").value = "";
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("gender").value = "";
    document.getElementById("birthday").value = "";
    document.getElementById("studentId").value = "";
  });
  //Кнопка закриття вікна
  exitButton = document.getElementById("addEditExitBut");
  exitButton.addEventListener("click", function () {
    modal.style.display = "none";
  });

  //Отримання вхідних значень
  function getInputValues() {
    return {
      id: document.getElementById("studentId").value || null,
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
    let studentId = studentIdCounter++;
    let formattedBirthday = values.birthday.split("-").reverse().join(".");
    // Зберігаю ID у data-атрибуті
    newRow.setAttribute("data-id", studentId);

    newRow.innerHTML = `
      <td>
        <input type="checkbox" class="rowCheckbox"
                aria-label="Select one"></input>
      </td>
      <td>${values.group}</td>
      <td class="username">${values.firstName} ${values.lastName}</td>
  <td>${values.gender == "male" ? "M" : "F"}</td>
  <td>${formattedBirthday}</td>
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
  function okClick() {
    let mode = this.dataset.mode;
    let values = getInputValues();

    if (values.id) {
      // Якщо є ID – редагуємо існуючий рядок
      updateRow(values);
    } else {
      // Якщо ID немає – створюємо новий рядок
      addNewRow(values);
    }
    modal.style.display = "none";
  }

  function createClick() {
    let mode = this.dataset.mode;
    let values = getInputValues();

    if (values.id) {
      updateRow(values);
    } else {
      addNewRow(values);
    }
    modal.style.display = "none";
  }

  function updateRow(values) {
    let row = document.querySelector(`tr[data-id="${values.id}"]`);
    if (row) {
      row.cells[1].textContent = values.group;
      row.cells[2].textContent = `${values.firstName} ${values.lastName}`;
      row.cells[3].textContent = values.gender === "male" ? "M" : "F";
      row.cells[4].textContent = values.birthday.split("-").reverse().join(".");

      // Виводжу змінені дані у консоль у форматі JSON
      let studentData = {
        id: values.id,
        group: values.group,
        firstName: values.firstName,
        lastName: values.lastName,
        gender: values.gender,
        birthday: values.birthday.split("-").reverse().join("."),
        status: "active",
      };
      console.log(JSON.stringify(studentData, null, 2));
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
