import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function AboutContactForm() {
  return (
    <form
      action="/api/contact"
      method="post"
      className="profile-contact-form"
      data-about-contact-form
    >
      <div className="profile-contact-form-heading">
        <span>DIRECT CHANNEL / EMAIL</span>
        <strong data-contact-state>READY</strong>
      </div>
      <div>
        <label htmlFor="name">Name</label>
        <Input
          id="name"
          name="name"
          placeholder="Enter your name"
          autoComplete="name"
          maxLength={100}
          className="min-h-11"
          required
        />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          maxLength={254}
          className="min-h-11"
          required
        />
      </div>
      <div>
        <label htmlFor="message">Message</label>
        <Textarea
          id="message"
          name="message"
          placeholder="What are you building or hiring for?"
          rows={5}
          maxLength={5_000}
          required
        />
      </div>
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <Input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <Button type="submit" className="min-h-11" data-contact-submit>Send Message</Button>
      <p hidden role="status" aria-live="polite" data-contact-status />
    </form>
  )
}
