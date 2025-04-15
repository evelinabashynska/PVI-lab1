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
          document.getElementById("createBut").innerText = "Change";

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
  let form = document.getElementById("studentForm");
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

    table.appendChild(newRow);
    updateStatus(newRow);
  }
  function validateForm() {
    let isValid = true;

    function validateField(id, regex, errorMessage) {
      let input = document.getElementById(id);
      let value = input.value.trim();

      if (!regex.test(value)) {
        input.classList.add("error");
        showError(input, errorMessage);
        isValid = false;
      } else {
        input.classList.remove("error");
        hideError(input);
      }
    }

    validateField(
      "firstName",
      /^[A-Za-z'-]+$/,
      "Ім'я може містити лише англійські літери, апострофи та дефіси!"
    );
    validateField(
      "lastName",
      /^[A-Za-z'-]+$/,
      "Прізвище може містити лише англійські літери, апострофи та дефіси!"
    );

    let group = document.getElementById("group");
    if (!group.value) {
      group.classList.add("error");
      showError(group, "Оберіть групу!");
      isValid = false;
    } else {
      group.classList.remove("error");
      hideError(group);
    }

    let gender = document.getElementById("gender");
    if (!gender.value) {
      gender.classList.add("error");
      showError(gender, "Оберіть стать!");
      isValid = false;
    } else {
      gender.classList.remove("error");
      hideError(gender);
    }

    let birthday = document.getElementById("birthday");
    let birthDate = new Date(birthday.value);
    let minDate = new Date("1900-01-01");
    let maxDate = new Date();

    if (birthday.value === "" || birthDate < minDate || birthDate > maxDate) {
      birthday.classList.add("error");
      showError(
        birthday,
        "Дата народження має бути від 01.01.1900 до сьогодні!"
      );
      isValid = false;
    } else {
      birthday.classList.remove("error");
      hideError(birthday);
    }

    return isValid;
  }

  // Функція для показу помилки
  function showError(input, message) {
    let error = input.nextElementSibling;
    if (!error || !error.classList.contains("error-text")) {
      error = document.createElement("span");
      error.classList.add("error-text");
      input.parentNode.appendChild(error);
    }
    error.textContent = message;
  }

  // Функція для приховання помилки
  function hideError(input) {
    let error = input.nextElementSibling;
    if (error && error.classList.contains("error-text")) {
      error.remove();
    }
  }
  /*
  function okClick() {
    event.preventDefault();
    let mode = this.dataset.mode;
    let values = getInputValues();
    if (values.id) {
      // Якщо є ID – редагуємо існуючий рядок

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      updateRow(values);
    } else {
      // Якщо ID немає – створюємо новий рядок
      /*
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
 event.preventDefault(); // Вимикаємо стандартне відправлення
      validateForm();
      addNewRow(values);
    }
    modal.style.display = "none";
  }
*/
  function okClick() {
    event.preventDefault();
    let values = getInputValues();

    if (validateForm()) {
      if (values.id) {
        updateRow(values);
      } else {
        addNewRow(values);
      }
      modal.style.display = "none";
    }
  }
  function createClick() {
    event.preventDefault();
    let values = getInputValues();

    if (validateForm()) {
      if (values.id) {
        updateRow(values);
      } else {
        addNewRow(values);
      }
      modal.style.display = "none";
    }
  }
  /*
  function createClick() {
    event.preventDefault();
    let mode = this.dataset.mode;
    let values = getInputValues();

    if (values.id) {
      // Якщо є ID – редагуємо існуючий рядок
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      updateRow(values);
    } else {
      // Якщо ID немає – створюємо новий рядок

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      addNewRow(values);
    }
    modal.style.display = "none";
  }
*/

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

document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("addEditModalWindow");
  const openModal = document.getElementById("addButton");
  const closeModal = document.getElementById("addEditExitBut");
  const body = document.body;

  openModal.addEventListener("click", function () {
    modal.style.display = "block";
    body.classList.add("modal-open"); // Додаємо ефект затемнення
  });

  function closeModalFunc() {
    modal.style.display = "none";
    body.classList.remove("modal-open"); // Приховуємо затемнення
  }

  closeModal.addEventListener("click", closeModalFunc);

  // Закриття при кліку на затемнений фон
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModalFunc();
    }
  });
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/PVI_lab1/sw.js")
    .then(() => console.log("Service Worker registered"))
    .catch((err) => console.error("Service Worker registration failed", err));
}

//-------------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  // --- 4.1) Автентифікація та авторизація ---
  const loginBtnHeader = document.querySelector(
    "header > .userModalWindow ul li a[href='views/auth/login.php']"
  );
  const userPhotoIcon = document.getElementById("userphoto");
  const bellIconHeader = document.getElementById("bellIcon");
  const userModalWindowHeader = document.getElementById("userModalWindow");
  const messagesPreviewHeader = document.getElementById("messagesPreview");
  const mainNav = document.querySelector(".mainNav nav ul");
  const navModalAside = document.querySelector(".navModal nav ul");
  let isAuthenticated = false;
  let loggedInUser = null;

  // Перевірка, чи користувач залогінений при завантаженні сторінки
  function checkAuthStatus() {
    fetch("./api/auth.php?action=check_auth") // Створіть цей ендпоінт на сервері
      .then((response) => response.json())
      .then((data) => {
        isAuthenticated = data.isLoggedIn;
        loggedInUser = data.user;
        updateHeaderUI();
        loadStudents(); // Завантажуємо студентів лише після перевірки автентифікації
      })
      .catch((error) => console.error("Error checking auth status:", error));
  }

  function updateHeaderUI() {
    if (loginBtnHeader) {
      loginBtnHeader.style.display = isAuthenticated ? "none" : "block";
    }
    if (userPhotoIcon) {
      userPhotoIcon.style.display = isAuthenticated
        ? "inline-block"
        : "inline-block";
      userModalWindowHeader.style.right = "0px";
    }
    if (bellIconHeader) {
      bellIconHeader.style.display = isAuthenticated ? "inline-block" : "none";
    }
    // Додайте або видаліть класи/елементи для відображення/приховування функціоналу
    const editDeleteButtons = document.querySelectorAll(".editBut, .delBut");
    editDeleteButtons.forEach((button) => {
      button.disabled = !isAuthenticated;
    });
    const addButtonElement = document.getElementById("addButton");
    if (addButtonElement) {
      addButtonElement.disabled = !isAuthenticated;
    }
    // Оновлення навігації (потрібно скоригувати селектори, якщо структура відрізняється)
    const taskLinkMain = mainNav
      ? mainNav.querySelector('a[href="./tasks.html"]')
      : null;
    const messageLinkMain = mainNav
      ? mainNav.querySelector('a[href="./messages.html"]')
      : null;
    const taskLinkModal = navModalAside
      ? navModalAside.querySelector('a[href="./tasks.html"]')
      : null;
    const messageLinkModal = navModalAside
      ? navModalAside.querySelector('a[href="./messages.html"]')
      : null;

    if (taskLinkMain)
      taskLinkMain.style.pointerEvents = isAuthenticated ? "auto" : "none";
    if (messageLinkMain)
      messageLinkMain.style.pointerEvents = isAuthenticated ? "auto" : "none";
    if (taskLinkModal)
      taskLinkModal.style.pointerEvents = isAuthenticated ? "auto" : "none";
    if (messageLinkModal)
      messageLinkModal.style.pointerEvents = isAuthenticated ? "auto" : "none";

    const profileNameLabel = document.querySelector("header > label.name");
    if (profileNameLabel && loggedInUser) {
      profileNameLabel.textContent =
        loggedInUser.firstName + " " + loggedInUser.lastName;
    } else if (profileNameLabel) {
      profileNameLabel.textContent = ""; // Або якесь значення за замовчуванням
    }
  }

  // Модальне вікно для логіна
  const loginModal = document.getElementById("loginModal");
  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");
  const loginExitBtn = document.getElementById("loginExitBtn");

  if (loginBtnHeader) {
    loginBtnHeader.addEventListener("click", () => {
      if (loginModal) {
        loginModal.style.display = "block";
      }
    });
  }

  if (loginExitBtn) {
    loginExitBtn.addEventListener("click", () => {
      if (loginModal) {
        loginModal.style.display = "none";
        if (loginForm) loginForm.reset();
        if (loginError) loginError.style.display = "none";
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const login = this.querySelector("#login").value;
      const password = this.querySelector("#password").value;

      fetch("./PVI_lab1/api/auth.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `login=${encodeURIComponent(login)}&password=${encodeURIComponent(
          password
        )}`,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            isAuthenticated = true;
            loggedInUser = data.user; // Отримайте дані користувача з відповіді
            updateHeaderUI();
            loadStudents();
            if (loginModal) loginModal.style.display = "none";
            if (loginForm) loginForm.reset();
            if (loginError) loginError.style.display = "none";
          } else {
            if (loginError) {
              loginError.textContent = data.message;
              loginError.style.display = "block";
            }
          }
        })
        .catch((error) => console.error("Error during login:", error));
    });
  }

  // Кнопка Logout
  const logoutLink = userModalWindowHeader
    ? userModalWindowHeader.querySelector(
        'ul li a[href="views/auth/login.php"]'
      )
    : null;
  if (logoutLink) {
    logoutLink.addEventListener("click", function (e) {
      e.preventDefault();
      fetch("./api/auth.php?logout=true")
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            isAuthenticated = false;
            loggedInUser = null;
            updateHeaderUI();
            loadStudents(); // Перезавантажуємо сторінку студентів у не залогіненому стані
            // Можна також перенаправити користувача на головну сторінку або сторінку логіна
          } else {
            console.error("Error during logout:", data.message);
          }
        })
        .catch((error) => console.error("Error during logout request:", error));
    });
  }

  // Викликаємо перевірку статусу автентифікації при завантаженні сторінки
  checkAuthStatus();

  // --- 4.2) Підвантаження даних таблиці ---
  const studentTableBody = document
    .getElementById("mainTable")
    .querySelector("tbody");
  const paginationContainer = document.querySelector(".navButDiv nav");
  let currentPage = 1;
  let totalPages = 1;
  const studentsPerPage = 5;

  function loadStudents(page = 1) {
    fetch(`./api/students.php?action=get_students&page=${page}`)
      .then((response) => response.json())
      .then((data) => {
        if (studentTableBody) {
          studentTableBody.innerHTML = "";
          data.students.forEach((student) => {
            const row = document.createElement("tr");
            row.className = "rows";
            row.dataset.id = student.id;
            const formattedBirthday = student.birthday
              .split("-")
              .reverse()
              .join(".");
            const genderDisplay = student.gender === "male" ? "M" : "F";
            const statusColor = "green"; // Для 3-ї лаби всі активні

            row.innerHTML = `
  <td><input type="checkbox" class="rowCheckbox" aria-label="Select one"></td>
  <td>${student.group}</td>
  <td class="username">${student.firstName} ${student.lastName}</td>
  <td>${genderDisplay}</td>
  <td>${formattedBirthday}</td>
  <td>
    <svg width="20px" height="20px">
      <circle cx="10" cy="10" r="5" stroke="none" fill="${statusColor}"></circle>
    </svg>
  </td>
  <td>
    <button class="editBut" ${!isAuthenticated ? "disabled" : ""}>
      <img class="opticon" src="./images/pencil.png" alt="Pencil">
    </button>
    <button class="delBut" ${!isAuthenticated ? "disabled" : ""}>
      <img class="opticon" src="./images/trash.png" alt="Trash">
    </button>
  </td>
`;
            studentTableBody.appendChild(row);

            const editButton = row.querySelector(".editBut");
            const deleteButton = row.querySelector(".delBut");

            if (editButton) {
              editButton.addEventListener("click", () =>
                showEditStudentModal(student.id)
              );
            }
            if (deleteButton) {
              deleteButton.addEventListener("click", () =>
                showDeleteConfirmation(
                  student.id,
                  `${student.firstName} ${student.lastName}`
                )
              );
            }
          });
        }
        totalPages = data.total_pages;
        currentPage = data.current_page;
        renderPagination(totalPages, currentPage);
        updateHeaderUI(); // Оновлюємо UI після завантаження студентів (можливо, статус кнопок)
      })
      .catch((error) => console.error("Error loading students:", error));
  }

  function renderPagination(totalPages, currentPage) {
    if (paginationContainer) {
      paginationContainer.innerHTML = "";
      const prevButton = document.createElement("button");
      prevButton.className = "pageNavBut";
      prevButton.textContent = "<";
      prevButton.disabled = currentPage === 1;
      prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
          loadStudents(currentPage - 1);
        }
      });
      paginationContainer.appendChild(prevButton);

      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);

      for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement("button");
        pageButton.className = "pageNavBut";
        pageButton.textContent = i;
        if (i === currentPage) {
          pageButton.classList.add("active");
        }
        pageButton.addEventListener("click", () => {
          loadStudents(i);
        });
        paginationContainer.appendChild(pageButton);
      }

      const nextButton = document.createElement("button");
      nextButton.className = "pageNavBut";
      nextButton.textContent = ">";
      nextButton.disabled = currentPage === totalPages;
      nextButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
          loadStudents(currentPage + 1);
        }
      });
      paginationContainer.appendChild(nextButton);
    }
  }

  // --- 4.3) Додавання студентів ---
  const addButton = document.getElementById("addButton");
  const addEditModal = document.getElementById("addEditModal");
  const addEditExitBut = document.getElementById("addEditExitBut");
  const studentForm = document.getElementById("studentForm");
  const createBut = document.getElementById("createBut");
  const okBut = document.getElementById("okBut");
  const headerText = document.getElementById("headerText");
  const studentIdInput = document.getElementById("studentId");

  if (addButton) {
    addButton.addEventListener("click", () => {
      headerText.textContent = "Add Student";
      studentForm.reset();
      studentIdInput.value = "";
      okBut.style.display = "none";
      createBut.style.display = "inline-block";
      addEditModal.style.display = "flex";
      clearValidationErrors();
    });
  }

  if (addEditExitBut) {
    addEditExitBut.addEventListener("click", () => {
      addEditModal.style.display = "none";
      studentForm.reset();
      clearValidationErrors();
    });
  }

  if (createBut) {
    createBut.addEventListener("click", createStudent);
  }

  function createStudent(event) {
    event.preventDefault();
    if (!isAuthenticated) {
      alert("You must be logged in to add students.");
      return;
    }

    const formData = new FormData(studentForm);
    formData.append("action", "add_student");

    fetch("./PVI_lab1/api/students.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          addEditModal.style.display = "none";
          studentForm.reset();
          loadStudents();
          clearValidationErrors();
        } else if (data.errors) {
          displayValidationErrors(data.errors);
        } else {
          alert("Failed to add student.");
        }
      })
      .catch((error) => console.error("Error adding student:", error));
  }

  function displayValidationErrors(errors) {
    clearValidationErrors();
    for (const key in errors) {
      const errorElement =
        document.getElementById(`${key}-error`) ||
        document.querySelector(`[name="${key}"] + .error-message`);
      if (errorElement) {
        errorElement.textContent = errors[key];
      } else {
        console.warn(`Error message container for ${key} not found.`);
      }
    }
  }

  function clearValidationErrors() {
    document
      .querySelectorAll(".error-message")
      .forEach((el) => (el.textContent = ""));
    document
      .querySelectorAll("input.error, select.error")
      .forEach((el) => el.classList.remove("error"));
  }

  // --- 4.4) Редагування студентів ---
  function showEditStudentModal(id) {
    if (!isAuthenticated) {
      alert("You must be logged in to edit students.");
      return;
    }
    headerText.textContent = "Edit Student";
    studentForm.reset();
    studentIdInput.value = id;
    okBut.style.display = "inline-block";
    createBut.style.display = "none";
    addEditModal.style.display = "flex";
    clearValidationErrors();

    fetch(`./PVI_lab1/api/students.php?action=get_students`) // Отримати всіх студентів для пошуку потрібного
      .then((response) => response.json())
      .then((data) => {
        const student = data.students.find((s) => s.id == id);
        if (student) {
          document.getElementById("group").value = student.group;
          document.getElementById("firstName").value = student.firstName;
          document.getElementById("lastName").value = student.lastName;
          document.getElementById("gender").value = student.gender;
          document.getElementById("birthday").value = student.birthday;
        } else {
          alert("Student not found for editing.");
          addEditModal.style.display = "none";
        }
      })
      .catch((error) =>
        console.error("Error fetching student for edit:", error)
      );
  }

  if (okBut) {
    okBut.addEventListener("click", updateStudent);
  }

  function updateStudent(event) {
    event.preventDefault();
    if (!isAuthenticated) {
      alert("You must be logged in to update students.");
      return;
    }

    const formData = new FormData(studentForm);
    formData.append("action", "edit_student");
    formData.append("id", studentIdInput.value);

    fetch("./PVI_lab1/api/students.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          addEditModal.style.display = "none";
          studentForm.reset();
          loadStudents();
          clearValidationErrors();
        } else if (data.errors) {
          displayValidationErrors(data.errors);
        } else {
          alert("Failed to update student.");
        }
      })
      .catch((error) => console.error("Error updating student:", error));
  }

  // --- 4.5) Видалення студентів ---
  const delModal = document.getElementById("delModal");
  const delExit = document.getElementById("delExit");
  const delCancelButton = document.getElementById("delCancelButton");
  const delOkButton = document.getElementById("delOkButton");
  const deleteConfirmationQuestion = document.getElementById("question");
  let studentToDeleteId = null;

  function showDeleteConfirmation(id, name) {
    if (!isAuthenticated) {
      alert("You must be logged in to delete students.");
      return;
    }
    studentToDeleteId = id;
    deleteConfirmationQuestion.textContent = `Are you sure you want to delete ${name}?`;
    delModal.style.display = "flex";
  }

  if (delExit) {
    delExit.addEventListener("click", () => {
      delModal.style.display = "none";
      studentToDeleteId = null;
    });
  }

  if (delCancelButton) {
    delCancelButton.addEventListener("click", () => {
      delModal.style.display = "none";
      studentToDeleteId = null;
    });
  }

  if (delOkButton) {
    delOkButton.addEventListener("click", deleteStudent);
  }

  function deleteStudent() {
    if (!studentToDeleteId) {
      console.error("No student ID to delete.");
      return;
    }

    fetch("./PVI_lab1/api/students.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `action=delete_student&id=${encodeURIComponent(studentToDeleteId)}`,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          delModal.style.display = "none";
          loadStudents();
          studentToDeleteId = null;
        } else {
          alert(data.error || "Failed to delete student.");
        }
      })
      .catch((error) => console.error("Error deleting student:", error));
  }

  // Ініціалізація завантаження студентів при завантаженні сторінки (після перевірки автентифікації)
  // loadStudents(); // Викликається після перевірки автентифікації

  // --- Інший код (анімація дзвіночка, модальні вікна тощо) ---
  const bellIcon = document.getElementById("bellIcon");
  if (bellIcon) {
    bellIcon.addEventListener("dblclick", function () {
      this.classList.add("shaking");
      document.getElementById("notification").style.display = "inline";
      setTimeout(() => {
        this.classList.remove("shaking");
      }, 600);
    });
  }

  const navModalElement = document.getElementById("navModal");
  const menuButton = document.querySelector(".menu-button");
  if (menuButton) {
    menuButton.addEventListener("click", showNavModal);
  }

  function showNavModal() {
    if (navModalElement) {
      navModalElement.style.display =
        navModalElement.style.display === "flex" ? "none" : "flex";
    }
  }

  window.addEventListener("resize", function () {
    if (navModalElement && window.innerWidth > 768) {
      navModalElement.style.display = "none";
    }
  });

  const userPhoto = document.getElementById("userphoto");
  if (userPhoto) {
    userPhoto.addEventListener("click", toggleUserModal);
  }

  function toggleUserModal() {
    if (userModalWindowHeader) {
      userModalWindowHeader.style.display =
        userModalWindowHeader.style.display === "block" ? "none" : "block";
    }
  }

  if (bellIconHeader) {
    bellIconHeader.addEventListener("click", toggleMessagesPreview);
  }

  function toggleMessagesPreview() {
    if (messagesPreviewHeader) {
      messagesPreviewHeader.style.display =
        messagesPreviewHeader.style.display === "block" ? "none" : "block";
      if (messagesPreviewHeader.style.display === "block") {
        const notificationElement = document.getElementById("notification");
        if (notificationElement) {
          notificationElement.style.display = "none";
        }
      }
    }
  }

  const addEditModalWindow = document.getElementById("addEditModalWindow");
  const openAddModal = document.getElementById("addButton");
  const closeAddModal = document.getElementById("addEditExitBut");
  const body = document.body;

  if (openAddModal) {
    openAddModal.addEventListener("click", function () {
      if (addEditModalWindow) {
        addEditModalWindow.style.display = "block";
        body.classList.add("modal-open");
      }
    });
  }

  function closeAddModalFunc() {
    if (addEditModalWindow) {
      addEditModalWindow.style.display = "none";
      body.classList.remove("modal-open");
    }
  }

  if (closeAddModal) {
    closeAddModal.addEventListener("click", closeAddModalFunc);
  }

  window.addEventListener("click", function (event) {
    if (addEditModalWindow && event.target === addEditModalWindow) {
      closeAddModalFunc();
    }
    if (loginModal && event.target === loginModal) {
      loginModal.style.display = "none";
    }
    if (delModal && event.target === delModal) {
      delModal.style.display = "none";
    }
    if (userModalWindowHeader && event.target === userModalWindowHeader) {
      userModalWindowHeader.style.display = "none";
    }
    if (messagesPreviewHeader && event.target === messagesPreviewHeader) {
      messagesPreviewHeader.style.display = "none";
    }
    if (navModalElement && event.target === navModalElement) {
      navModalElement.style.display = "none";
    }
  });

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/PVI_lab1/sw.js")
      .then(() => console.log("Service Worker registered"))
      .catch((err) => console.error("Service Worker registration failed", err));
  }
});
