import { router, navigateTo } from './router.js';
document.addEventListener('click', (e)=>{
  const a = e.target.closest('a[data-link]');
  if(a){
    e.preventDefault();
    const url = a.getAttribute('href');
    navigateTo(url);
  }
});
router();
