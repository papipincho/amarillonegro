/**
 * AmarilloNegro.com - Main JavaScript
 */

// Mobile menu toggle
function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

// Newsletter form submission
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const messageDiv = document.getElementById('newsletterMessage');
            const submitBtn = this.querySelector('button[type="submit"]');
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            
            try {
                const response = await fetch('/api/newsletter.php', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                messageDiv.className = 'form-message ' + (result.status === 'success' ? 'success' : 'error');
                messageDiv.textContent = result.message;
                messageDiv.style.display = 'block';
                
                if (result.status === 'success') {
                    this.reset();
                }
            } catch (error) {
                messageDiv.className = 'form-message error';
                messageDiv.textContent = 'Error al enviar. Inténtalo de nuevo.';
                messageDiv.style.display = 'block';
            }
            
            submitBtn.disabled = false;
            submitBtn.textContent = 'Suscribirse';
            
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        });
    }
    
    // Contact/Publish form submission
    const publishForm = document.getElementById('publishForm');
    if (publishForm) {
        publishForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitBtn = this.querySelector('button[type="submit"]');
            const formContainer = document.getElementById('formContainer');
            const successContainer = document.getElementById('successContainer');
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            
            try {
                const response = await fetch('/api/contact.php', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.status === 'success') {
                    formContainer.style.display = 'none';
                    successContainer.style.display = 'block';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    alert(result.message || 'Error al enviar el formulario');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Enviar solicitud';
                }
            } catch (error) {
                alert('Error al enviar. Inténtalo de nuevo.');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar solicitud';
            }
        });
    }
});

// Scroll to top on page load
window.addEventListener('load', function() {
    window.scrollTo(0, 0);
});
