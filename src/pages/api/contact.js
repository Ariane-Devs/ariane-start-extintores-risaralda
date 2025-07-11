// API endpoint for handling contact form submissions with reCAPTCHA v3 verification
import { sendContactFormNotification } from "../../utils/emailNotification.js";

export const prerender = false;

export async function POST({ request }) {
  console.log("=== CONTACT API CALLED ===");
  console.log("Request URL:", request.url);
  console.log("Request method:", request.method);

  try {
    // Check content type
    const contentType = request.headers.get("content-type");
    console.log("Content-Type:", contentType);

    let formData;
    let recaptchaToken;
    let contactData;

    // Handle different content types
    if (contentType?.includes("application/x-www-form-urlencoded")) {
      // Handle URL encoded form data
      const text = await request.text();
      const params = new URLSearchParams(text);

      contactData = {
        firstname: params.get("firstname"),
        lastname: params.get("lastname"),
        email: params.get("email"),
        phone: params.get("phone"),
        message: params.get("message"),
        timestamp: new Date().toISOString(),
      };

      recaptchaToken = params.get("recaptcha_token");
    } else if (contentType?.includes("multipart/form-data")) {
      // Handle multipart form data
      formData = await request.formData();
      recaptchaToken = formData.get("recaptcha_token");

      contactData = {
        firstname: formData.get("firstname"),
        lastname: formData.get("lastname"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        message: formData.get("message"),
        timestamp: new Date().toISOString(),
      };
    } else {
      // Try to parse as JSON fallback
      try {
        const jsonData = await request.json();
        contactData = {
          firstname: jsonData.firstname,
          lastname: jsonData.lastname,
          email: jsonData.email,
          phone: jsonData.phone,
          message: jsonData.message,
          timestamp: new Date().toISOString(),
        };
        recaptchaToken = jsonData.recaptcha_token;
      } catch (jsonError) {
        console.error("Failed to parse request body:", jsonError);
        return new Response(
          JSON.stringify({
            success: false,
            message: "Formato de datos inválido",
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
      }
    }

    // Check if we're in development/localhost environment
    const isDevelopment =
      import.meta.env.DEV ||
      request.url.includes("localhost") ||
      request.url.includes("127.0.0.1");

    let recaptchaScore = 1.0; // Default high score for development

    // Skip reCAPTCHA verification in development
    if (!isDevelopment && recaptchaToken) {
      // Verify reCAPTCHA token only in production
      const recaptchaResponse = await fetch(
        "https://www.google.com/recaptcha/api/siteverify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `secret=${import.meta.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
        },
      );

      const recaptchaResult = await recaptchaResponse.json();

      // Check if reCAPTCHA verification was successful
      if (!recaptchaResult.success || recaptchaResult.score < 0.5) {
        return new Response(
          JSON.stringify({
            success: false,
            message:
              "Error de verificación de seguridad. Por favor, inténtalo de nuevo.",
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
      }

      recaptchaScore = recaptchaResult.score;
    } else if (isDevelopment) {
      console.log("Development mode: Skipping reCAPTCHA verification");
    }

    // Add reCAPTCHA score to contact data
    contactData.recaptchaScore = recaptchaScore;

    // Send email notification using the utility function
    const emailSent = await sendContactFormNotification(contactData);

    if (!emailSent) {
      console.warn(
        "Failed to send email notification, but form submission will continue",
      );
    }

    // Log the submission for backup
    console.log("Contact form submission:", contactData);

    // For now, we'll just return a success response
    return new Response(
      JSON.stringify({
        success: true,
        message:
          "¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Error processing contact form:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message:
          "Error interno del servidor. Por favor, inténtalo de nuevo más tarde.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
