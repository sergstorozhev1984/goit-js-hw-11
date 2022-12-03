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
  clearMarkup();
  if (!imagesApi.query) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    onLoadHidden();
    return;
  }
  imagesApi.getImages().then(data => {
    if (!data.hits.length) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      clearMarkup();
      return;
    }
    const arrHits = data.hits;
    // console.log(data.totalHits);
    // console.log(arrHits);

    renderGallery(arrHits);
    Notify.success(`Hooray! We found ${data.totalHits} images.`)
  });
}

function renderGallery(arrHits) {
  const imgsMarkup = arrHits
    .map(
      ({
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
            <img src="${largeImageURL}" alt="${tags}" loading="lazy" width="320" height="212">
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
  onLoadShown();
}

function onLoadMore() {
  imagesApi.getImages().then(data => {
    console.log(data);
    if (!data.hits.length) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    if (data.total === data.totalHits) {
      renderGallery(data.hits);
      onLoadHidden();
      Notify.info("We're sorry, but you've reached the end of search results.");
      return;
    } else {
      renderGallery(data.hits);
      onLoadShown();
    }
  });
}
function onLoadHidden() {
  refs.btnLoadMoreEl.classList.add('is-hidden');
}
function onLoadShown() {
  refs.btnLoadMoreEl.classList.remove('is-hidden');
}
function clearMarkup() {
  refs.galleryListEl.innerHTML = '';
  return onLoadHidden();
}
