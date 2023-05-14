import pages from './pages';
import('./styles.css');
import mainPage from './mainpage';
import loginPage from './loginPage';
const pageNames = ['login', 'main', 'profile'];

pages.openPage('login');
loginPage.handleEvents();
mainPage.handleEvents();
