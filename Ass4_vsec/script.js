// Get the registration form
const employeeForm = document.getElementById("employeeForm");

// Add submit event
employeeForm.addEventListener("submit", function(event) {

    // Prevent page from refreshing
    event.preventDefault();

    // Get values from form
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone").value.trim();
    const department = document.getElementById("department").value;

    // Get error elements
    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const phoneError = document.getElementById("phoneError");
    const departmentError = document.getElementById("departmentError");

    // Clear previous errors
    nameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    phoneError.textContent = "";
    departmentError.textContent = "";

    document.getElementById("successMessage").textContent = "";

    // Validation flag
    let isValid = true;

    // Name validation
    const namePattern = /^[A-Za-z ]+$/;

    if (name === "") {
        nameError.textContent = "Employee name is required.";
        isValid = false;
    }
    else if (!namePattern.test(name)) {
        nameError.textContent = "Name should contain only letters.";
        isValid = false;
    }
    else if (name.length < 3) {
        nameError.textContent = "Name must contain at least 3 characters.";
        isValid = false;
    }

    // Email validation
    const emailPattern =
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (email === "") {
        emailError.textContent = "Email address is required.";
        isValid = false;
    }
    else if (!emailPattern.test(email)) {
        emailError.textContent = "Enter a valid email address.";
        isValid = false;
    }

    // Password validation
    if (password === "") {
        passwordError.textContent = "Password is required.";
        isValid = false;
    }
    else if (password.length < 8) {
        passwordError.textContent =
            "Password must contain at least 8 characters.";
        isValid = false;
    }

    // Phone validation
    const phonePattern = /^[0-9]{10}$/;

    if (phone === "") {
        phoneError.textContent = "Phone number is required.";
        isValid = false;
    }
    else if (!phonePattern.test(phone)) {
        phoneError.textContent =
            "Phone number must contain exactly 10 digits.";
        isValid = false;
    }

    // Department validation
    if (department === "") {
        departmentError.textContent =
            "Please select a department.";
        isValid = false;
    }

    // If all details are valid
    if (isValid) {

        document.getElementById("successMessage").textContent =
            "Employee registered successfully!";

        // Clear form
        employeeForm.reset();
    }

});