"use server"
import { Resend } from "resend"

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendContactEmail(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const message = formData.get("message") as string

    // Validate the form data
    if (!name || !email || !message) {
      return {
        success: false,
        message: "Please fill in all fields",
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email) || /[\r\n]/.test(email)) {
      return {
        success: false,
        message: "Please enter a valid email address",
      }
    }

    // Check if we have the Resend API key
    if (!process.env.RESEND_API_KEY) {
      console.log("Resend API key not found. Using mock implementation.")
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Contact form submission (mock):", {
        name,
        email,
        message,
      })

      return {
        success: true,
        message: "Message sent successfully! We'll get back to you soon.",
      }
    }

    // Create HTML content directly instead of using React component
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h1 style="color: #00ff8c; margin-bottom: 20px;">New Contact Form Submission</h1>
        <p style="font-size: 16px; margin-bottom: 20px;">
          You have received a new message from your website contact form.
        </p>

        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 10px;">
          <p style="margin: 0 0 10px 0;">
            <strong>Name:</strong> ${name}
          </p>
          <p style="margin: 0 0 10px 0;">
            <strong>Email:</strong> ${email}
          </p>
          <p style="margin: 0; white-space: pre-wrap;">
            <strong>Message:</strong>
            <br />
            ${message}
          </p>
        </div>

        <p style="font-size: 14px; color: #666; margin-top: 30px;">
          This email was sent from the contact form on your portfolio website.
        </p>
      </div>
    `

    // Send the email using Resend with HTML content instead of React
    // Ensure replies are sent to the original sender
    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: ["mike@digitalhous.com"],
      subject: `New contact form submission from ${name}`,
      html: htmlContent,
      reply_to: email,
    })

    if (error) {
      console.error("Resend API error:", error)
      return {
        success: false,
        message: "Failed to send message. Please try again later.",
      }
    }

    console.log("Email sent successfully:", data)
    return {
      success: true,
      message: "Message sent successfully! We'll get back to you soon.",
    }
  } catch (error) {
    console.error("Server action error:", error)
    return {
      success: false,
      message: "Failed to send message. Please try again later.",
    }
  }
}
