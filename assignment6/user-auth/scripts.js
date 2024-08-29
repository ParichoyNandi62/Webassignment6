function saveUserData(users) {

    localStorage.setItem('users', JSON.stringify(users));
}
function getUserData() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}
function resetForm(modalId) {
    const form = document.querySelector(`#${modalId} form`);
    form.reset();
    const errorMessages = form.querySelectorAll('.text-red-500');
    const errorIcons = form.querySelectorAll('.error-icon');
    errorMessages.forEach(message => message.textContent = '');
    errorIcons.forEach(icon => icon.style.display = 'none');
}
function showModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}
function hideModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
    resetForm(modalId);
}
document.getElementById('openLogin').addEventListener('click', () => {
    showModal('loginModal');
});
document.getElementById('openSignup').addEventListener('click', () => {
    showModal('signupModal');
});
document.getElementById('closeLogin').addEventListener('click', () => {
    hideModal('loginModal');
});
document.getElementById('closeSignup').addEventListener('click', () => {
    hideModal('signupModal');
});
document.getElementById('cancelLogin').addEventListener('click', () => {
    hideModal('loginModal');
});
document.getElementById('cancelSignup').addEventListener('click', () => {
    hideModal('signupModal');
});
function togglePasswordVisibility(inputId, iconId) {
    const passwordInput = document.getElementById(inputId);
    const eyeIcon = document.getElementById(iconId);
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
}

document.getElementById('toggleLoginPassword').addEventListener('click', () => {
    togglePasswordVisibility('loginPassword', 'toggleLoginPassword');
});

document.getElementById('toggleSignupPassword').addEventListener('click', () => {
    togglePasswordVisibility('password', 'toggleSignupPassword');
});
function formatDateInput(inputId) {
    const input = document.getElementById(inputId);
    const date = new Date(input.value);
    if (input.value && !isNaN(date)) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        input.value = `${year}-${month}-${day}`;
    }
}

document.getElementById('dob').addEventListener('change', () => formatDateInput('dob'));

function showError(inputId, errorId, iconId, message) {
    const errorElement = document.getElementById(errorId);
    const errorIcon = document.getElementById(iconId);
    if (errorElement && errorIcon) {
        errorElement.textContent = message;
        errorIcon.style.display = 'inline';
    } else {
        console.error(`Error: Element with ID ${errorId} or ${iconId} not found.`);
    }
}

function hideError(errorId, iconId) {
    document.getElementById(errorId).textContent = '';
    document.getElementById(iconId).style.display = 'none';
}
function validateName() {
    const name = document.getElementById('name').value.trim();
    const nameRegex = /^[a-zA-Z\s]{3,}$/;
    if (!nameRegex.test(name)) {
        showError('name', 'nameError', 'nameErrorIcon', 'Name must be at least 3 letters');
        return false;
    } else {
        hideError('nameError', 'nameErrorIcon');
        return true;
    }
}

function validateEmail() {
    const email = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('email', 'emailError', 'emailErrorIcon', 'Invalid email address.');
        return false;
    } else {
        hideError('emailError', 'emailErrorIcon');
        return true;
    }
}

function validatePassword() {
    const password = document.getElementById('password').value;
    if (password.length < 6) {
        showError('password', 'passwordError', 'passwordErrorIcon', 'Password must be at least 6 characters long.');
        return false;
    } else {
        hideError('passwordError', 'passwordErrorIcon');
        return true;
    }
}


function validateConfirmPassword() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    if (password !== confirmPassword) {
        showError('confirmPassword', 'confirmPasswordError', 'confirmPasswordErrorIcon', 'Passwords do not match.');
        return false;
    } else {
        hideError('confirmPasswordError', 'confirmPasswordErrorIcon');
        return true;
    }
}

function validateDob() {
    const dob = document.getElementById('dob').value;
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/; 
    if (!dobRegex.test(dob)) {
        showError('dob', 'dobError', 'dobErrorIcon', 'Date must be in YYYY-MM-DD format.');
        return false;
    } else {
        const today = new Date();
        const dobDate = new Date(dob);
        let age = today.getFullYear() - dobDate.getFullYear();
        const monthDiff = today.getMonth() - dobDate.getMonth();
        const dayDiff = today.getDate() - dobDate.getDate();
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }
        if (age < 18) {
            showError('dob', 'dobError', 'dobErrorIcon', 'You must be at least 18 years old.');
            return false;
        } else {
            hideError('dobError', 'dobErrorIcon');
            return true;
        }
    }
}
document.getElementById('signupForm').addEventListener('submit', (event) => {
    event.preventDefault(); 
    if (validateName() && validateEmail() && validatePassword() && validateConfirmPassword() && validateDob()) {
        const users = getUserData();
        users.push({
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value,
            dob: document.getElementById('dob').value
        });
        saveUserData(users);
        notify('Signup successful!', 'success');
        hideModal('signupModal');
    }
    else{
        notify('Feilds in form are missing or validation error','error');
    }
});
function toggleSignupButton() {
    const formIsValid = validateName() && validateEmail() && validatePassword() && validateConfirmPassword() && validateDob();
    document.getElementById('signupSubmit').disabled = !formIsValid;
}

document.getElementById('name').addEventListener('input', () => {
    validateName();
    toggleSignupButton();
});
document.getElementById('email').addEventListener('input', () => {
    validateEmail();
    toggleSignupButton();
});
document.getElementById('password').addEventListener('input', () => {
    validatePassword();
    toggleSignupButton();
});
document.getElementById('confirmPassword').addEventListener('input', () => {
    validateConfirmPassword();
    toggleSignupButton();
});
document.getElementById('dob').addEventListener('input', () => {
    validateDob();
    toggleSignupButton();
});
document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const users = getUserData();
    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
        notify('Login successful!', 'success');
        window.location.href = 'https://www.christuniversity.in'; 
    } else {
        notify('Invalid email or password.', 'error');
        showError('loginEmail', 'loginError', 'loginEmailErrorIcon', 'Invalid email or password.');
        showError('loginPassword', 'loginError', 'loginPasswordErrorIcon', 'Invalid email or password.');
    }
});
function notify(message, type = 'success', duration = 10000) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    notification.classList.remove('success', 'error');
    if (type === 'success') {
        notification.classList.add('success');
    } else if (type === 'error') {
        notification.classList.add('error');
    }
    notificationMessage.textContent = message;
    notification.classList.remove('hidden');
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
        notification.classList.add('hidden');
    }, duration);
}

