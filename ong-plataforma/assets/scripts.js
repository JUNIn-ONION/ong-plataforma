document.addEventListener('DOMContentLoaded', function () {
  const cpf = document.getElementById('cpf');
  const telefone = document.getElementById('telefone');
  const cep = document.getElementById('cep');

  function mask(input, pattern) {
    input.addEventListener('input', () => {
      let value = input.value.replace(/\D/g, '');
      let formatted = '';
      let j = 0;
      for (let i = 0; i < pattern.length && j < value.length; i++) {
        formatted += pattern[i] === '#' ? value[j++] : pattern[i];
      }
      input.value = formatted;
    });
  }

  mask(cpf, '###.###.###-##');
  mask(telefone, '(##) #####-####');
  mask(cep, '#####-###');

  document.getElementById('formCadastro').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Cadastro enviado com sucesso!');
  });
});