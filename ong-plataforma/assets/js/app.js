
/* app.js - SPA + templates + validation + storage bundled for local use */
/* ===== Router ===== */
(function(){
  const routes = {
    '#/': renderHome,
    '#/projetos': renderProjects,
    '#/cadastro': renderCadastro,
    '#/transparencia': renderTransparencia
  };

  function router(){
    const hash = location.hash || '#/';
    const route = routes[hash] || routes['#/'];
    const app = document.getElementById('app');
    if(!app) return;
    app.innerHTML = '';
    route(app);
    document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());
    document.documentElement.classList.add('show-focus');
  }

  function navigateToHash(h){
    location.hash = h;
  }

  /* link delegation */
  document.addEventListener('click', function(e){
    const a = e.target.closest('a[data-link]');
    if(a){
      e.preventDefault();
      const href = a.getAttribute('href');
      if(href.startsWith('#')) navigateToHash(href);
      else navigateToHash('#' + href);
    }
  });

  window.addEventListener('hashchange', router);
  window.addEventListener('DOMContentLoaded', function(){
    // init hamburger
    var hb = document.getElementById('hamburger');
    if(hb){ hb.addEventListener('click', function(){ document.getElementById('nav').classList.toggle('open'); this.classList.toggle('is-active'); }); }
    router();
  });

  /* ===== Storage ===== */
  const STORAGE_KEY = 'ong:cadastros:v3';
  function saveCadastro(data){ const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); list.unshift(Object.assign({id:Date.now()}, data)); localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }
  function getCadastros(){ return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }

  /* ===== UI helpers ===== */
  function showToast(msg, opts){ var c = document.getElementById('toast-container'); if(!c){ c = document.createElement('div'); c.id='toast-container'; c.setAttribute('aria-live','polite'); document.body.appendChild(c);} var d=document.createElement('div'); d.className='toast'; d.textContent=msg; c.appendChild(d); setTimeout(function(){ d.remove(); if(c.children.length===0) c.remove(); }, 3500); }

  function showModal(title, text){ var modal=document.getElementById('modal'); if(!modal) return; modal.setAttribute('aria-hidden','false'); modal.querySelector('#modal-title').textContent = title; modal.querySelector('#modal-text').textContent = text; modal.querySelector('.modal-close').addEventListener('click', function(){ modal.setAttribute('aria-hidden','true'); }); }

  /* ===== Validation ===== */
  function validateFormData(data){
    var errors = {};
    if(!data.nome || data.nome.trim().length < 3) errors.nome = 'Nome muito curto';
    if(!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) errors.email = 'Email inválido';
    if(!data.cpf || data.cpf.replace(/\D/g,'').length !== 11) errors.cpf = 'CPF deve ter 11 dígitos';
    if(!data.telefone || data.telefone.replace(/\D/g,'').length < 10) errors.telefone = 'Telefone inválido';
    if(data.nascimento){ var born = new Date(data.nascimento); var age = new Date().getFullYear() - born.getFullYear(); if(age < 16) errors.nascimento = 'É necessário ter ao menos 16 anos'; }
    return errors;
  }

  /* ===== Templates / Pages ===== */
  function el(html){ var t=document.createElement('template'); t.innerHTML=html.trim(); return t.content.firstElementChild; }

  function renderHome(container){
    var node = el('<section><div class="card"><h2>Bem-vindo à ONG Esperança</h2><p class="lead">Versão v3 — SPA local com validação e storage.</p><p><a href="#/projetos" data-link class="btn btn-primary">Ver projetos</a></p></div></section>');
    container.appendChild(node);
  }

  function renderProjects(container){
    var node = el('<section><h2>Projetos</h2><div id="projects-list" class="cards"></div></section>');
    container.appendChild(node);
    var projects = [
      {id:1,title:'Educação Infantil',cat:'educacao',desc:'Apoio escolar para 200 crianças.'},
      {id:2,title:'Saúde Comunitária',cat:'saude',desc:'Campanhas de saúde.'},
      {id:3,title:'Oficinas Profissionais',cat:'capacitacao',desc:'Cursos práticos.'}
    ];
    var list = node.querySelector('#projects-list');
    projects.forEach(function(p){
      var card = el('<article class="card"><h3>'+p.title+'</h3><p class="muted">'+p.desc+'</p><p><strong>Categoria:</strong> '+p.cat+'</p><p><a href="#/cadastro" data-link class="btn btn-primary">Participar</a> <span class="badge">'+p.cat+'</span></p></article>');
      list.appendChild(card);
    });
  }

  function renderCadastro(container){
    var node = el('<section><h2>Cadastro</h2><form id="formCadastro" class="card" novalidate><div class="form-grid"><label>Nome completo<input name="nome" id="nome" required></label><label>Email<input type="email" name="email" id="email" required></label><label>CPF<input name="cpf" id="cpf" required placeholder="000.000.000-00"></label><label>Telefone<input name="telefone" id="telefone" required placeholder="(00) 00000-0000"></label><label>Data de Nascimento<input type="date" name="nascimento" id="nascimento" required></label></div><div style="margin-top:12px"><button type="submit" class="btn btn-primary">Enviar</button> <button type="reset" class="btn btn-ghost">Limpar</button></div></form><section class="card"><h3>Cadastros anteriores</h3><div id="cadastros-list"></div></section></section>');
    container.appendChild(node);

    var form = node.querySelector('#formCadastro');
    function clearErrors(formEl){ formEl.querySelectorAll('.error-message').forEach(function(n){ n.remove(); }); formEl.querySelectorAll('[aria-invalid]').forEach(function(n){ n.removeAttribute('aria-invalid'); n.classList.remove('input-error'); }); }

    form.addEventListener('submit', function(e){
      e.preventDefault();
      clearErrors(form);
      var data = {}; new FormData(form).forEach(function(v,k){ data[k]=v; });
      var errors = validateFormData(data);
      if(Object.keys(errors).length){
        Object.keys(errors).forEach(function(field){
          var input = form.querySelector('[name="'+field+'"]');
          if(input){ input.classList.add('input-error'); input.setAttribute('aria-invalid','true'); var err = document.createElement('div'); err.className='error-message'; err.textContent = errors[field]; input.parentNode.appendChild(err); }
        });
        showToast('Corrija os campos destacados');
        return;
      }
      // consistency example: CPF digits and email domain
      if(data.cpf.replace(/\D/g,'').length !== 11){ showToast('CPF inválido (deve ter 11 dígitos)'); return; }
      if(!data.email.includes('.')){ showToast('Email aparentemente inválido'); return; }

      saveCadastro(data);
      showModal('Obrigado!','Cadastro recebido (simulação).');
      form.reset();
      renderCadastrosList(node.querySelector('#cadastros-list'));
    });

    renderCadastrosList(node.querySelector('#cadastros-list'));
  }

  function renderCadastrosList(containerEl){
    var list = getCadastros();
    containerEl.innerHTML = '';
    if(list.length===0){ containerEl.textContent = 'Nenhum cadastro encontrado.'; return; }
    list.forEach(function(c){
      var item = document.createElement('div');
      item.textContent = c.nome + ' — ' + c.email + ' — ' + (c.cpf||'') ;
      containerEl.appendChild(item);
    });
  }

  function renderTransparencia(container){
    var node = el('<section><h2>Transparência</h2><div class="card"><p>Relatórios (simulação). Exportar CSV disponível.</p><button id="exportCsv" class="btn">Exportar CSV</button></div></section>');
    container.appendChild(node);
    var btn = node.querySelector('#exportCsv');
    btn.addEventListener('click', function(){
      var data = getCadastros();
      if(!data.length){ showToast('Sem dados para exportar'); return; }
      var csv = 'nome,email,cpf,telefone,nascimento\n' + data.map(function(d){ return [d.nome,d.email,d.cpf,d.telefone,d.nascimento].map(function(v){ return '"'+(v||'')+'"'; }).join(','); }).join('\n');
      var blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a'); a.href = url; a.download = 'cadastros.csv'; a.click(); URL.revokeObjectURL(url);
    });
  }

  /* expose functions */
  window.renderHome = renderHome;
  window.renderProjects = renderProjects;
  window.renderCadastro = renderCadastro;
  window.renderTransparencia = renderTransparencia;

  /* initialize router on load */
  window.router = router;
})(); 
