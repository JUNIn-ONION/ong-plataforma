import { renderHome } from './templates.js';
import { renderProjects } from './templates.js';
import { renderCadastro } from './templates.js';
import { renderTransparencia } from './templates.js';

const routes = {
  '/': renderHome,
  '/projetos': renderProjects,
  '/cadastro': renderCadastro,
  '/transparencia': renderTransparencia
};

export function navigateTo(url) {
  history.pushState(null, null, url);
  router();
}

export function router() {
  const path = location.pathname;
  const route = routes[path] || routes['/'];
  const app = document.getElementById('app');
  app.innerHTML = '';
  route(app);
  app.focus();
}
window.addEventListener('popstate', router);
