document.addEventListener('DOMContentLoaded', function() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            window.location.href = 'dashboard.html';
        }
    });
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('loginButton');
    const loginError = document.getElementById('loginError');
    
    if (loginButton) {
        loginButton.addEventListener('click', handleLogin);
        
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleLogin();
            }
        });
    }
    
    function handleLogin() {
        loginError.textContent = '';
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        if (!email || !password) {
            loginError.textContent = 'Please enter both email and password';
            return;
        }
        
        loginButton.classList.add('loading');
        loginButton.innerHTML = '<i class="uil uil-spinner"></i> Signing In...';
        loginButton.disabled = true;
        
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                window.location.href = 'dashboard.html';
            })
            .catch((error) => {
                console.error('Login error:', error);
                
                switch (error.code) {
                    case 'auth/user-not-found':
                    case 'auth/wrong-password':
                        loginError.textContent = 'Invalid email or password';
                        break;
                    case 'auth/too-many-requests':
                        loginError.textContent = 'Too many failed login attempts. Please try again later';
                        break;
                    default:
                        loginError.textContent = 'An error occurred. Please try again';
                }
                
                loginButton.classList.remove('loading');
                loginButton.innerHTML = '<i class="uil uil-sign-in-alt"></i> Sign In';
                loginButton.disabled = false;
            });
    }
});
