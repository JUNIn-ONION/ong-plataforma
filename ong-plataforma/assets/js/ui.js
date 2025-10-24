export function showToast(message, opts={}){
  const containerId = 'toast-container-spa';
  let container = document.getElementById(containerId);
  if(!container){ container = document.createElement('div'); container.id = containerId; container.style.position='fixed'; container.style.right='16px'; container.style.bottom='16px'; container.style.zIndex='9999'; document.body.appendChild(container); }
  const div = document.createElement('div'); div.className='toast'; div.textContent = message; container.appendChild(div);
  setTimeout(()=>{ div.remove(); if(container.children.length===0) container.remove(); }, 3500);
}
