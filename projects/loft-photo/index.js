import pages from './pages';
import('./styles.css');
import mainPage from './mainpage';
import loginPage from './loginpage';
const pageNames = ['login', 'main', 'profile'];
import profilePage from './profilepage';

pages.openPage('login');
loginPage.handleEvents();
mainPage.handleEvents();
profilePage.handleEvents();
