import { showToast } from './ui.js';
import { saveCadastro, getCadastros } from './storage.js';
import { validateForm } from './validation.js';

function el(html){
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}

export function renderHome(container){
  const node = el(`
    <section>
      <div class="card">
        <h2>Bem-vindo à ONG Esperança</h2>
        <p class="lead">Esta é uma simulação SPA da terceira entrega.</p>
        <a href="/projetos" data-link class="btn">Ver projetos</a>
      </div>
    </section>
  `);
  container.appendChild(node);
}

export function renderProjects(container){
  const node = el(`<section><h2>Projetos</h2><div id="projects-list" class="grid"></div></section>`);
  container.appendChild(node);
  const projects = [
    {id:1,title:'Educação Infantil',cat:'educacao',desc:'Apoio escolar.'},
    {id:2,title:'Saúde Comunitária',cat:'saude',desc:'Campanhas de saúde.'},
    {id:3,title:'Oficinas Profissionais',cat:'capacitacao',desc:'Cursos práticos.'}
  ];
  const list = node.querySelector('#projects-list');
  projects.forEach(p=>{
    const card = el(`<article class="card"><h3>${p.title}</h3><p>${p.desc}</p><p><strong>Categoria:</strong> ${p.cat}</p><a href="/cadastro" data-link class="btn">Participar</a></article>`);
    list.appendChild(card);
  });
}

export function renderCadastro(container){
  const node = el(`
    <section>
      <h2>Cadastro</h2>
      <form id="formCadastro" class="card" novalidate>
        <div class="form-grid">
          <label>Nome completo<input name="nome" id="nome" required></label>
          <label>Email<input type="email" name="email" id="email" required></label>
          <label>CPF<input name="cpf" id="cpf" required></label>
          <label>Telefone<input name="telefone" id="telefone" required></label>
          <label>Data de Nascimento<input type="date" name="nascimento" id="nascimento" required></label>
        </div>
        <div style="margin-top:12px"><button type="submit" class="btn">Enviar</button></div>
      </form>
      <section class="card"><h3>Cadastros anteriores</h3><div id="cadastros-list"></div></section>
    </section>
  `);
  container.appendChild(node);

  const form = node.querySelector('#formCadastro');
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const errors = validateForm(data);
    form.querySelectorAll('.error-message').forEach(n=>n.remove());
    form.querySelectorAll('[aria-invalid]').forEach(n=>n.removeAttribute('aria-invalid'));
    if(Object.keys(errors).length){
      Object.entries(errors).forEach(([field,msg])=>{
        const input = form.querySelector('[name="'+field+'"]');
        if(input){ input.classList.add('input-error'); input.setAttribute('aria-invalid','true'); const err = document.createElement('div'); err.className='error-message'; err.textContent = msg; input.parentNode.appendChild(err); }
      });
      showToast('Corrija os campos destacados', {type:'danger'});
      return;
    }
    if(data.cpf.replace(/\D/g,'').length !== 11){ showToast('CPF inválido (deve ter 11 dígitos)', {type:'danger'}); return; }
    saveCadastro(data);
    showToast('Cadastro salvo (simulação)', {type:'success'});
    form.reset();
    const list = node.querySelector('#cadastros-list');
    list.innerHTML = '';
    const cadastros = getCadastros();
    cadastros.forEach(c=>{ const item = document.createElement('div'); item.textContent = c.nome + ' — ' + c.email; list.appendChild(item); });
  });
  const list = node.querySelector('#cadastros-list');
  const cadastros = getCadastros();
  cadastros.forEach(c=>{ const item = document.createElement('div'); item.textContent = c.nome + ' — ' + c.email; list.appendChild(item); });
}

export function renderTransparencia(container){
  const node = el(`<section><h2>Transparência</h2><div class="card"><p>Relatórios e prestação de contas (simulação).</p></div></section>`);
  container.appendChild(node);
}
