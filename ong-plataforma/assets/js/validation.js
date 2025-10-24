export function validateForm(data){
  const errors = {};
  if(!data.nome || data.nome.trim().length < 3) errors.nome = 'Nome muito curto';
  if(!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) errors.email = 'Email inválido';
  if(!data.cpf || data.cpf.replace(/\D/g,'').length !== 11) errors.cpf = 'CPF deve ter 11 dígitos';
  if(!data.telefone || data.telefone.replace(/\D/g,'').length < 10) errors.telefone = 'Telefone inválido';
  if(data.nascimento){
    const born = new Date(data.nascimento);
    const age = new Date().getFullYear() - born.getFullYear();
    if(age < 16) errors.nascimento = 'É necessário ter ao menos 16 anos';
  }
  return errors;
}
