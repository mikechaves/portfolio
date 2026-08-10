"use client"

import { useState, useTransition, type FormEvent } from "react"
import { sendContactEmail } from "@/app/actions/contact"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { trackPortfolioEvent } from "@/lib/portfolio-analytics"

export function AboutContactForm() {
  const [isPending, startTransition] = useTransition()
  const [formStatus, setFormStatus] = useState<{
    success: boolean | null
    message: string | null
  }>({ success: null, message: null })
  const { toast } = useToast()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormStatus({ success: null, message: null })

    const form = event.currentTarget
    const formData = new FormData(form)

    startTransition(async () => {
      try {
        const response = await sendContactEmail(formData)
        setFormStatus({ success: response.success, message: response.message })

        if (response.success) {
          trackPortfolioEvent("portfolio_contact_submitted", { source: "about_form" })
          form.reset()
          toast({ title: "Message sent", description: response.message })
        } else {
          trackPortfolioEvent("portfolio_contact_failed", {
            failure_type: response.failureType ?? "unexpected",
            source: "about_form",
          })
          toast({
            title: "Message not sent",
            description: response.message || "Something went wrong. Please try again.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Form submission error:", error)
        trackPortfolioEvent("portfolio_contact_failed", {
          failure_type: "unexpected",
          source: "about_form",
        })
        setFormStatus({ success: false, message: "An unexpected error occurred. Please try again." })
      }
    })
  }

  return (
    <form className="profile-contact-form" onSubmit={handleSubmit}>
      <div className="profile-contact-form-heading">
        <span>DIRECT CHANNEL / EMAIL</span>
        <strong>{isPending ? "SENDING" : "READY"}</strong>
      </div>
      <div>
        <label htmlFor="name">Name</label>
        <Input id="name" name="name" placeholder="Enter your name" required disabled={isPending} />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <Input id="email" name="email" type="email" placeholder="Enter your email" required disabled={isPending} />
      </div>
      <div>
        <label htmlFor="message">Message</label>
        <Textarea id="message" name="message" placeholder="What are you building or hiring for?" rows={5} required disabled={isPending} />
      </div>
      <Button type="submit" disabled={isPending}>{isPending ? "Sending..." : "Send Message"}</Button>
      {formStatus.message ? (
        <p className={formStatus.success ? "profile-form-success" : "profile-form-error"} role="status">
          {formStatus.message}
        </p>
      ) : null}
    </form>
  )
}
