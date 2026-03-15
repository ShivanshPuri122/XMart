const loginForm = document.querySelector(".login-box");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
/*==========================
Realtime Validation
============================*/
/*Email Validation*/
emailInput.addEventListener("input",function(){
    const email=emailInput.value.trim();

    if(email===""){
        resetBorder(emailInput);
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ ;

    if(!emailRegex.test(email)){
        showError(emailInput,"Enter Valid Email");
        return;
    }
    showSuccess(emailInput)
});

loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (isEmailValid && isPasswordValid) {
        window.location.href = "./index.html";
    }
});

function validateEmail(email) {
    if (email === "") {
        showError(emailInput, "Email is required");
        return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showError(emailInput, "Enter a valid email address");
        return false;
    }

    showSuccess(emailInput);
    return true;
}

function validatePassword(password) {
    if (password === "") {
        showError(passwordInput, "Password is required");
        return false;
    }

    if (password.length < 8) {
        showError(passwordInput, "Password must be at least 8 characters");
        return false;
    }

    showSuccess(passwordInput);
    return true;
}

function showError(input, message) {
    const parent = input.parentElement;

    const existing = parent.querySelector(".error-msg");
    if (existing) existing.remove();

    input.style.borderColor = "#dc2626";

    const error = document.createElement("p");
    error.className = "error-msg";
    error.textContent = message;
    error.style.color = "#dc2626";
    error.style.fontSize = "12px";
    error.style.marginTop = "4px";
    error.style.fontWeight = "500";

    input.insertAdjacentElement("afterend", error);
}

function showSuccess(input) {
    const parent = input.parentElement;

    const existing = parent.querySelector(".error-msg");
    if (existing) existing.remove();

    input.style.borderColor = "#16a34a";
}