import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/';
const key = '31736182-1e49e5184d5967b35aa45da96';

export class ImagesApi {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }


  getImages() {
    return axios
      .get(
        `${BASE_URL}?key=${key}&q=${this.searchQuery}&image_type='photo'&orientation='horizontal'&safesearch=true&per_page=40&page=${this.page}`
      )
      .then(res => {
        this.page += 1;
        // console.log(res.data.hits);
        return res.data;
      })
      .catch (error=>
      //console.warn(`${error}`);
      console.log(error));
  }
  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  resetPage() {
    this.page = 1;
  }


  // async getImages() {
  //   try {
  //     const res = await axios
  //       .get(
  //         `${BASE_URL}?key=${key}&q=${this.searchQuery}&image_type='photo'&orientation='horizontal'&safesearch=true&per_page=200&page=${this.page}`
  //       );
  //     this.page += 1;
  //   // console.log(res.data);
  //     return res.data;
      
  //   }
  //   catch (error) {
  //     //console.warn(`${error}`);
  //     console.log(error);
  //   }
  // }
    
      
    
  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  resetPage() {
    this.page = 1;
  }
}



// getImages() {
//     return axios
//       .get(
//         `${BASE_URL}?key=${key}&q=${this.searchQuery}&image_type='photo'&orientation='horizontal'&safesearch=true&per_page=50&page=${this.page}`
//       )
//       .then(res => {
//         this.page += 1;
//         // console.log(res.data.hits);
//         return res.data;
//       });
//   }
//   get query() {
//     return this.searchQuery;
//   }
//   set query(newQuery) {
//     this.searchQuery = newQuery;
//   }

//   resetPage() {
//     this.page = 1;
//   }
// }
