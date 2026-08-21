import "server-only"

import { Resend } from "resend"

export type ContactFailureType =
  | "configuration"
  | "validation"
  | "delivery"
  | "unexpected"

export interface ContactSubmissionResult {
  success: boolean
  failureType: ContactFailureType | null
  message: string
}

export const CONTACT_FORM_MAX_BODY_BYTES = 32_768

function textField(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/gu, (character) => {
    switch (character) {
      case "&":
        return "&amp;"
      case "<":
        return "&lt;"
      case ">":
        return "&gt;"
      case '"':
        return "&quot;"
      default:
        return "&#39;"
    }
  })
}

function validationFailure(message: string): ContactSubmissionResult {
  return { success: false, failureType: "validation", message }
}

export async function deliverContactEmail(
  formData: FormData
): Promise<ContactSubmissionResult> {
  try {
    const name = textField(formData, "name")
    const email = textField(formData, "email")
    const message = textField(formData, "message")
    const website = textField(formData, "website")

    // The hidden field lets automated submissions end without provider work.
    if (website) {
      return {
        success: true,
        failureType: null,
        message: "Message sent successfully! We'll get back to you soon.",
      }
    }

    if (!name || !email || !message) {
      return validationFailure("Please fill in all fields")
    }
    if (name.length > 100 || /[\r\n]/u.test(name)) {
      return validationFailure("Please enter a valid name")
    }
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email) || /[\r\n]/u.test(email)) {
      return validationFailure("Please enter a valid email address")
    }
    if (message.length > 5_000) {
      return validationFailure("Please keep your message under 5,000 characters")
    }

    if (!process.env.RESEND_API_KEY) {
      console.warn("Resend API key not configured. Contact form will not send emails.")
      return {
        success: false,
        failureType: "configuration",
        message: "Contact form is not configured. Please try again later or contact directly.",
      }
    }

    const safeName = escapeHtml(name)
    const safeEmail = escapeHtml(email)
    const safeMessage = escapeHtml(message)
    const resend = new Resend(process.env.RESEND_API_KEY)
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h1 style="color: #00ff8c; margin-bottom: 20px;">New Contact Form Submission</h1>
        <p style="font-size: 16px; margin-bottom: 20px;">
          You have received a new message from your website contact form.
        </p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 10px;">
          <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${safeName}</p>
          <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${safeEmail}</p>
          <p style="margin: 0; white-space: pre-wrap;"><strong>Message:</strong><br />${safeMessage}</p>
        </div>
        <p style="font-size: 14px; color: #666; margin-top: 30px;">
          This email was sent from the contact form on your portfolio website.
        </p>
      </div>
    `

    const { error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: ["founder@gowizzo.io"],
      subject: `New contact form submission from ${name}`,
      html: htmlContent,
      reply_to: email,
    })

    if (error) {
      console.error("Resend API error:", error)
      return {
        success: false,
        failureType: "delivery",
        message: "Failed to send message. Please try again later.",
      }
    }

    return {
      success: true,
      failureType: null,
      message: "Message sent successfully! We'll get back to you soon.",
    }
  } catch (error) {
    console.error("Contact delivery error:", error)
    return {
      success: false,
      failureType: "unexpected",
      message: "Failed to send message. Please try again later.",
    }
  }
}
