import pages from './pages';
import('./styles.css');

const pageNames = ['login', 'main', 'profile'];

document.addEventListener('click', () => {
  const page = model.getRandomElement(pageNames);
  pages.openPage(page);
});
