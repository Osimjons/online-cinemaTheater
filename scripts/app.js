'use strict';
let countPage = 1;
const page = '&page=';
const API_KEY = 'b4a69180-85c8-496d-b61b-e425b53940ba';
const ALTARNATE_API = 'ZY3PAB1-K824RD2-QEFMHY7-Z7739TH';
const baseURL = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/';
const TOP_POPULAR_MOVIES_URL = 'collections?type=TOP_POPULAR_MOVIES';
const SEARCH_BY_KEYWORDS =
  'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=';
const movieId = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/';

/*Сборка URL запроса */
function createURL(url, count = 1) {
  let fullUrl = baseURL + url + page + count;
  return fullUrl;
}
/*Ссылка поиска по ключевым словам  */
const seachFilmByKeywords = () => {
  const fullUrl = baseURL + SEARCH_BY_KEYWORDS + page + countPage;
  return fullUrl;
};

/*Запрос на сервер  */
async function getMovie(url) {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-API-KEY': API_KEY,
      'Content-Type': 'application/json',
    },
  });
  const respData = await response.json();
  console.log('respData: ', respData);
  showMovies(respData);
}
getMovie(createURL(TOP_POPULAR_MOVIES_URL, countPage));

/*Оконтовка рейтинга */
const getColourByrating = (ratingNum) => {
  if (ratingNum >= 7) {
    return 'green';
  } else if (ratingNum >= 5) {
    return 'orange';
  } else {
    return 'red';
  }
};

/*скрол на вверх */
const scrollToTop = () => {
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
};

/* навигация страницы */
function navigatePages() {
  const navigate = document.querySelector('.navigate');
  const navigateCount = document.querySelector('.navigate__count');
  navigate.addEventListener('click', (e) => {
    if (e.target.classList.contains('navigate__next')) {
      countPage++;
      navigateCount.textContent = countPage;
      scrollToTop();
      getMovie(createURL(TOP_POPULAR_MOVIES_URL, countPage));
    }
    if (e.target.classList.contains('navigate__prev')) {
      if (countPage <= 1) {
        return;
      }
      countPage--;
      navigateCount.textContent = countPage;
      scrollToTop();
      getMovie(createURL(TOP_POPULAR_MOVIES_URL, countPage));
    }
  });
  return countPage;
}
navigatePages();

const showMovies = (data) => {
  const movies = document.querySelector('.movies');
  movies.innerHTML = '';
  const keyToProcess =
    'films' in data ? 'films' : 'items' in data ? 'items' : null;
  data[keyToProcess].forEach((element) => {
    const movie = document.createElement('div');
    movie.classList.add('movies__movie', 'movie');
    movie.innerHTML = `
        <div class="movie__image">
          <img src="${element.posterUrlPreview}" alt="${
      element.nameRu
    }" class="movie__image-img">
          <div class="movie__image-overlay"></div>
        </div>
        <div class="movie__info">
          <div class="movie__info-title">${element.nameRu}</div>
          <ul class="movie__info-ganre">
            ${element.genres
              .map(
                (genre) =>
                  `<li class="movie__info-ganre-item"> ${genre.genre}</li>`
              )
              .join('')}
          </ul>
          <ul class="movie__info-country">
          ${element.countries
            .map(
              (country) =>
                `<li class="movie__info-country-item">${country.country}</li> `
            )
            .join('')}
          </ul>
              ${
                element.ratingKinopoisk
                  ? `<div class="movie__info-rating movie__info-rating--` +
                    getColourByrating(element.ratingKinopoisk) +
                    `">${element.ratingKinopoisk}</div>`
                  : ''
              }
        </div>
      `;
    movie.addEventListener('click', () => {
      getModalId(element.kinopoiskId);
    });
    movies.appendChild(movie);
  });
};

/*Реализация поиска по ключевым словам  */
const form = document.querySelector('.header__search');
const inputElement = document.querySelector('.header__search-input');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const apiSearchUrl = `${SEARCH_BY_KEYWORDS}${inputElement.value}`;
  if (inputElement.value.trim().length > 0) {
    console.log('apiSearchUrl: ', apiSearchUrl);
    getMovie(apiSearchUrl);
  }
});

/*Реализация модального окна */

const modal = document.querySelector('.modal');

async function getModal(url) {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-API-KEY': API_KEY,
      'Content-Type': 'application/json',
    },
  });
  const respData = await response.json();
  showModal(respData);
}

function getModalId(id) {
  const idUrl = movieId + id;
  getModal(idUrl);
}

function showModal(data) {
  modal.classList.add('active');
  document.body.classList.add('no-scroll');
  modal.innerHTML = `
<div class="container">
  <div class="modal__wrapper">
    <img class="modal__img" src=${data.posterUrl} alt="${data.nameRu}">
    <div class="modal__header">
      <h1 class="modal__header-tilte">${data.nameRu}</h1>
    </div>
    <div>
      <h2 class="modal__header-year">Год: ${data.year}</h2>
    </div>
    <div class="modal__info">
      <div class="modal__info-genre">Жанр: ${data.genres
        .map((genre) => {
          return (
            '<span class="movie__info-ganre-item">' + genre.genre + '</span>'
          );
        })
        .join(' ')}
      </div>
      <div class="modal__info-genre">Страна: ${data.countries
        .map((country) => {
          return (
            '<span class="movie__info-ganre-item">' +
            country.country +
            '</span>'
          );
        })
        .join(' ')}
      </div>
    ${
      data.filmLength
        ? `<div class="modal__info-length"><span>Продолжительность: ${data.filmLength} мин.</span></div>`
        : ''
    } 
      <div class="modal__info-links">Сайт: <a target="_blank" href=${
        data.webUrl
      }
          class="modal__info-link movie__info-ganre-item">${
            data.webUrl
          }</a></div>
      <div class="modal__info-desc">
        <p>${data.description}</p>
      </div>
    </div>
    <div class="modal__close">
      <button class="modal__close-Btn">Закрыть</button>
    </div>
  </div>
</div>
  `;
  console.log(data);
  const modalClose = document.querySelector('.modal__close-Btn');
  modalClose.addEventListener('click', (e) => {
    document.body.classList.remove('no-scroll');
    modal.classList.remove('active');
  });
}
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    document.body.classList.remove('no-scroll');
    modal.classList.remove('active');
  }
});

/*
// 'new ArrayBuffer'.split('')
const setLi = (genre) => {
  return `<li class="movie__info-ganre-item"> ${genre}</li>`;
};

for (let i = 0; i <= ['drama'].length; i++) {
  setLi(['drama'][i]);
}


['drama'][`<li class="movie__info-ganre-item">drama</li>`];

const setLi = (genre) => {
  return `<li class="movie__info-ganre-item"> ${genre}</li>`;
};

const genres = ['drama'];
const newArr = [`<li class="movie__info-ganre-item">drama</li>`];

for (let i = 0; i <= genres.length; i++) {
  const li = setLi(genres[i]);
  newArr.push(li);
}



[
    {
        genre: 'drama'
    }
].map((element) => element.genre)




const setLi = (genre) => {
    return `<li class="movie__info-ganre-item"> ${genre.genre}</li>`
}

const newArr = element.genres.map(setLi).join('')

<ul class="movie__info-ganre">
    ${newArr}
</ul>



['drama']
[`<li class="movie__info-ganre-item">drama</li>`]

const setLi = (genre) => {
    return `<li class="movie__info-ganre-item"> ${genre}</li>`
}

const genres = ['drama']
const newArr = [`<li class="movie__info-ganre-item">drama</li>`]

for (let i = 0; i <= genres.length; i++) {
    const li = setLi(genres[i])
    newArr.push(li)
}
*/
