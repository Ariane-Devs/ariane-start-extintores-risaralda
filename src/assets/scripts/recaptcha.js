// Google reCAPTCHA v3 utility functions

export class RecaptchaV3 {
  constructor(siteKey) {
    this.siteKey = siteKey;
    this.scriptLoaded = false;
    this.grecaptcha = null;
    console.log("RecaptchaV3 initialized with site key:", siteKey);
  }

  // Load the reCAPTCHA script dynamically
  async loadScript() {
    if (this.scriptLoaded) {
      console.log("reCAPTCHA script already loaded");
      return;
    }

    console.log("Loading reCAPTCHA script...");
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${this.siteKey}`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        console.log("reCAPTCHA script loaded successfully");
        this.scriptLoaded = true;
        this.grecaptcha = window.grecaptcha;
        resolve();
      };

      script.onerror = () => {
        console.error("Failed to load reCAPTCHA script");
        reject(new Error("Failed to load reCAPTCHA script"));
      };

      document.head.appendChild(script);
    });
  }

  // Get reCAPTCHA token for a specific action
  async getToken(action = "contact_form") {
    console.log("Getting reCAPTCHA token for action:", action);

    if (!this.scriptLoaded) {
      await this.loadScript();
    }

    return new Promise((resolve, reject) => {
      this.grecaptcha.ready(() => {
        console.log("reCAPTCHA ready, executing...");
        this.grecaptcha
          .execute(this.siteKey, { action })
          .then((token) => {
            console.log(
              "reCAPTCHA token generated:",
              token.substring(0, 20) + "...",
            );
            resolve(token);
          })
          .catch((error) => {
            console.error("Error generating reCAPTCHA token:", error);
            reject(error instanceof Error ? error : new Error(String(error)));
          });
      });
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing contact form...");

  // Get the site key from meta tag
  const siteKeyMeta = document.querySelector('meta[name="recaptcha-site-key"]');
  console.log("Site key meta found:", !!siteKeyMeta);

  // Check if we're in development
  const isDevelopment =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";
  console.log("Development mode:", isDevelopment);

  let recaptcha = null;

  // Only initialize reCAPTCHA in production
  if (!isDevelopment && siteKeyMeta) {
    const siteKey = siteKeyMeta.getAttribute("content");
    console.log("Initializing reCAPTCHA with site key:", siteKey);
    recaptcha = new RecaptchaV3(siteKey);
  } else if (isDevelopment) {
    console.log("Development mode: reCAPTCHA disabled");
  } else {
    console.warn("reCAPTCHA site key not found");
  }

  // Handle contact form submission
  const contactForm = document.getElementById("contact-form");
  console.log("Contact form found:", !!contactForm);

  if (contactForm) {
    console.log("Adding submit event listener to contact form");

    contactForm.addEventListener("submit", async function (e) {
      console.log("Form submit event triggered");
      e.preventDefault();
      console.log("Default form submission prevented");

      try {
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        console.log("Submit button found:", !!submitBtn);

        if (submitBtn) {
          console.log("Setting button to loading state");
          submitBtn.textContent = "Enviando...";
          submitBtn.disabled = true;
        }

        let token = null;

        // Get reCAPTCHA token only in production
        if (!isDevelopment && recaptcha) {
          console.log("Getting reCAPTCHA token...");
          token = await recaptcha.getToken("contact_form");
          console.log("reCAPTCHA token received");
        } else {
          console.log("Development mode: Skipping reCAPTCHA token generation");
        }

        // Prepare form data
        console.log("Preparing form data...");
        const formData = new FormData(contactForm);

        // Log form data
        for (let [key, value] of formData.entries()) {
          console.log(`Form field - ${key}:`, value);
        }

        if (token) {
          formData.append("recaptcha_token", token);
          console.log("reCAPTCHA token added to form data");
        }

        // Submit form to API endpoint
        console.log("Submitting form to API...");
        const response = await fetch("/api/contact", {
          method: "POST",
          body: formData,
        });

        console.log("API response status:", response.status);
        console.log("API response ok:", response.ok);

        const result = await response.json();
        console.log("API response data:", result);

        if (result.success) {
          console.log("Form submission successful");
          // Show success message
          showMessage(result.message, "success");

          // Reset form
          contactForm.reset();
          console.log("Form reset");
        } else {
          console.log("Form submission failed:", result.message);
          // Show error message
          showMessage(result.message, "error");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        showMessage(
          "Error al enviar el mensaje. Por favor, inténtalo de nuevo.",
          "error",
        );
      } finally {
        // Reset button state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          console.log("Resetting button state");
          submitBtn.textContent = "Enviar Mensaje";
          submitBtn.disabled = false;
        }
      }
    });

    console.log("Contact form event listener added successfully");
  } else {
    console.error("Contact form not found!");
  }
});

// Utility function to show messages
function showMessage(message, type = "info") {
  console.log("Showing message:", message, "Type:", type);

  // Remove existing messages
  const existingMessage = document.querySelector(".form-message");
  if (existingMessage) {
    console.log("Removing existing message");
    existingMessage.remove();
  }

  // Create message element
  const messageDiv = document.createElement("div");

  let messageClass;
  if (type === "success") {
    messageClass =
      "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700";
  } else if (type === "error") {
    messageClass =
      "bg-red-100 text-red-800 border border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700";
  } else {
    messageClass =
      "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700";
  }

  messageDiv.className = `form-message mt-4 p-4 rounded-lg ${messageClass}`;
  messageDiv.textContent = message;

  // Insert message after the form
  const form = document.getElementById("contact-form");
  if (form) {
    console.log("Inserting message after form");
    form.parentNode.insertBefore(messageDiv, form.nextSibling);

    // Auto-remove message after 5 seconds
    setTimeout(() => {
      if (messageDiv.parentNode) {
        console.log("Auto-removing message");
        messageDiv.remove();
      }
    }, 5000);
  } else {
    console.error("Form not found for message insertion");
  }
}
