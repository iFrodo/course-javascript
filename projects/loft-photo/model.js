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
const PERM_FRIENDS = 2;
const PERM_PHOTOS = 4;

export default {
  async getRandomElement(e) {
    if (!e.length) {
      return null;
    }
    const index = Math.round(Math.random() * (e.length - 1));
    return e[index];
  },
  async getNextPhoto() {
    const friend = await this.getRandomElement(this.friends.items);
    const photos = await this.getFriendPhotos(friend.id);
    const photo = await this.getRandomElement(photos.items);
    const size = await this.findSize(photo);
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
  async init() {
    this.photoCache = {};
    this.friends = await this.getFriends();
    [this.me] = await this.getUsers();
  },
  login() {
    return new Promise((resolve, reject) => {
      VK.init({
        apiId: 51661177,
      });
      VK.Auth.login((response) => {
        if (response.session) {
          this.token = response.session.sid;
          resolve(response);
        } else {
          console.error(response);
          reject(response);
        }
      }, PERM_FRIENDS | PERM_PHOTOS);
    });
  },
  logout() {},

  getUsers(ids) {
    const params = { fields: ['photo_50, photo_100'] };
    if (ids) {
      params.user_ids = ids;
    }
    return this.callApi('users.get', params);
  },
  callApi(method, params) {
    params.v = params.v || 5.131;

    return new Promise((resolve, reject) => {
      VK.api(method, params, (response) => {
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
    let photos = this.photoCache[id];

    if (photos) {
      return photos;
    }
    photos = await this.getPhotos(id);

    this.photoCache[id] = photos;

    return photos;
  },
  async callServer(method, queryParams, body) {
    queryParams = {
      ...queryParams,
      method,
    };
    const query = Object.entries(queryParams)
      .reduce((all, [name, value]) => {
        all.push(`${name}=${encodeURIComponent(value)}`);
        return all;
      }, [])
      .join('&');
    const params = {
      headers: {
        vk_token: this.token,
      },
    };
    if (body) {
      params.method = 'POST';
      params.body = JSON.stringify(body);
    }

    const response = await fetch(`/loft-photo/api/?${query}`, params);

    return response.json();
  },
  async like(photo) {
    return this.callServer('like', { photo });
  },

  async photoStats(photo) {
    return this.callServer('photoStats', { photo });
  },

  async getComments(photo) {
    return await this.callServer('getComments', { photo });
  },

  async postComment(photo, text) {
    return await this.callServer('postComment', { photo }, { text });
  },
};
