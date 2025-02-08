(function() {
  //создаем и возвращаем заголовок приложения
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title; //присваиваем св-во title внутреннему сожержимому
        return appTitle;
    }

  //создаем и возвращаем форму для создания дела
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div'); //доп элемент, чтобы правильно стилизовать кнопку в стилях бутстрап
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3'); // все классы бутстрап
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append'); // класс нужен, чтобы позиционировать какой-то элемент в форме справа от поля ввода
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';

        button.disabled = true;
        input.addEventListener('input', function(){
           if(input.value.trim() === ''){
               button.disabled = true;
           }
           else{
               button.disabled = false;
           }
        });

        buttonWrapper.append(button);
        form.append(input, buttonWrapper);

        return { // не можем вернуть только форму, потому что нужен доступ и к инпутуб и к кнопке при добавлении дела в список
            form,
            input,
            button,
        };
    }

  //создаем и возвращаем список элементов
    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    let todoArray = [];
    let keyName = '';

  //создаем функцию для внесения дела в список
    function createTodoItem(obj) {
        let item = document.createElement('li');
    //кнопки помещаем в элемент, который красиво покажет их в одной группе
        let buttonGroup = document.createElement('div'); //общая группа нужна только для стилизации
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

    //устанавливаем стили для элемента списка, а также для размещения кнопок в его правой части с помощью flex
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = obj.name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        if(obj.done === true) {
            item.classList.add('list-group-item-success');
        }

        //добавляем обработчики на кнопки
        doneButton.addEventListener('click', function() {
            item.classList.toggle('list-group-item-success'); //toggle добавляет класс
            for(const todoItem of todoArray) {
                if(todoItem.id === obj.id) {
                    todoItem.done = ! todoItem.done;
                }
            }
            saveList(todoArray, keyName);

        });
        deleteButton.addEventListener('click', function() {
            if(confirm('Вы уверены?')) {
                item.remove();
            }

            for(let i = 0; i < todoArray.length; i++) {
                if(todoArray[i].id === obj.id) {
                    todoArray.splice(i, 1)
                }
            }
            saveList(todoArray, keyName);
        });

    // вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
        buttonGroup.append(doneButton, deleteButton);
        item.append(buttonGroup);

        // приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
        return {
            item,
            doneButton,
            deleteButton,
        }
    };

    function getNewId (arr) {
        let maxId = 0;
        for( const item of arr) {
            if(item.id > maxId) {
                maxId = item.id;
            }
        }
        return maxId + 1;
    }

    function saveList(arr, listName) {
        localStorage.setItem(listName,JSON.stringify(arr)); //устаналиваем значение, первое-ключ, второе-массив
    }

    function createTodoApp(container, title = 'Список дел', listName) {
        //вызываем все три функции, которые создали до этого
        let todoApptitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        keyName = listName; //делаем элемент глобальным, чтобы он был не только внутри функции

        container.append(todoApptitle, todoItemForm.form, todoList);
//мы возвращаем объект, в котором есть форма, поэтому пишем .форм


        let localData = localStorage.getItem(keyName); //получаем элементы по кулючу-названию. все данные выводятся в консоль, но не на экран ещё
        if (localData !== null && localData !== "") { // проверка на пустоту важна, иначе будет ошибка
        todoArray = JSON.parse (localData);
        }
        for (const element of todoArray) {
            let todoItem = createTodoItem(element);
            todoList.append(todoItem.item);
        }

        //браузер создает событие submit (свойственно только для формы) на форме по нажатию на enter или на кнопку создания дела
        todoItemForm.form.addEventListener('submit', function(e) {
            //эта строчка необходима, чтобы предотвратить стандартное действие браузера
            //в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
            e.preventDefault();

            //инорируем создание элемента, если пользователь ничего не ввёл в поле
            if (!todoItemForm.input.value) {
                return;
            }

            let arrayItem = {
                id: getNewId(todoArray),
                name: todoItemForm.input.value,
                done: false,
            }

            let todoItem = createTodoItem(arrayItem);


            todoArray.push(arrayItem);
            saveList(todoArray, keyName);

            //создаем и добавляем в список новое дело с названием из поля для ввода
            todoList.append(todoItem.item);
            todoItemForm.button.disabled = true;
            //обнуляем значение в поле, чтобы не пришлось стирать его вручную
            todoItemForm.input.value = '';
        });
    }


   /* document.addEventListener('DOMContentLoaded', function() {
        createTodoApp(document.getElementById('my-todos'), 'Мои дела');
        createTodoApp(document.getElementById('mom-todos'), 'Дела для мамы');
        createTodoApp(document.getElementById('dad-todos'), 'Дела для папы');
    }); */ //этот код мы вызывали до переименования файла js и когда на одной странице были 3 списка


    window.createTodoApp = createTodoApp; // чтобы получить доступ к функции из других скриптов

}) ();

