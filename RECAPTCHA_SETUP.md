# Google reCAPTCHA v3 Setup Guide

This project uses Google reCAPTCHA v3 to protect the contact form from spam and abuse.

## Setup Instructions

### 1. Get reCAPTCHA Keys

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin/create)
2. Click on "Create" to register a new site
3. Fill in the form:
   - **Label**: Your site name (e.g., "Extintores del Risaralda")
   - **reCAPTCHA type**: Select "reCAPTCHA v3"
   - **Domains**: Add your domain(s):
     - For development: `localhost`
     - For production: your actual domain (e.g., `extintoresdelrisaralda.com`)
4. Accept the reCAPTCHA Terms of Service
5. Click "Submit"

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Replace the placeholder values in `.env` with your actual keys:

   ```env
   # reCAPTCHA Configuration
   PUBLIC_RECAPTCHA_SITE_KEY=your_actual_site_key_here
   RECAPTCHA_SECRET_KEY=your_actual_secret_key_here

   # Email Notification Configuration
   NOTIFICATION_API_URL=http://ec2-44-233-162-24.us-west-2.compute.amazonaws.com:8889/api/notifications/send
   CONTACT_EMAIL_RECIPIENT=info@extintoresdelrisaralda.com
   ```

### 3. How It Works

1. **Frontend**:

   - The reCAPTCHA script loads automatically when the contact form is displayed
   - When the user submits the form, a token is generated and sent with the form data
   - The form shows loading states and success/error messages

2. **Backend**:

   - The API endpoint (`/api/contact`) receives the form data including the reCAPTCHA token
   - The token is verified with Google's servers
   - Only submissions with a score ≥ 0.5 are accepted
   - Lower scores indicate potential bot activity
   - Upon successful verification, an email notification is sent using the external notification service

3. **Email Notification**:
   - Uses external API: `http://ec2-44-233-162-24.us-west-2.compute.amazonaws.com:8889/api/notifications/send`
   - Sends formatted email with contact details to configured recipient
   - Includes reCAPTCHA score and timestamp for security tracking
   - Gracefully handles email service failures without breaking the form submission

### 4. Security Features

- **Invisible protection**: reCAPTCHA v3 runs in the background without user interaction
- **Score-based verification**: Submissions are scored from 0.0 (bot) to 1.0 (human)
- **Server-side verification**: Tokens are validated on the server to prevent tampering
- **Privacy compliance**: Links to Google's Privacy Policy and Terms of Service are included

### 5. Customization

To modify the reCAPTCHA behavior:

- **Minimum score**: Edit the score threshold in `/src/pages/api/contact.js`
- **Actions**: Modify action names in `/src/assets/scripts/recaptcha.js`
- **Styling**: Update the privacy notice styling in `ContactSection.astro`

### 6. Testing

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Navigate to `/contact` and test the form submission
3. Check the browser console for any errors
4. Verify that the form shows appropriate success/error messages

### 7. Troubleshooting

**Common Issues:**

- **Keys not working**: Make sure you're using the correct environment (development/production) keys
- **Domain errors**: Ensure your domain is registered in the reCAPTCHA admin console
- **Score too low**: The minimum score might be too strict; consider lowering it for testing
- **Network errors**: Check that your server can reach Google's verification API

**Debug Mode:**

Add `console.log` statements in the reCAPTCHA script to debug token generation and form submission.
