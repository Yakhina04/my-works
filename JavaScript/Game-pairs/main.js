
const gameArray = [];
let firstCard = '';
let secondCard = '';
const container = document.getElementById('container');
let timer;


// Этап 1. Создайте функцию, генерирующую массив парных чисел. Пример массива, который должна возвратить функция: [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8].count - количество пар.
function createNumbersArray(count) {
  for (let i = 1; i <= count; i++) {
    gameArray.push(i, i)
  }
  return gameArray
}

// Этап 2. Создайте функцию перемешивания массива.Функция принимает в аргументе исходный массив и возвращает перемешанный массив. arr - массив чисел
function shuffle(arr) {
  for (let i = 0; i < arr.length; i++) {
    j = Math.round(Math.random() * (arr.length - 1));
    temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr
}


// Этап 3. Используйте две созданные функции для создания массива перемешанными номерами. На основе этого массива вы можете создать DOM-элементы карточек. У каждой карточки будет свой номер из массива произвольных чисел. Вы также можете создать для этого специальную функцию. count - количество пар.

function startGame(count) {

  const change = document.createElement('div')
  const subtitle = document.createElement('h2')
  const input = document.createElement('input')
  const button = document.createElement('button')

  change.classList.add('change')
  subtitle.classList.add('subtitle')
  subtitle.textContent = "Количество карточек по вертикали/горизонтали"
  input.classList.add('input')
  input.placeholder = "Введите число от 2 до 10"
  button.classList.add('button')
  button.textContent = "Начать игру"

  change.append(subtitle, input, button)
  container.append(change)

  button.addEventListener('click', function() {
    change.classList.add('change__after')
    const item = document.createElement('ul')

    if(input.value >= 2 && input.value <= 10 && input.value % 2 === 0) {
      count = (input.value * input.value) / 2;
      item.style.width = (100 * input.value + 20 * (input.value - 1)) + 'px'
    } else {
      input.value = 4;
      count = 8;
      item.style.width = '460px'
    }

    let period = 60;
    const text = document.createElement('p');
    text.classList.add('duration');
    text.textContent = 'Времени осталось: ';
    container.append(text);
    const duration = document.createElement('p');
    duration.classList.add('duration');
    container.append(duration);

    const lose = document.createElement('div');
    const loseText = document.createElement('p');
    const loseButton = document.createElement('button');

    loseText.classList.add('lose__text');
    loseButton.classList.add('lose__button');
    loseText.textContent = "Время вышло";
    loseButton.textContent = "Начать заново";
    lose.append(loseText, loseButton);

    function countdown() {
      duration.innerHTML = period;

      timer = setTimeout(function tick() {
      if (period <= 0) {
        clearTimeout(timer);
        duration.remove();
        text.remove();
        item.remove();

        container.append(lose);

        loseButton.addEventListener('click', () => {
          change.classList.remove('change__after');
          item.remove();
          lose.classList.add('lose');
          gameArray.splice(0, gameArray.length);
          clearTimeout(timer);
          period = 60
        })
        firstCard = ''
        secondCard = ''
        } else {
        //каждую секунду вызываем функцию countdown
        timer = setTimeout(countdown, 1000);
        period--;
        }
      }, 0)
    }
    countdown()

    const array = shuffle(createNumbersArray(count))
    item.classList.add('item')
    container.append(item)

    for (let number of array) {
      const card = document.createElement('li')
      card.classList.add('card')
      card.textContent = number
      item.append(card)

      card.addEventListener('click', () => {
        if(card.classList.contains('open') || card.classList.contains('success')) {
          return
        }

        if (firstCard !== '' && secondCard !== '') {
          if(firstCard.textContent !== secondCard.textContent) {
              firstCard.classList.remove('open');
              secondCard.classList.remove('open');
              firstCard = '';
              secondCard = ''
          }
        }

        card.classList.toggle('open')

        if(firstCard === '') {
          firstCard = card
        } else {
            secondCard = card
        }

        if (firstCard !== '' && secondCard !== '') {
          if(firstCard.textContent === secondCard.textContent) {
            firstCard.classList.toggle('success');
            secondCard.classList.toggle('success')
            firstCard = '';
            secondCard = ''
          }
        }

        if (document.querySelectorAll('.success').length === gameArray.length) {
          let buttonSuccess = document.createElement('button')
          buttonSuccess.classList.add('button__success')
          buttonSuccess.textContent = 'Сыграть ещё раз?';
          container.append(buttonSuccess);
          lose.classList.add('lose');
          clearTimeout(timer)

          buttonSuccess.addEventListener('click', () => {
            change.classList.remove('change__after');
            item.remove();
            text.remove();
            duration.remove();
            buttonSuccess.remove();
            firstCard = '';
            secondCard = '';
            gameArray.splice(0, gameArray.length);
          })
        }
      })
    }
    input.value = ''
  });
}

document.addEventListener('DOMContentLoaded', () => {
  startGame()
})


