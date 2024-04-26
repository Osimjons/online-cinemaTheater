'use strict';
let countPage = 1;

const API_KEY = 'b4a69180-85c8-496d-b61b-e425b53940ba';
const ALTARNATE_API = 'ZY3PAB1-K824RD2-QEFMHY7-Z7739TH';
const baseURL = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/';
const TOP_POPULAR_MOVIES_URL = 'collections?type=TOP_POPULAR_MOVIES&page=';

/*Сборка URL запроса */
function createURL(url, count) {
  let fullUrl = baseURL + url + count;
  return fullUrl;
}

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

/*Оонтовка рейтинга */
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
  data.items.forEach((element) => {
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
          <div class="movie__info-country">${element.countries[0].country}</div>
              ${
                element.ratingKinopoisk
                  ? `<div class="movie__info-rating movie__info-rating--` +
                    getColourByrating(element.ratingKinopoisk) +
                    `">${element.ratingKinopoisk}</div>`
                  : ''
              }
        </div>
      `;
    movies.appendChild(movie);
  });
};
