const COLORS = {
    errorColor: "#dc2626",
    successColor: "#16a34a",
    grayMid: "#e5e7eb",
};

/* Variable for Form */
const signupForm = document.querySelector(".signup-box");

/* Variables for Inputs */
const fnameInput = document.querySelector("#fname");
const mnameInput = document.querySelector("#mname");
const lnameInput = document.querySelector("#lname");
const usernameInput = document.querySelector("#username");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirmpassword");
const dobInput = document.querySelector("#dob");

/*======================
Real Time validation
========================*/
/* Validate Name */
function addNameListener(input){
    input.addEventListener("input",function(){
        const name= input.value.trim();

        if(name===""){
            resetBorder(input);
            return;
        }
        const hasDigit=/\d/.test(name)
        if(hasDigit){
            showError(input,"Name Can't Have Digit");
            return;
        }
        const hasSymbol = /[^a-zA-Z\s]/.test(name);
        if (hasSymbol) {
            showError(input, "Name cannot contain symbols");
            return;
        }
        showSuccess(input);
    });
}
addNameListener(fnameInput);
addNameListener(lnameInput);

/*Validate Username*/
usernameInput.addEventListener("input",function(){
    const username=usernameInput.value.trim();
    if(username===""){
        resetBorder(usernameInput);
        return;
    }
    if(username.includes(" ")){
        showError(usernameInput,"Username can't have blank space.");
        return;
    }
    if(username.length<3){
        showError(usernameInput,"Username must be alteast 3 character.");
        return;
    }
    showSuccess(usernameInput);
});


/*Validate Email realtime*/
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

/*Validate Confirm Password match */
confirmPasswordInput.addEventListener("input",function(){
    const password=passwordInput.value.trim();
    const confirmPassword=confirmPasswordInput.value.trim();

    if(confirmPassword===""){
        resetBorder(confirmPasswordInput);
        return;
    }

    if(confirmPassword!==password){
        showError(confirmPasswordInput,"Password doesn't match.");
        return;
    }
    showSuccess(confirmPasswordInput);
});

/*Form Submit */
signupForm.addEventListener("submit",function(event){
    event.preventDefault();
    /*Get values */
    const fname=fnameInput.value.trim();
    const lname=lnameInput.value.trim();
    const username=usernameInput.value.trim();
    const email=emailInput.value.trim();
    const password=passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    const dob=dobInput.value.trim();

    /*Validation */

    const isFnameValid=validateName(fname,fnameInput);
    const isLnameValid=validateName(lname,lnameInput);
    const isMnameValid = true;
    const isUsernameValid = validateUsername(username);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password, confirmPassword);
    const isDobValid = validateDob(dob);
    if(isFnameValid && isLnameValid &&isMnameValid && isUsernameValid && isEmailValid && isPasswordValid && isDobValid){
        window.location.href = "./login.html";
    }
});
/*=========================
On Submit Validation
===========================*/
/*Validate Name */
function validateName(name,input){
    if(name===""){
        showError(input,"Name is required.");
        return false;
    }
    if(name.length<2){
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

/*Username validation */
function validateUsername(username){
    if(username===""){
        showError(usernameInput,"Please Enter username.");
        return false;
    }

    if(username.length<3){
        showError(usernameInput,"Username must atleast be 3 character");
        return false;
    }
    if(username.includes(" ")){
        showError(usernameInput,"Username can't have blank space.");
        return false;
    }
    showSuccess(usernameInput);
    return true;
}
/*Email Validation */
function validateEmail(email){
    if(email===""){
        showError(emailInput,"Email is required")
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ ;

    if(!emailRegex.test(email)){
        showError(emailInput,"Enter Valid Email");
        return false;
    }
    showSuccess(emailInput);
    return true;
}
/*Password validation */
function validatePassword(password,confirmPassword){
    if (password === "") {
        showError(passwordInput, "Password is required");
        return false;
    }
    if (password.length < 8) {
        showError(passwordInput, "Password must be at least 8 characters");
        return false;
    }
    const hasNumber = /\d/.test(password);
    if (!hasNumber) {
        showError(passwordInput, "Password must include at least one number");
        return false;
    }
    if (confirmPassword === "") {
        showError(confirmPasswordInput, "Please confirm your password");
        return false;
    }
    if (password !== confirmPassword) {
        showError(confirmPasswordInput, "Passwords do not match");
        return false;
    }
    showSuccess(passwordInput);
    showSuccess(confirmPasswordInput);
    return true;
}

/*Validate dob */
function validateDob(dob) {
    if (dob === "") {
        showError(dobInput, "Date of birth is required");
        return false;
    }
    showSuccess(dobInput);
    return true;
}

/* Show Error */
function showError(input, message) {
    const group = input.closest(".form-group");
    const existing = group.querySelector(".error-msg");
    if (existing) existing.remove();

    input.style.borderColor = COLORS.errorColor;

    const error = document.createElement("p");
    error.className = "error-msg";
    error.textContent = message;
    error.style.color = COLORS.errorColor;
    error.style.fontSize = "12px";
    error.style.marginTop = "4px";
    error.style.fontWeight = "500";
    group.appendChild(error);
}

/* Show Success */
function showSuccess(input) {
    const group = input.closest(".form-group");
    const existing = group.querySelector(".error-msg");
    if (existing) existing.remove();
    input.style.borderColor = COLORS.successColor;
}

function resetBorder(input){
    const group=input.closest(".form-group");
    const existing = group.querySelector(".error-msg");
    if (existing) existing.remove();
    input.style.borderColor = COLORS.grayMid;
}