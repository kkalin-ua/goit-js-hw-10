// HTTP-запит
// Використовуй публічний API Rest Countries v2, а саме ресурс name, який повертає масив об'єктів країн, що задовольнили критерій пошуку. Додай мінімальне оформлення елементів інтерфейсу.

// Напиши функцію fetchCountries(name), яка робить HTTP-запит на ресурс name і повертає проміс з масивом країн - результатом запиту. Винеси її в окремий файл fetchCountries.js і зроби іменований експорт.


import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchEl = document.querySelector('#search-box');
const countryInfoEl = document.querySelector('.country-info');
const countryListEl = document.querySelector('.country-list');

const cleanMarkup = ref => (ref.innerHTML = '');

const inputHandler = e => {
  const textInput = e.target.value.trim();



  if (!textInput) {
    cleanMarkup(countryListEl);
    cleanMarkup(countryInfoEl);
    return;
  }


  fetchCountries(textInput)
    .then(data => {
      console.log(data);
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name'
        );
        return;
      }
      renderMarkup(data);
    })
    .catch(err => {
      cleanMarkup(countryListEl);
      cleanMarkup(countryInfoEl);
      Notify.failure('Oops, there is no country with that name');
    });
};

const renderMarkup = data => {
  if (data.length === 1) {
    cleanMarkup(countryListEl);
    const markupInfo = createInfoMarkup(data);
    countryInfoEl.innerHTML = markupInfo;
  } else {
    cleanMarkup(countryInfoEl);
    const markupList = createListMarkup(data);
    countryListEl.innerHTML = markupList;
  }
};

const createListMarkup = data => {
  return data
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.png}" alt="${name.official}" width="60" height="40">${name.official}</li>`
    )
    .join('');
};

const createInfoMarkup = data => {
  return data.map(
    ({ name, capital, population, flags, languages }) =>
      `<img src="${flags.png}" alt="${name.official}" width="200" height="100">
      <h1>${name.official}</h1>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p>`
  );
};

searchEl.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));