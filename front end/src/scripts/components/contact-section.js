document.addEventListener('DOMContentLoaded', function() {
    const nameInput = document.getElementById('name');
    const categoriesInput = document.getElementById('categories');
    const phoneInput = document.getElementById('phone');
    const facilitiesInput = document.getElementById('facilities');
    const messageInput = document.getElementById('message');
    const imageInput = document.getElementById('image');
    const submitButton = document.getElementById('submitbutton');
    const nameError = document.getElementById('nameError');
    const categoriesError = document.getElementById('categoriesError');
    const phoneError = document.getElementById('phoneError');
    const facilitiesError = document.getElementById('facilitiesError');
    const messageError = document.getElementById('messageError');
    const imageError = document.getElementById('imageError');
  
    function validateName(name) {
        return /^[a-zA-Z\s]{5,}$/.test(name);
    }
  
    function validateCategories(categories) {
        return categories.trim().length > 0; // Check if a category is selected
    }
  
    function validatePhone(phone) {
        return /^\+?\d{1,4}[-.\s]?\d{7,15}$/.test(phone);
    }
  
    function validateFacilities(facilities) {
        return facilities.trim().length > 0; // Check if a facility is selected
    }
  
    function validateMessage(message) {
        return message.trim().length >= 10;
    }

    function validateImage(image) {
        return image && image.size <= 5 * 1024 * 1024; // Check if image is selected and less than 5MB
    }
  
    function validateForm() {
        let isValid = true;
  
        if (!validateName(nameInput.value)) {
            nameError.textContent = "Please enter a valid name (at least 5 characters, letters only)";
            nameInput.style.borderColor = 'red';
            isValid = false;
        } else {
            nameError.textContent = "";
            nameInput.style.borderColor = 'initial';
        }
  
        if (!validateCategories(categoriesInput.value)) {
            categoriesError.textContent = "Please select a category";
            categoriesInput.style.borderColor = 'red';
            isValid = false;
        } else {
            categoriesError.textContent = "";
            categoriesInput.style.borderColor = 'initial';
        }
  
        if (!validatePhone(phoneInput.value)) {
            phoneError.textContent = "Please enter a valid phone number (including country code)";
            phoneInput.style.borderColor = 'red';
            isValid = false;
        } else {
            phoneError.textContent = "";
            phoneInput.style.borderColor = 'initial';
        }
  
        if (!validateFacilities(facilitiesInput.value)) {
            facilitiesError.textContent = "Please select a facility";
            facilitiesInput.style.borderColor = 'red';
            isValid = false;
        } else {
            facilitiesError.textContent = "";
            facilitiesInput.style.borderColor = 'initial';
        }
  
        if (!validateMessage(messageInput.value)) {
            messageError.textContent = "Please enter a message (at least 10 characters)";
            messageInput.style.borderColor = 'red';
            isValid = false;
        } else {
            messageError.textContent = "";
            messageInput.style.borderColor = 'initial';
        }
  
        if (!validateImage(imageInput.files[0])) {
            imageError.textContent = "Please upload an image (less than 5MB)";
            imageInput.style.borderColor = 'red';
            isValid = false;
        } else {
            imageError.textContent = "";
            imageInput.style.borderColor = 'initial';
        }
  
        submitButton.disabled = !isValid;
    }
  
    if (nameInput && categoriesInput && phoneInput && facilitiesInput && messageInput && imageInput) {
        nameInput.addEventListener('input', validateForm);
        categoriesInput.addEventListener('change', validateForm); // Changed event for select element
        phoneInput.addEventListener('input', validateForm);
        facilitiesInput.addEventListener('change', validateForm); // Changed event for select element
        messageInput.addEventListener('input', validateForm);
        imageInput.addEventListener('change', validateForm); // Event for file input
    }
});
