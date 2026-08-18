const form = document.querySelector("form");

const nameInp = document.querySelector("#studentName");
const ageInp = document.querySelector("#studentAge");
const rollInp = document.querySelector("#studentRoll");

const studentList = document.querySelector(".student-list");

const nameError = document.querySelector(".name-error");
const ageError = document.querySelector(".age-error");
const rollError = document.querySelector(".roll-error");

const studentCount = document.querySelector(".student-num");

const addStudentBtn = document.querySelector("#addStudentBtn");
const studentSearch = document.querySelector("#studentSearch");
const rollPopup = document.querySelector("#rollPopup");
const rollPopupClose = document.querySelector(".roll-popup-close");

studentSearch.addEventListener("input", function () {
  let searchValue = studentSearch.value.toLowerCase();

  let filteredStudents = students.filter((studentObj) => {
    return studentObj.name.toLowerCase().includes(searchValue) || studentObj.rollNo.toString().includes(searchValue);
  });

  renderStudents(filteredStudents);
});

let students = [];
let editStudent = null;

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nameRegex = /^[A-Za-z]{2,}(?:\s[A-Za-z]+)*$/;

  const isNameValid = nameRegex.test(nameInp.value.trim());

  if (!isNameValid) {
    nameError.style.display = "inline-block";
  } else {
    nameError.style.display = "none";
  }

  const age = Number(ageInp.value.trim());
  const isAgeValid = age <= 60 && age >= 12;

  if (!isAgeValid) {
    ageError.style.display = "inline-block";
  } else {
    ageError.style.display = "none";
  }

  const rollNo = Number(rollInp.value.trim());

  const isRollTaken = students.some((student) => student !== editStudent && student.rollNo === rollNo);

  if (isRollTaken) {
    rollPopup.classList.add("show");
    setTimeout(() => {
      rollPopup.classList.remove("show");
    }, 3000);

    return;
  }

  const isValidRoll = rollNo < 100 && rollNo > 0;

  if (!isValidRoll) {
    rollError.style.display = "inline-block";
  } else {
    rollError.style.display = "none";
  }

  if (isNameValid && isAgeValid && isValidRoll) {
    if (editStudent === null) {
      let studentObj = {
        name: nameInp.value,
        age: age,
        rollNo: rollNo,
      };

      form.reset();

      students.push(studentObj);

      saveStudents();

      studentCount.textContent = students.length;

      renderStudents(students);
    } else {
      editStudent.name = nameInp.value;
      editStudent.age = age;
      editStudent.rollNo = rollNo;

      renderStudents(students);

      saveStudents();

      editStudent = null;

      addStudentBtn.textContent = "Add Student";

      form.reset();
    }
  }
});

rollPopupClose.addEventListener("click", function () {
  rollPopup.classList.remove("show");
});

function renderStudents(studentArray) {
  studentList.textContent = "";

  if (studentArray.length === 0) {
    let studEmpty = document.createElement("div");
    studEmpty.classList.add("student-empty");

    let emptyHeading = document.createElement("h3");

    studEmpty.appendChild(emptyHeading);

    emptyHeading.textContent = "No students found";

    studentList.appendChild(studEmpty);
  } else {
    studentArray.forEach((studentObj) => {
      let studentItem = document.createElement("div");
      studentItem.classList.add("student-item");

      let studentAvatar = document.createElement("div");
      studentAvatar.textContent = studentObj.name[0].toUpperCase();
      studentAvatar.classList.add("student-avatar");

      let studentInfo = document.createElement("div");
      studentInfo.classList.add("student-info");

      let h3 = document.createElement("h3");
      h3.textContent = studentObj.name;

      let studentMeta = document.createElement("div");
      studentMeta.classList.add("student-meta");

      let span1 = document.createElement("span");
      span1.textContent = `Age: ${studentObj.age}`;

      let span2 = document.createElement("span");
      span2.textContent = `Roll No: ${studentObj.rollNo}`;

      let studentActions = document.createElement("div");
      studentActions.classList.add("student-actions");

      let editBtn = document.createElement("button");
      editBtn.classList.add("edit-btn");
      editBtn.textContent = "Edit";

      editBtn.addEventListener("click", function () {
        nameInp.value = studentObj.name;
        ageInp.value = studentObj.age;
        rollInp.value = studentObj.rollNo;

        addStudentBtn.textContent = "Update";

        editStudent = studentObj;
      });

      let deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.textContent = "Delete";

      deleteBtn.addEventListener("click", function () {
        let index = students.findIndex((item) => {
          return item === studentObj;
        });

        students.splice(index, 1);

        studentCount.textContent = students.length;

        renderStudents(students);

        saveStudents();
      });

      studentActions.appendChild(editBtn);
      studentActions.appendChild(deleteBtn);

      studentMeta.appendChild(span1);
      studentMeta.appendChild(span2);

      studentInfo.appendChild(h3);
      studentInfo.appendChild(studentMeta);

      studentItem.appendChild(studentAvatar);
      studentItem.appendChild(studentInfo);
      studentItem.appendChild(studentActions);

      studentList.appendChild(studentItem);
    });
  }
}

function saveStudents() {
  localStorage.setItem("students", JSON.stringify(students));
}

function loadStudents() {
  let savedStudents = localStorage.getItem("students");

  if (savedStudents) {
    students = JSON.parse(savedStudents);
  }
}

loadStudents();
studentCount.textContent = students.length;
renderStudents(students);
