// Этап 1. В HTML файле создайте верстку элементов, которые будут статичны(неизменны).

// Этап 2. Создайте массив объектов студентов.Добавьте в него объекты студентов, например 5 студентов.

const studentsArray = [
  // Добавьте сюда объекты студентов
  {surname: 'Степанов', name: 'Владислав', middleName: 'Вадимович', birthday: new Date('2005-08-18'), firstYear: 2023, faculity: 'Математический'},
  {surname: 'Вагапов', name: 'Ильмир', middleName: 'Камилевич', birthday: new Date('2004-10-07'), firstYear: 2022, faculity: 'Технологический'},
  {surname: 'Иванова', name: 'Карина', middleName: 'Денисовна', birthday: new Date('1996-03-26'), firstYear: 2018, faculity: 'Архитектурный'},
  {surname: 'Никитина', name: 'Агафья', middleName: 'Константиновна', birthday: new Date('1999-11-02'), firstYear: 2020, faculity: 'Филологический'},
  {surname: 'Агадзе', name: 'Кирилл', middleName: 'Альфредович', birthday: new Date('2001-07-05'), firstYear: 2024, faculity: 'Исторический'},
]

let sortColumnFlag = 'fio';

const container = document.getElementById('container');
const form = document.getElementById('form');
const surname = document.getElementById('form__surname')
const name = document.getElementById('form__name');
const middleName = document.getElementById('form__middleName');
const birthday = document.getElementById('form__birthday');
const firstYear = document.getElementById('form__firstYear');
const faculity = document.getElementById('form__faculity');

birthday.max = new Date().toISOString().split('T')[0];
firstYear.max = new Date().getFullYear();

const validationText = document.getElementById('validation__text');

const table = document.createElement('table');
const tableHead = document.createElement('thead');
const tableBody = document.createElement('tbody');

const tableHeadTr = document.createElement('tr');
const tableHeadThName = document.createElement('th');
const tableHeadThBirthday = document.createElement('th');
const tableHeadThYear = document.createElement('th');
const tableHeadThFaculity = document.createElement('th');

tableHead.classList.add('table-active')
tableHeadThName.style.cursor = 'pointer';
tableHeadThBirthday.style.cursor = 'pointer';
tableHeadThYear.style.cursor = 'pointer';
tableHeadThFaculity.style.cursor = 'pointer';

tableHeadThName.textContent = 'Ф.И.О.'
tableHeadThBirthday.textContent = 'Дата рождения'
tableHeadThYear.textContent = 'Год поступления'
tableHeadThFaculity.textContent = 'Факультет'

table.classList.add('table', 'table-primary', 'table-bordered')

const filterForm = document.getElementById('filter__form');
const filterFio = document.getElementById('filter__fio');
const filterBirthday = document.getElementById('filter__birthday');
const filterFirstYear = document.getElementById('filter__firstYear');
const filterFaculity = document.getElementById('filter__faculity');

tableHeadTr.append(tableHeadThName, tableHeadThBirthday, tableHeadThYear, tableHeadThFaculity);
tableHead.append(tableHeadTr);
table.append(tableHead, tableBody);
container.append(table);


// Этап 3. Создайте функцию вывода одного студента в таблицу, по аналогии с тем, как вы делали вывод одного дела в модуле 8. Функция должна вернуть html элемент с информацией и пользователе.У функции должен быть один аргумент - объект студента.

function getStudentItem(oneStudent) {
  const studentTr = document.createElement('tr');
  const studentThName = document.createElement('th');
  const studentThBirthday = document.createElement('th');
  const studentThYear = document.createElement('th');
  const studentThFaculity = document.createElement('th');

  studentThName.textContent = oneStudent.fio;
  studentThBirthday.textContent = oneStudent.birthDay;
  studentThYear.textContent = oneStudent.studyYear;
  studentThFaculity.textContent = oneStudent.faculity;

  studentTr.append(studentThName, studentThBirthday, studentThYear, studentThFaculity);

  return studentTr
}

// Этап 4. Создайте функцию отрисовки всех студентов. Аргументом функции будет массив студентов.Функция должна использовать ранее созданную функцию создания одной записи для студента.Цикл поможет вам создать список студентов.Каждый раз при изменении списка студента вы будете вызывать эту функцию для отрисовки таблицы.


function renderStudentsTable(array) {
  tableBody.innerHTML = '';

  let studentsArrayCopy = [...studentsArray];

  for (const oneStudent of studentsArrayCopy) {
    oneStudent.fio = oneStudent.surname + ' ' + oneStudent.name + ' ' + oneStudent.middleName;

    const today = new Date();
    const year = today.getFullYear();
    let studyYears = year - oneStudent.firstYear;
    if (studyYears > 4 || (studyYears > 4 && today.getMonth >= 8)) {
      oneStudent.studyYear = oneStudent.firstYear + ' - '  + (oneStudent.firstYear + 4) + ' (закончила(а))'
    } else {
      oneStudent.studyYear = oneStudent.firstYear + ' - ' + (oneStudent.firstYear + 4) + ' (' + (year - oneStudent.firstYear) + ' курс' + ')'
    }


    function birthDate(date) {
      let result = '';

      result = date.getDate() < 10 ? '0' + date.getDate() + '.' : date.getDate() + '.';
      result = result + (date.getMonth() < 9 ? '0' + (date.getMonth() + 1) + '.' : (date.getMonth() + 1) + '.');

      result = result + date.getFullYear()
      return result
    }

    function getAge(birthDate) {
      let age = today.getFullYear() - birthDate.getFullYear();
      let month = today.getMonth() - birthDate.getMonth();
      if(month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age
    }

    oneStudent.birthDay = birthDate(oneStudent.birthday) + '(' + getAge(oneStudent.birthday) + ' лет)'
  }

  //Сортировка
  studentsArrayCopy = studentsArrayCopy.sort(function(a, b) {
    if(a[sortColumnFlag] < b[sortColumnFlag])
      return -1
  })

  //Фильтрация

  if (filterFio.value.trim() !== "") {
    studentsArrayCopy = filter(studentsArrayCopy, 'fio', filterFio.value)
  }

  if (filterBirthday.value.trim() !== "") {
    studentsArrayCopy = filter(studentsArrayCopy, 'birthday', filterBirthday.value)
  }

  if (filterFirstYear.value.trim() !== "") {
    studentsArrayCopy = filter(studentsArrayCopy, 'firstYear', filterFirstYear.value)
  }

  if (filterFaculity.value.trim() !== "") {
    studentsArrayCopy = filter(studentsArrayCopy, 'faculity', filterFaculity.value)
  }


  for (const oneStudent of studentsArrayCopy) {

    const newTr = getStudentItem(oneStudent)

    tableBody.append(newTr)
  }
}

renderStudentsTable(studentsArray)

// Этап 5. К форме добавления студента добавьте слушатель события отправки формы, в котором будет проверка введенных данных.Если проверка пройдет успешно, добавляйте объект с данными студентов в массив студентов и запустите функцию отрисовки таблицы студентов, созданную на этапе 4.
  function validation(form) {
    function removeError(input) {
      if(input.classList.contains('error')) {
        input.classList.remove('error')
        validationText.textContent = '';
      }
    }

    function createError(input, text) {
      input.classList.add('error')
      validationText.textContent = text;
    }

    let result = true;

    form.querySelectorAll('input').forEach(input => {

      removeError(input)

      if (input.value == "") {
        createError(input, "Заполните все поля!")
        result = false;
      }

      function checkNumber (checkedInput, text) {
        let array = checkedInput.value.split('')

        for (let element of array) {
          if(!isNaN(element) && element !== "") {
            removeError(input)
            createError(checkedInput, text)
            result = false;
          }
        }
      }

      checkNumber(surname, "В поле 'Фамилия' не используйте цифры!")
      checkNumber(name, "В поле 'Имя' не используйте цифры!");
      checkNumber(middleName, "В поле 'Отчество' не используйте цифры!")
      checkNumber(faculity, "В поле 'Факультет' не используйте цифры!")


    })
    return result
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault()

    if(validation(this) == true) {
      studentsArray.push({
        surname: surname.value.trim(),
        name: name.value.trim(),
        middleName: middleName.value.trim(),
        birthday: new Date (birthday.value.trim()),
        firstYear: parseInt(firstYear.value.trim()),
        faculity: faculity.value.trim()
      })

      renderStudentsTable(studentsArray)

      surname.value = '';
      name.value = '';
      middleName.value = '';
      birthday.value = '';
      firstYear.value = '';
      faculity.value = '';
    }

  })

// Этап 5. Создайте функцию сортировки массива студентов и добавьте события кликов на соответствующие колонки.

  tableHeadThName.addEventListener('click', function() {
    sortColumnFlag = 'fio'
    renderStudentsTable(studentsArray)
  });

  tableHeadThBirthday.addEventListener('click', function() {
    sortColumnFlag = 'birthday'
    renderStudentsTable(studentsArray)
  });

  tableHeadThYear.addEventListener('click', function() {
    sortColumnFlag = 'firstYear'
    renderStudentsTable(studentsArray)
  });

  tableHeadThFaculity.addEventListener('click', function() {
    sortColumnFlag = 'faculity'
    renderStudentsTable(studentsArray)
  })


// Этап 6. Создайте функцию фильтрации массива студентов и добавьте события для элементов формы.
filterForm.addEventListener('submit', function(e) {
  e.preventDefault()
})

filterFio.addEventListener('input', function() {
  renderStudentsTable(studentsArray)
})

filterBirthday.addEventListener('input', function() {
  renderStudentsTable(studentsArray)
})

filterFirstYear.addEventListener('input', function() {
  renderStudentsTable(studentsArray)
})

filterFaculity.addEventListener('input', function() {
  renderStudentsTable(studentsArray)
})

function filter(arr, prop,value) {
  return arr.filter(function(oneStudent) {
    if(String(oneStudent[prop]).includes(value.trim()))
    return true
  })
}
