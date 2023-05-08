const pagesMap = {
  login: '.page-login',
  main: '.page-main',
  profile: '.page-profile',
};
let page;
export default {
  openPage(name) {
    const currentClass = pagesMap[name];
    let element = document.querySelector(currentClass);
    page?.classList.add('hidden');
    page = element;
    page.classList.remove('hidden');
  },
};

//   pages.openPage('main'); // сделать видимым элемент с классом page-main
// pages.openPage('profile'); // сделать видимым элемент с классом page-profile, а page-main скрыть
// pages.openPage('login'); // сделать видимым элемент с классом page-login, а page-profile скрыть
