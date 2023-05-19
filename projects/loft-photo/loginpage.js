import model from './model';
import pages from './pages';
import mainPage from './mainpage';

export default {
  handleEvents() {
    document.querySelector('.page-login-button').addEventListener('click',async () => {
      await model.login();
      await model.init();

       pages.openPage('main');
      await mainPage.getNextPhoto()
    })
    },
};
