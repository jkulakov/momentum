const time = document.querySelector('.time');
const dateElement = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
const userName = document.querySelector('.name');
const body = document.querySelector('body');
const nextSlide = document.querySelector('.slide-next');
const prevSlide = document.querySelector('.slide-prev');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const city = document.querySelector('.city');
const changeQuote = document.querySelector('.change-quote');
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const langButton = document.querySelectorAll('.language_img');
const playBtn = document.querySelector('.play');
let audioPlayList = document.querySelector('.play-list');

let playListItem;
let playListBtn;
let currentTimeBig = 0;

const placeholder = {
  ru: '[Введите свое имя]',
  en: '[Enter your name]'
}

let userCity = city.value;
let randomNum;
let currentLang;

currentLang = localStorage.getItem('lang');
if(currentLang == '') { currentLang = 'ru'; }

userName.placeholder = placeholder[currentLang];


// //////////////////////////////// Привествие и время дня \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

function getTimeOfDay() {
  const date = new Date();
  const hours = date.getHours();
  let timeOfDay = '';

  if(hours >= 0 && hours < 6) timeOfDay = 'night';
  else if(hours >= 6 && hours < 12) timeOfDay = 'morning';
  else if(hours >= 12 && hours < 18) timeOfDay = 'afternoon';
  else if(hours >= 18 && hours < 24) timeOfDay = 'evening';

  return timeOfDay;
}

function showGreeting() {
  const timeOfDay = getTimeOfDay();
  let greet = ''; if(currentLang == 'en') greet = 'Good';

  const langs = {
    ru: {
      night: 'Доброй ночи',
      morning: 'Доброе утро',
      afternoon: 'Добрый день',
      evening: 'Добрый вечер'
    },
    en: {
      night: 'night',
      morning: 'morning',
      afternoon: 'afternoon',
      evening: 'evening'
    }
  };

  greeting.textContent = `${greet} ${langs[currentLang][timeOfDay]}`;
}

function showTime() {
  const date = new Date();
  time.innerHTML = date.toLocaleTimeString();
  showDate();
  showGreeting();
  setTimeout(showTime, 1000);
}

function showDate() {
  const date = new Date();
  let lang = 'ru-RU'; if(currentLang == 'en') { lang = 'en-US'; }
  const options = {month: 'long', day: 'numeric', weekday: 'long', timeZone: 'Europe/Moscow'};
  const currentDate = date.toLocaleDateString(lang, options);
  dateElement.innerHTML = currentDate;
}


// //////////////////////////////// Фон \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

function getRandomNum() {
  let backGroundNum = Math.floor(Math.random() * (20 - 1 + 1) + 1);
  return String(backGroundNum).padStart(2, '0');
};

randomNum = getRandomNum();

function setBg() {
  const timeOfDay = getTimeOfDay();
  const img = new Image();
  img.src = `https://raw.githubusercontent.com/jkulakov/stage1-tasks/main/images/${timeOfDay}/${randomNum}.jpg`;
  img.onload = () => {      
    body.style.backgroundImage = `url('${img.src}')`;
  }; 
}

function getSlideNext() {
  randomNum++;
  if(randomNum < 10) randomNum = String(randomNum).padStart(2, '0');
  if(randomNum == 21) randomNum = '01';
  setBg();
}

function getSlidePrev() {
  randomNum--;
  if(randomNum < 10) randomNum = String(randomNum).padStart(2, '0');
  if(randomNum == 0) randomNum = '20';
  setBg();
}

showTime();
setBg();

nextSlide.addEventListener('click', getSlideNext);
prevSlide.addEventListener('click', getSlidePrev);

// //////////////////////////////// Работа с localStorage \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

function setLocalStorage() {
  localStorage.setItem('name', userName.value);
  localStorage.setItem('city', city.value);
  localStorage.setItem('lang', currentLang);
}

window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage() {
  if(localStorage.getItem('name')) {
    userName.value = localStorage.getItem('name');
  }
  if(localStorage.getItem('city')) {
    city.value = localStorage.getItem('city');
  }
}

window.addEventListener('load', getLocalStorage);

// //////////////////////////////// Погода \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

async function getWeather() {

  userCity = city.value;
  if(userCity == '') { 
    getLocalStorage();
    userCity = city.value; 
  }

  const langs = {
    ru: {
      wind: 'Cкорость ветра',
      speed: 'м/с',
      humidity: 'Влажность'
    },
    en: {
      wind: 'Wind speed',
      speed: 'm/s',
      humidity: 'Humidity'
    },
  };


  const url = `https://api.openweathermap.org/data/2.5/weather?q=${userCity}&lang=${currentLang}&appid=ae857774d54329214fcbb5ae616bea29&units=metric`;
  const res = await fetch(url);
  const data = await res.json(); 

  if(data.cod == '404' || city.value == '') {
    weatherDescription.textContent = `Error! ${data.message} for "${city.value}"`;
    wind.textContent = '';
    humidity.textContent = '';
    weatherIcon.className = '';
    temperature.textContent = '';
  } else {
  weatherIcon.className = 'weather-icon owf';
  weatherIcon.classList.add(`owf-${data.weather[0].id}`);
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  weatherDescription.textContent = data.weather[0].description;
  wind.textContent = `${langs[currentLang]['wind']}: ${Math.round(data.wind.speed)} ${langs[currentLang]['speed']}`;
  humidity.textContent = `${langs[currentLang]['humidity']}: ${Math.round(data.main.humidity)}%`;
  }
}

document.addEventListener('DOMContentLoaded', getWeather);
// document.addEventListener('DOMContentLoaded', getLocalStorage);
city.addEventListener('change', getWeather);


// //////////////////////////////// Цитата \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


async function getQuotes() {  
  const quotes = 'assets/data.json';
  const res = await fetch(quotes);
  const data = await res.json(); 

  let langData = data[0][currentLang];

  let quotNum = Math.floor(Math.random() * ((langData.length-1) - 1 + 1) + 1);
  quote.textContent = langData[quotNum].quote;
  author.textContent = langData[quotNum].author;
}

changeQuote.addEventListener('click', getQuotes);
document.addEventListener('DOMContentLoaded', getQuotes);

// //////////////////////////////// Перевод на 2 языка \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// langButton.addEventListener('click', changeLang);

function changeLang() {

  for (let i = 0; i<langButton.length; i++){
    if (langButton[i].id == localStorage.getItem('lang')) {
      langButton[i].classList.add('language_img-active');
    } else {
      langButton[i].classList.remove('language_img-active');
    }
}

  for (let i = 0; i<langButton.length; i++){
    langButton[i].addEventListener('click', function(event) {
        let ev = event.target;
        if(ev.classList.id == currentLang) {
            return;
        }
        langButton.forEach((obj) => obj.classList.remove('language_img-active'));
        ev.classList.add('language_img-active');
        localStorage.setItem('lang', ev.id);
        currentLang = ev.id;
        userName.placeholder = placeholder[currentLang];
        showGreeting();
        getWeather();
        showDate();
        getQuotes();
    });
  }
}


document.addEventListener('DOMContentLoaded', changeLang);

// //////////////////////////////// Плеер \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

let isPlay = false;

import playList from "./playList.js";
const audio = new Audio();


function createPlayList() {
  audioPlayList.innerHTML = '';
  playList.forEach(function (el) {
  const li = document.createElement('li');
  li.classList.add('play-item');
  li.innerHTML = el.title;
  audioPlayList.append(li);

  const btn = document.createElement('span');
  btn.classList.add('play');
  btn.classList.add('play-item-btn');

  li.append(btn);
  }
  );

  playListItem =  document.querySelectorAll('.play-item');
  playListBtn = document.querySelectorAll('.play-item-btn');

}


function playAudio() {

  createPlayList();

  playBtn.classList.toggle('pause');
  let playNum = 0;

  if(playBtn.classList == 'play player-icon') {
    audio.pause();
    createPlayList();
    currentTimeBig = audio.currentTime;
    isPlay = false;
  } else {
    isPlay = true;
    audio.src = playList[playNum].src;
    audio.currentTime = currentTimeBig;
    playListItem[playNum].classList.add('active-item');
    audio.play();
  }
}


playBtn.addEventListener('click', playAudio);
