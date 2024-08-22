document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Redirect to chatbot page
        window.location.href = 'index.html';
    } else {
        alert('Invalid username or password');
    }
    
});
// Assume this function is called on login
function handleLogin() {
    console.log("Login process started");
    
    // Dummy check for login
    if (username === "user" && password === "pass") {
        console.log("Login successful");
        window.location.href = "index.html";
    } else {
        console.log("Login failed");
        // Show an error message
    }
}

