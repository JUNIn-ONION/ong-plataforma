const KEY = 'ong:cadastros:v3';
export function saveCadastro(data){
  const list = JSON.parse(localStorage.getItem(KEY) || '[]');
  list.unshift({...data, id: Date.now()});
  localStorage.setItem(KEY, JSON.stringify(list));
}
export function getCadastros(){
  return JSON.parse(localStorage.getItem(KEY) || '[]');
}
export function clearCadastros(){ localStorage.removeItem(KEY); }
