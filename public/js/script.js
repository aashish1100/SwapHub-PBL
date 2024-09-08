// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

  
  document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('reset-form');
    const password1 = document.getElementById('password1');
    const password2 = document.getElementById('password2');
    const mismatchMessage = document.getElementById('password-mismatch');
    

    form.addEventListener('submit', function(event) {
        // Reset the mismatch message on each submission attempt
        mismatchMessage.classList.add('d-none');

        // Check if the passwords match
        if (password1.value !== password2.value) {
            event.preventDefault(); // Prevent form submission if passwords do not match
            mismatchMessage.classList.remove('d-none'); // Show the mismatch message
        }
    });
});


document.addEventListener('DOMContentLoaded', function() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  const dropdownItems = document.querySelectorAll('.dropdown-item');
  const category=document.querySelector(".dropdown-toggle");
  let anyDropdownItemActive = false;
  navLinks.forEach(link => {
      link.classList.remove('active'); // Remove 'active' class from all links
      if (link.getAttribute('href') === currentPath) {
          link.classList.add('active'); // Add 'active' class to the current link
      }
  });

  dropdownItems.forEach(item => {

      item.classList.remove('active'); // Remove 'active' class from all dropdown items
    
      if (item.getAttribute('href') === currentPath) {
          item.classList.add('active'); // Add 'active' class to the current dropdown item
          anyDropdownItemActive = true;
      }
  });

  if (anyDropdownItemActive) {
    category.classList.add('active');
} else {
    category.classList.remove('active');
}
});