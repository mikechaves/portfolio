import type * as React from "react";

interface EmailTemplateProps {
  name: string;
  email: string;
  message: string;
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  name,
  email,
  message,
}) => (
  <div
    style={{ fontFamily: "Arial, sans-serif", padding: "20px", color: "#333" }}
  >
    <h1 style={{ color: "#00ff8c", marginBottom: "20px" }}>
      New Contact Form Submission
    </h1>
    <p style={{ fontSize: "16px", marginBottom: "20px" }}>
      You have received a new message from your website contact form.
    </p>

    <div
      style={{
        background: "#f5f5f5",
        padding: "15px",
        borderRadius: "5px",
        marginBottom: "10px",
      }}
    >
      <p style={{ margin: "0 0 10px 0" }}>
        <strong>Name:</strong> {name}
      </p>
      <p style={{ margin: "0 0 10px 0" }}>
        <strong>Email:</strong> {email}
      </p>
      <p style={{ margin: "0", whiteSpace: "pre-wrap" }}>
        <strong>Message:</strong>
        <br />
        {message}
      </p>
    </div>

    <p style={{ fontSize: "14px", color: "#666", marginTop: "30px" }}>
      This email was sent from the contact form on your portfolio website.
    </p>
  </div>
);
