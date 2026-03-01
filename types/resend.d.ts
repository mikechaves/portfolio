declare module 'resend' {
  interface CreateEmailOptions {
    from: string
    to: string[]
    subject: string
    html: string
    reply_to?: string  // This is the correct property name for Resend API
    replyTo?: string   // Keep both for compatibility
    // Add other properties as needed
  }

  interface ResendResponse {
    data?: any
    error?: any
  }

  class Resend {
    constructor(apiKey?: string)
    emails: {
      send(options: CreateEmailOptions): Promise<ResendResponse>
    }
  }

  export { Resend, CreateEmailOptions, ResendResponse }
}
