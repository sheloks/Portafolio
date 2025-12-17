/**
 * Contact Form Service
 * Servicio para enviar mensajes desde el formulario de contacto
 * Usa EmailJS para enviar emails sin backend
 * 
 * CONFIGURACIÓN:
 * 1. Crear cuenta gratuita en https://www.emailjs.com/
 * 2. Crear un Email Service (conectar tu Gmail/Outlook)
 * 3. Crear un Email Template con variables: {{from_name}}, {{from_email}}, {{message}}
 * 4. Copiar los IDs y reemplazar abajo
 */

const ContactService = {
    // ⚠️ REEMPLAZAR ESTOS VALORES CON TUS CREDENCIALES DE EMAILJS
    PUBLIC_KEY: 'TU_PUBLIC_KEY',      // Dashboard > Account > API Keys
    SERVICE_ID: 'TU_SERVICE_ID',       // Dashboard > Email Services
    TEMPLATE_ID: 'TU_TEMPLATE_ID',     // Dashboard > Email Templates
    
    // Email de destino (tu email)
    DESTINATION_EMAIL: 'Esc.osvaldo.viganotti.2000@gmail.com',
    
    /**
     * Inicializar EmailJS
     */
    init: function() {
        if (typeof emailjs !== 'undefined') {
            emailjs.init(this.PUBLIC_KEY);
            console.log('✅ ContactService inicializado');
        } else {
            console.warn('⚠️ EmailJS no cargado. Usando método alternativo.');
        }
    },
    
    /**
     * Enviar mensaje
     * @param {Object} formData - { name, email, message }
     * @returns {Promise}
     */
    sendMessage: async function(formData) {
        const { name, email, message } = formData;
        
        // Validación
        if (!name || !email || !message) {
            throw new Error('Todos los campos son requeridos');
        }
        
        if (!this.validateEmail(email)) {
            throw new Error('Email inválido');
        }
        
        // Si EmailJS está configurado, usarlo
        if (typeof emailjs !== 'undefined' && this.PUBLIC_KEY !== 'TU_PUBLIC_KEY') {
            return this.sendWithEmailJS(formData);
        }
        
        // Método alternativo: abrir cliente de email
        return this.sendWithMailto(formData);
    },
    
    /**
     * Enviar con EmailJS
     */
    sendWithEmailJS: async function(formData) {
        const templateParams = {
            from_name: formData.name,
            from_email: formData.email,
            message: formData.message,
            to_email: this.DESTINATION_EMAIL
        };
        
        try {
            const response = await emailjs.send(
                this.SERVICE_ID,
                this.TEMPLATE_ID,
                templateParams
            );
            
            if (response.status === 200) {
                return { success: true, message: '¡Mensaje enviado exitosamente!' };
            }
            throw new Error('Error al enviar');
        } catch (error) {
            console.error('EmailJS Error:', error);
            // Fallback a mailto
            return this.sendWithMailto(formData);
        }
    },
    
    /**
     * Enviar con mailto (fallback)
     */
    sendWithMailto: function(formData) {
        const subject = encodeURIComponent(`Contacto desde Portfolio - ${formData.name}`);
        const body = encodeURIComponent(
            `Nombre: ${formData.name}\n` +
            `Email: ${formData.email}\n\n` +
            `Mensaje:\n${formData.message}`
        );
        
        const mailtoLink = `mailto:${this.DESTINATION_EMAIL}?subject=${subject}&body=${body}`;
        window.location.href = mailtoLink;
        
        return { 
            success: true, 
            message: '¡Abriendo tu cliente de email!',
            method: 'mailto'
        };
    },
    
    /**
     * Validar email
     */
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    /**
     * Enviar por WhatsApp (alternativa)
     */
    sendWhatsApp: function(formData) {
        const phone = '543482651186'; // Tu número con código de país
        const text = encodeURIComponent(
            `¡Hola Osvaldo!\n\n` +
            `Soy ${formData.name}\n` +
            `Email: ${formData.email}\n\n` +
            `${formData.message}`
        );
        
        window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
        
        return { success: true, message: '¡Abriendo WhatsApp!' };
    }
};

// Exportar para uso global
window.ContactService = ContactService;

// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    ContactService.init();
});