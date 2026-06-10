import type { CustomDomainRow } from "../types";

export type DomainDisplayStatus =
  | "Pending"
  | "Verifying"
  | "Verified"
  | "Active"
  | "Failed"
  | "Disconnected";

export const getDomainDisplayStatus = (
  domain: CustomDomainRow,
  isVerifying: boolean,
): DomainDisplayStatus => {
  if (isVerifying) return "Verifying";
  switch (domain.status) {
    case "pending":
      return "Pending";
    case "verified":
      return "Verified";
    case "active":
      return "Active";
    case "failed":
      return "Failed";
    default:
      return "Disconnected";
  }
};

export const domainStatusClass = (status: DomainDisplayStatus) => {
  switch (status) {
    case "Pending":
      return "tag-pending";
    case "Verifying":
      return "tag-verifying";
    case "Verified":
      return "tag-verified";
    case "Active":
      return "tag-active";
    case "Failed":
      return "tag-failed";
    default:
      return "tag-disconnected";
  }
};

export const copyToClipboard = async (value: string) => {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    // fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = value;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }
};
