type TemplateInput = {
  fullName?: string | null;
  actionUrl: string;
};

const shell = ({
  title,
  body,
  actionUrl,
  actionLabel,
}: {
  title: string;
  body: string;
  actionUrl: string;
  actionLabel: string;
}) => `
  <div style="margin:0;background:#050505;color:#fafafa;font-family:Inter,Arial,sans-serif;padding:40px 0;">
    <div style="margin:0 auto;max-width:520px;padding:0 24px;">
      <div style="height:32px;width:32px;border-radius:8px;background:#fafafa;color:#050505;display:inline-flex;align-items:center;justify-content:center;font-weight:800;">S</div>
      <div style="margin-top:28px;border:1px solid #1a1a1a;border-radius:14px;background:#0a0a0a;padding:32px;">
        <p style="margin:0 0 12px;color:#71717a;font-size:11px;letter-spacing:.12em;text-transform:uppercase;">StoneAI</p>
        <h1 style="margin:0 0 16px;color:#fafafa;font-size:28px;line-height:1.1;letter-spacing:-.04em;">${title}</h1>
        <p style="margin:0 0 24px;color:#a1a1aa;font-size:15px;line-height:1.7;">${body}</p>
        <a href="${actionUrl}" style="display:inline-block;border-radius:8px;background:#fafafa;color:#050505;font-size:13px;font-weight:700;text-decoration:none;padding:12px 18px;">${actionLabel}</a>
        <p style="margin:28px 0 0;color:#52525b;font-size:12px;line-height:1.6;">If the button does not work, paste this link into your browser:<br />${actionUrl}</p>
      </div>
    </div>
  </div>
`;

export const verificationEmailTemplate = ({ fullName, actionUrl }: TemplateInput) =>
  shell({
    title: "Verify your email",
    body: `Welcome${fullName ? `, ${fullName}` : ""}. Confirm your email address to unlock your StoneAI workspace and start saving projects securely.`,
    actionUrl,
    actionLabel: "Verify email",
  });

export const passwordResetEmailTemplate = ({ actionUrl }: TemplateInput) =>
  shell({
    title: "Reset your password",
    body: "Use this secure link to choose a new password for your StoneAI account. The link can only be used for this reset flow.",
    actionUrl,
    actionLabel: "Reset password",
  });

export const welcomeEmailTemplate = ({ fullName, actionUrl }: TemplateInput) =>
  shell({
    title: "Welcome to StoneAI",
    body: `You are in${fullName ? `, ${fullName}` : ""}. Your workspace is ready for authenticated projects, persistent edits, and secure ownership.`,
    actionUrl,
    actionLabel: "Open dashboard",
  });
