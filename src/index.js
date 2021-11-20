import './css/styles.css';
import {fetchCountries} from './fetchCountries';
import debounce from 'lodash.debounce';
import {Notify} from 'notiflix';

const DEBOUNCE_DELAY = 300;
const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

refs.input.insertAdjacentHTML('beforebegin', markup());

function markup() {
  return '<span class="text">Please enter the country name</span>'
}

refs.input.addEventListener('input', debounce(whenEnteringSearch, DEBOUNCE_DELAY));

function whenEnteringSearch() {
  fetchCountries(refs.input.value)
  .then(renderMarkup)
  .catch(catchError);
};

function renderMarkup(e) {
  refs.list.innerHTML = '';
  refs.info.innerHTML = '';

  if (e.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }
  if (e.length === 1) {
    return refs.info.innerHTML = oneElementMarkup(e[0]);
  }
  return refs.list.innerHTML = setOfElementsMarkup(e);
}

function setOfElementsMarkup(e) {
  return e.map(({ name, flags }) => 
    ` 
        <li class="country-list__item"> 
          <img class="country-list__img" src="${flags.svg}" alt="${name}" width="45" height="30">
          <span class="country-list__text"> ${name.official}</span>
        </li>
        `
    )
    .join('');
}

function oneElementMarkup(e) {
  const { name, capital, population, flags, languages } = e;
  const langCountr = Object.values(languages).join(', ');
  return `

          <div class="country-info__box">
            <img class="country-info__img" src="${flags.svg}" alt="${name.official}" width="45" height="30"/> 
            <span class="country-info__name">${name.official}</span>
          </div>
          <ul class="country-info__list">
            <li class="country-info__item">Capital:
              <span class="country-info__text" > ${capital}</span>
            </li>
            <li class="country-info__item">Population:
              <span class="country-info__text"> ${population}</span>
            </li>
            <li class="country-info__item">Languages:
              <span class="country-info__text"> ${langCountr}</span>
            </li>
          </ul>
  `
}

function catchError() {
    Notify.failure('Oops, there is no country with that name');
  }