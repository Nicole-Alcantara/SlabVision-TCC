const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', () => {
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    togglePassword.textContent = 'Ocultar';
  } else {
    passwordInput.type = 'password';
    togglePassword.textContent = 'Mostrar';
  }
});

document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  alert(`Login enviado!\nUsuário: ${username}`);
});
