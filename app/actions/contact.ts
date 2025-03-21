"use server"

import { Resend } from "resend"
import { EmailTemplate } from "@/components/email-template"

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendContactEmail(formData: FormData) {
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

  if (!email.includes("@")) {
    return {
      success: false,
      message: "Please enter a valid email address",
    }
  }

  try {
    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>", // Use a verified domain in production
      to: ["mike@digitalhous.com"],
      subject: `New contact form submission from ${name}`,
      reply_to: email,
      react: EmailTemplate({ name, email, message }),
      // Alternatively, you can use text or HTML:
      // text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      // html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`,
    })

    if (error) {
      console.error("Error sending email:", error)
      return {
        success: false,
        message: "Failed to send message. Please try again later.",
      }
    }

    return {
      success: true,
      message: "Message sent successfully!",
    }
  } catch (error) {
    console.error("Error sending email:", error)
    return {
      success: false,
      message: "Failed to send message. Please try again later.",
    }
  }
}

