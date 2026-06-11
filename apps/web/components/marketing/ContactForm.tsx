"use client";

import { useState } from "react";

const CONTACT_EMAIL = "contact@stoneai.in";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = encodeURIComponent(`StoneAI contact from ${name || "website"}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`,
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <label>
        <span>Name</span>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          required
        />
      </label>
      <label>
        <span>Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
        />
      </label>
      <label>
        <span>Message</span>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="How can we help?"
          rows={5}
          required
        />
      </label>
      <button type="submit">Send message</button>
      <p className="contact-form-note">
        This opens your email client addressed to {CONTACT_EMAIL}.
      </p>
      <style>{`
        .contact-form{display:flex;flex-direction:column;gap:18px;border:1px solid rgba(255,255,255,.09);border-radius:24px;background:rgba(255,255,255,.03);padding:28px}
        .contact-form label{display:flex;flex-direction:column;gap:8px}
        .contact-form span{font-size:13px;color:#c5c5cc}
        .contact-form input,.contact-form textarea{background:#0a0a0a;border:1px solid rgba(255,255,255,.12);border-radius:10px;color:#fff;font-size:14px;font-family:inherit;padding:12px 14px;outline:none;resize:vertical}
        .contact-form input:focus,.contact-form textarea:focus{border-color:rgba(255,255,255,.35)}
        .contact-form button{align-self:flex-start;background:#fff;color:#050506;border:0;border-radius:999px;font-size:14px;font-weight:800;padding:12px 22px;cursor:pointer}
        .contact-form button:hover{background:#ececef}
        .contact-form-note{color:#85858f;font-size:12px;margin:0}
      `}</style>
    </form>
  );
}
