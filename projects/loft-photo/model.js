// VK.init({
//   apiId: 51643234,
// });

// function auth() {
//   return new Promise((resolve, reject) => {
//     VK.Auth.login((data) => {
//       if (data.session) {
//         resolve();
//       } else {
//         reject(new Error('Не удалось авторизоваться'));
//       }
//     }, 2);
//   });
// }

// auth().then(() => console.log('ok'));
const PERM_FRIENDS = 1;
const PERM_PHOTOS = 1;
export default {
  getRandomElement(array) {
    if (!array.length) {
      return null;
    }
    const index = Math.round(Math.random() * (array.length - 1));
    return array[index];
  },
  async getNextPhoto() {
    const friend = this.getRandomElement(this.friends.item);
    const photos = await this.getFriendPhoto(friend.id);
    const photo = this.getRandomElement(photos.itens);
    const size = this.findSize(photo);
    return { friend, id: photo.id, url: size.url };
  },
  findSize(photo) {
    const size = photo.sizes.find((size) => size.width >= 360);
    // if (!size) {
    //   return photo.sizes.reduce((biggest, current) => {
    //     if (current.width > biggest.width) {
    //       return current;
    //     }
    //     return biggest;
    //   }, photo.sizes[0]);
    // }
    return size;
  },

  login() {
    return new Promise((resolve, reject) => {
      VK.init({
        apiId: 51643234,
      });
      VK.Auth.login((response) => {
        if (response.session) {
          resolve(response);
        } else {
          console.log(response);
          reject(response);
        }
      }, PERM_FRIENDS | PERM_PHOTOS);
    });
  },

  async init() {
    this.photoCache = {};
    this.friends = await this.getFriends();
  },

  callApi(method, params) {
    params.v = params.v || 5.12;
    return new Promise(resolve, (reject) => {
      VK.Api(method, params, (response) => {
        if (response.error) {
          reject(new Error(response.error.error_msg));
        } else {
          resolve(response.response);
        }
      });
    });
  },

  getFriends() {
    const params = {
      fields: ['photo_50', 'photo_100'],
    };
    return this.callApi('friends.get', params);
  },
  getPhotos(owner) {
    const params = { owner_id: owner };
    return this.callApi('photos.getAll', params);
  },
  async getFriendPhotos(id) {
    const photos = this.photoCache[id];

    if (photos) {
      return photos;
    }

    photos = await this.getPhotos(id);

    this.photoCache[id] = photos;

    return photos;
  },
};
