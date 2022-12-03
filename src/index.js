import { ImagesApi } from './imagesApi';
import { ImagesApi } from './imagesApi';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  formEl: document.querySelector('#search-form'),
  galleryListEl: document.querySelector('.gallery'),
  btnLoadMoreEl: document.querySelector('.load-more'),
};

refs.formEl.addEventListener('submit', onSearch);
refs.btnLoadMoreEl.addEventListener('click', onLoadMore);

const imagesApi = new ImagesApi();
onLoadHidden();

function onSearch(e) {
  e.preventDefault();
  imagesApi.query = e.currentTarget.elements.searchQuery.value.trim();
  imagesApi.resetPage();
  if (!imagesApi.query) {
    Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  imagesApi.getImages().then(data => {
    if (!data.hits.length) {
      Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    const arrImg = data.hits;
    console.log(arrImg);

    renderGallery(arrImg);
  });
}

function renderGallery(arrImg) {
  const imgsMarkup = arrImg
    .map(
      ({
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
            <img src="${largeImageURL}" alt="${tags}" loading="lazy" width="400" height="400">
            <div class="info">
                <p class="info-item">
                    <b>Likes: ${likes}</b>
                </p>
                <p class="info-item">
                    <b>Views: ${views}</b>
                </p>
                <p class="info-item">
                    <b>Comments: ${comments}</b>
                </p>
                <p class="info-item">
                    <b>Downloads: ${downloads}</b>
                </p>
            </div>
        </div>`
    )
    .join('');

  refs.galleryListEl.insertAdjacentHTML('beforeend', imgsMarkup);
  onLoadHidden();
}

function onLoadMore() {
  imagesApi.getImages().then(data => {
    if (!data.hits.length) {
      Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    renderGallery(data.hits);
    onLoadHidden();
  });
}
function onLoadHidden() {
  refs.btnLoadMoreEl.classList.toggle('is-hidden');
}
