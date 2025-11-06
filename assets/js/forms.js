// Form submission handler with AJAX
(function() {
    'use strict';

    // Show loading state
    function showLoading(button) {
        button.disabled = true;
        button.dataset.originalText = button.textContent;
        button.textContent = 'Sending...';
    }

    // Hide loading state
    function hideLoading(button) {
        button.disabled = false;
        button.textContent = button.dataset.originalText || 'Send';
    }

    // Show message to user
    function showMessage(message, isSuccess) {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 20px 30px;
            background: ${isSuccess ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#dc3545'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10001;
            max-width: 400px;
            font-size: 16px;
            animation: slideIn 0.3s ease;
        `;
        messageDiv.textContent = message;
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(400px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(messageDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => messageDiv.remove(), 300);
        }, 5000);
    }

    // Submit form via AJAX
    function submitFormAjax(formData, button) {
        showLoading(button);
        
        fetch('send-email.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            hideLoading(button);
            
            if (data.success) {
                showMessage(data.message, true);
                
                // Close popup if it exists
                const popup = button.closest('.popup-overlay');
                if (popup) {
                    popup.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
                
                // Reset form
                const form = button.closest('form');
                if (form) {
                    form.reset();
                }
            } else {
                showMessage(data.message || 'Something went wrong. Please try again.', false);
            }
        })
        .catch(error => {
            hideLoading(button);
            showMessage('Network error. Please check your connection and try again.', false);
            console.error('Error:', error);
        });
    }

    // Recruitment Plan Form
    window.submitForm = function(e) {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('form_type', 'recruitment_plan');
        formData.append('name', document.getElementById('name').value);
        formData.append('company', document.getElementById('company').value);
        formData.append('openings', document.getElementById('openings').value);
        formData.append('email', document.getElementById('email').value);
        
        const button = e.target.querySelector('button[type="submit"]');
        submitFormAjax(formData, button);
    };

    // SEO Quote Request Form
    window.submitQuoteForm = function(e) {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('form_type', 'quote_request');
        formData.append('name', document.getElementById('quoteName').value);
        formData.append('company', document.getElementById('quoteCompany').value);
        formData.append('website', document.getElementById('quoteWebsite').value);
        formData.append('adspend', document.getElementById('quoteAdSpend').value);
        formData.append('service', 'SEO');
        
        const button = e.target.querySelector('button[type="submit"]');
        submitFormAjax(formData, button);
    };

    // PPC Audit Form
    window.submitPPCAuditForm = function(e) {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('form_type', 'ppc_audit');
        formData.append('name', document.getElementById('ppcAuditName').value);
        formData.append('company', document.getElementById('ppcAuditCompany').value);
        formData.append('website', document.getElementById('ppcAuditWebsite').value);
        
        const button = e.target.querySelector('button[type="submit"]');
        submitFormAjax(formData, button);
    };

    // Keep existing popup functions
    window.openPopup = function() {
        const popup = document.getElementById('popupForm');
        if (popup) {
            popup.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    };

    window.closePopup = function() {
        const popup = document.getElementById('popupForm');
        if (popup) {
            popup.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };

    window.openQuotePopup = function() {
        const popup = document.getElementById('quotePopup');
        if (popup) {
            popup.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeQuotePopup = function() {
        const popup = document.getElementById('quotePopup');
        if (popup) {
            popup.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };

    window.openAuditPopup = function() {
        const popup = document.getElementById('auditPopup');
        if (popup) {
            popup.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeAuditPopup = function() {
        const popup = document.getElementById('auditPopup');
        if (popup) {
            popup.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };

    // PPC Audit Popup functions
    window.openPPCAuditPopup = function() {
        const popup = document.getElementById('ppcAuditPopup');
        if (popup) {
            popup.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    };

    window.closePPCAuditPopup = function() {
        const popup = document.getElementById('ppcAuditPopup');
        if (popup) {
            popup.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };

    // Close popup when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('popup-overlay')) {
            e.target.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

})();
