document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Set logged-in status in localStorage
        localStorage.setItem('loggedIn', 'true');
        // Redirect to chatbot page
        window.location.href = 'index.html';
    } else {
        alert('Invalid username or password');
    }
});
