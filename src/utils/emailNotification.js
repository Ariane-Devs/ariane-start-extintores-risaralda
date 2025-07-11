// Email notification utility using external API service

/**
 * Send email notification using the external notification service
 * @param {Object} options - Email options
 * @param {string} options.recipient - Email recipient
 * @param {string} options.subject - Email subject
 * @param {string} options.message - Email message content
 * @returns {Promise<boolean>} - Success status
 */
export async function sendEmailNotification({ recipient, subject, message }) {
  try {
    const notificationEndpoint =
      import.meta.env.NOTIFICATION_API_URL ||
      "http://ec2-44-233-162-24.us-west-2.compute.amazonaws.com:8889/api/notifications/send";

    const clientId = import.meta.env.NOTIFICATION_CLIENT_ID;

    const notificationParams = new URLSearchParams({
      client_id: clientId,
      notification_type: "email",
      recipient,
      subject,
      message,
    });

    const response = await fetch(
      `${notificationEndpoint}?${notificationParams}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to send email notification:", errorText);
      return false;
    }

    console.log("Email notification sent successfully to:", recipient);
    return true;
  } catch (error) {
    console.error("Error sending email notification:", error);
    return false;
  }
}

/**
 * Format contact form data into email content
 * @param {Object} contactData - Contact form data
 * @returns {Object} - Formatted email subject and message
 */
export function formatContactEmail(contactData) {
  // Use subject from environment variables
  const subject =
    import.meta.env.CONTACT_EMAIL_SUBJECT || "Solicitud de contacto";

  // Include all form content in the message
  const message = `
DATOS DEL CONTACTO:
• Nombre: ${contactData.firstname} ${contactData.lastname}
• Email: ${contactData.email}
• Teléfono: ${contactData.phone || "No proporcionado"}

INFORMACIÓN TÉCNICA:
• Fecha: ${new Date(contactData.timestamp).toLocaleString("es-CO")}
• Puntuación de seguridad: ${contactData.recaptchaScore}

MENSAJE DEL CLIENTE:
${contactData.message}

Este mensaje fue enviado desde el sitio web de Extintores del Risaralda.
Formulario protegido con reCAPTCHA v3.
  `.trim();

  return { subject, message };
}

/**
 * Send contact form notification email
 * @param {Object} contactData - Contact form data
 * @returns {Promise<boolean>} - Success status
 */
export async function sendContactFormNotification(contactData) {
  const recipientEmail =
    import.meta.env.CONTACT_EMAIL_RECIPIENT ||
    "info@extintoresdelrisaralda.com";
  const { subject, message } = formatContactEmail(contactData);

  return await sendEmailNotification({
    recipient: recipientEmail,
    subject,
    message,
  });
}
