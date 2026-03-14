/*Variable for Form*/
const signupForm=document.querySelector(".signup-box");

/*Variable for User Detail*/
const fnameInput=document.querySelector("#fname");
const mnameInput=document.querySelector("#mname");
const lnameInput= document.querySelector('#lname');
const usernameInput= document.querySelector("#username");
const emailInput= document.querySelector("#email");
const passwordInput= document.querySelector("#password");
const confirmPasswordInput= document.querySelector("#confirmpassword");
const dobInput= document.querySelector("#dob");


signupForm.addEventListener("submit",function(event){
    event.preventDefault();

    /*Initializing Variables */
    const fname= fnameInput.value.trim();
    const mname= mnameInput.value.trim();
    const lname= lnameInput.value.trim();
    const username= usernameInput.value.trim();
    const email= emailInput.value.trim();
    const password= passwordInput.value.trim();
    const confirmPassword= confirmPasswordInput.value.trim();
    const dob= dobInput.value.trim();

    /*Calling Functions For validations */

    const isFnameValid=validateName(fname);
    const isMnameValid=validateName(mname);
    const isLnameValid=validateName(lname);

    const isUsernameValid=validateUsername(username);
    const isEmailValid=validateEmail(email);
    const isPasswordValid=validatePassword(password,confirmPassword);
    const isDobValid=validateDob(dob);

    if (isFnameValid && isLnameValid && isUsernameValid &&
        isEmailValid && isPasswordValid && isDobValid) {
        window.location.href = "./login.html";
    }

});

function validateName(name, input){
    if (name === "") {
        showError(input, "Name is required");
        return false;
    }
    if (name.length < 2) {
        showError(input, "Name must be at least 2 characters");
        return false;
    }
    const namePattern = /^[a-zA-Z\s]+$/;

    if (!namePattern.test(name)) {
        showError(input, "Name can only contain letters");
        return false;
    }
    showSuccess(input);
    return true;
}

function validateUsername(username){
    return true;
}

function validateEmail(email){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password,confirmPassword){
    const minLength = 8;
    const hasNumber = /\d/.test(password);
    
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return false;
    }
    if (password.length < minLength || !hasNumber) {
        alert("Password must be at least 8 characters and include a number.");
        return false;
    }
    return true;
}

function validateDob(dob){
    return true;
}


/* Show Error */
function showError(input, message) {
    const group = input.closest(".form-group");

    const existing = group.querySelector(".error-msg");
    if (existing) {
        existing.remove();
    }

    input.style.borderColor = "#dc2626";

    const error = document.createElement("p");

    error.className = "error-msg";
    error.textContent = message;
    error.style.color = "#dc2626";
    error.style.fontSize = "12px";
    error.style.marginTop = "4px";
    error.style.fontWeight = "500";
    group.appendChild(error);
}

/* Show Success */
function showSuccess(input) {
    const group = input.closest(".form-group");
    const existing = group.querySelector(".error-msg");
    if (existing) {
        existing.remove();
    }
    input.style.borderColor = "#16a34a";
}