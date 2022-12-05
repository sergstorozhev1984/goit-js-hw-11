import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
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
let currentPage = 1;
let totalPages = 0;
const limit = 40;
let gallery = '';


async function onSearch(e) {
  e.preventDefault();
  imagesApi.query = e.currentTarget.elements.searchQuery.value.trim();
  imagesApi.resetPage();
  currentPage = 1;
  clearMarkup();
  if (!imagesApi.query) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    onLoadHidden();
    return;
  }
  const data = await imagesApi.getImages();

  totalPages = Math.ceil(data.totalHits / limit);
  if (!data.hits.length) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    clearMarkup();
    return;
  }
  const arrHits = data.hits;

  renderGallery(arrHits);
    Notify.success(`Hooray! We found ${data.totalHits} images.`);
    gallery = new SimpleLightbox('.gallery a');
}

function renderGallery(arrHits) {
  const imgsMarkup = arrHits
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
            <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" ></a>
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
        `
    )
    .join('');

  refs.galleryListEl.insertAdjacentHTML('beforeend', imgsMarkup);
  onLoadShown();
}

async function onLoadMore() {
  const data = await imagesApi.getImages();
    renderGallery(data.hits);
    gallery.refresh();
    
  if (currentPage < totalPages) {
    currentPage += 1;

    onLoadShown();
    // console.log(currentPage);
    console.log(totalPages, currentPage);
  } else if (totalPages === currentPage) {
    onLoadHidden();
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
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

