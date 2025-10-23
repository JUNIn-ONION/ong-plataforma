// Interatividade: hamburger, dropdown, projects population, form validation, toasts, modal and share
document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('#year,#year2,#year3').forEach(el=>el&&(el.textContent=new Date().getFullYear()));
  function initHamburger(idBtn, idNav){
    const btn = document.getElementById(idBtn);
    const nav = document.getElementById(idNav);
    if(!btn || !nav) return;
    btn.addEventListener('click', ()=>{
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !expanded);
      nav.classList.toggle('open');
      btn.classList.toggle('is-active');
    });
  }
  initHamburger('hamburger','nav');
  initHamburger('hamburger2','nav2');
  initHamburger('hamburger3','nav3');
  document.querySelectorAll('.sub-toggle').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const parent = btn.closest('.has-sub');
      const menu = parent.querySelector('.sub-menu');
      const expanded = btn.getAttribute('aria-expanded')==='true';
      btn.setAttribute('aria-expanded', !expanded);
      menu.classList.toggle('open');
    });
  });
  const projetos = [
    {id:1,titulo:'Educação Infantil',cat:'educacao',desc:'Apoio escolar para 200 crianças',img:'assets/images/project1.jpg',vagas:20},
    {id:2,titulo:'Saúde Comunitária',cat:'saude',desc:'Campanhas de saúde',img:'assets/images/project2.jpg',vagas:10},
    {id:3,titulo:'Oficinas Profissionais',cat:'capacitacao',desc:'Cursos para jovens',img:'assets/images/project3.jpg',vagas:15},
    {id:4,titulo:'Hortas Comunitárias',cat:'meioambiente',desc:'Projetos verdes locais',img:'assets/images/project4.jpg',vagas:8}
  ];
  const projectsContainer = document.getElementById('projects');
  function renderProjects(filter){
    if(!projectsContainer) return;
    projectsContainer.innerHTML='';
    const list = projetos.filter(p=>!filter||p.cat===filter);
    list.forEach(p=>{
      const card = document.createElement('article');
      card.className='card project-card';
      card.innerHTML=`
        <img src="${p.img}" alt="Imagem do projeto ${p.titulo}" loading="lazy">
        <div class="card-body">
          <h4>${p.titulo}</h4>
          <p class="muted">${p.desc}</p>
          <p>Vagas: ${p.vagas}</p>
          <div class="card-actions"><a class="btn btn-primary" href="cadastro.html">Inscrever</a> <span class="badge">${p.cat}</span></div>
        </div>`;
      projectsContainer.appendChild(card);
    });
  }
  renderProjects();
  const cat = document.getElementById('categoria');
  cat && cat.addEventListener('change',(e)=>renderProjects(e.target.value));
  function mask(input, pattern){
    if(!input) return;
    input.addEventListener('input', ()=>{
      let v = input.value.replace(/\D/g,'');
      let out=''; let j=0;
      for(let i=0;i<pattern.length && j<v.length;i++){
        out += pattern[i] === '#' ? v[j++] : pattern[i];
      }
      input.value = out;
    });
  }
  mask(document.getElementById('cpf'),'###.###.###-##');
  mask(document.getElementById('telefone'),'(##) #####-####');
  mask(document.getElementById('cep'),'#####-###');
  const form = document.getElementById('formCadastro');
  if(form){
    form.addEventListener('submit',(e)=>{
      if(!form.checkValidity()){
        e.preventDefault();
        [...form.querySelectorAll('input,select')].forEach(inp=>{
          if(!inp.checkValidity()) inp.setAttribute('aria-invalid','true'); else inp.removeAttribute('aria-invalid');
        });
        showToast('Por favor corrija os campos em destaque.', {type:'danger'});
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        firstInvalid && firstInvalid.focus();
        return;
      }
      e.preventDefault();
      showModal('Obrigado!','Seu cadastro foi recebido (simulação).');
      form.reset();
    });
    form.querySelectorAll('input,select').forEach(inp=>{
      inp.addEventListener('input', ()=> inp.removeAttribute('aria-invalid'));
    });
  }
  const formDoacao = document.getElementById('formDoacao');
  if(formDoacao){
    formDoacao.addEventListener('submit',(e)=>{
      e.preventDefault();
      const val = parseFloat(document.getElementById('valor').value||0);
      if(val<=0){ showToast('Insira um valor válido.',{type:'danger'}); return; }
      const prog = document.getElementById('camp-progress');
      if(prog){ let cur = parseFloat(prog.value)||0; cur += val; prog.value = cur; document.getElementById('camp-raised') && (document.getElementById('camp-raised').textContent = new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(cur)); }
      showToast('Obrigado pela doação (simulação)!', {type:'success'});
    });
  }
  const toastContainer = document.getElementById('toast-container');
  function showToast(message, opts={}){
    if(!toastContainer) return;
    const div = document.createElement('div');
    div.className='toast';
    div.setAttribute('role','status');
    div.textContent = message;
    toastContainer.appendChild(div);
    setTimeout(()=>{ div.classList.add('hide'); div.addEventListener('transitionend', ()=>div.remove()); }, 3500);
  }
  const modal = document.getElementById('modal');
  const modalClose = modal && modal.querySelector('.modal-close');
  function showModal(title, text){
    if(!modal) return;
    modal.setAttribute('aria-hidden','false');
    modal.querySelector('#modal-title').textContent = title;
    modal.querySelector('.modal-content p') && (modal.querySelector('.modal-content p').textContent = text);
  }
  modalClose && modalClose.addEventListener('click', ()=> modal.setAttribute('aria-hidden','true'));
  const shareBtn = document.getElementById('share-camp');
  shareBtn && shareBtn.addEventListener('click', ()=>{
    if(navigator.share){ navigator.share({title:document.title,text:'Apoie a campanha',url:location.href}); }
    else showToast('Compartilhe manualmente: ' + location.href);
  });
  document.addEventListener('keyup', (e)=>{ if(e.key === 'Tab') document.documentElement.classList.add('show-focus'); });
});