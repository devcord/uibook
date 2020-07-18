import './assets/scss/main.css';
import { install } from './install';

class UIBook {}

UIBook.installed = false;
UIBook.install = install;
export default UIBook;