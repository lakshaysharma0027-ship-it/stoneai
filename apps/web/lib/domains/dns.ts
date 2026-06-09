import { resolveCname, resolveTxt } from "node:dns/promises";
import {
  normalizeDomainName,
  STONEAI_CUSTOM_DOMAIN_TARGET,
} from "@/lib/domains/config";
export { normalizeDomainName, STONEAI_CUSTOM_DOMAIN_TARGET, STONEAI_ROOT_DOMAIN } from "@/lib/domains/config";

export type VerificationType = "txt" | "cname";

export type DomainVerificationRecord = {
  type: VerificationType;
  host: string;
  value: string;
};

export const getVerificationRecord = (
  domain: string,
  token: string,
  type: VerificationType = "txt",
): DomainVerificationRecord => {
  const normalizedDomain = normalizeDomainName(domain);

  if (type === "cname") {
    return {
      type,
      host: normalizedDomain,
      value: STONEAI_CUSTOM_DOMAIN_TARGET,
    };
  }

  return {
    type,
    host: `_stoneai.${normalizedDomain}`,
    value: `stoneai-site-verification=${token}`,
  };
};

const cleanDnsValue = (value: string) =>
  value.trim().toLowerCase().replace(/\.$/, "");

export const checkDnsVerification = async (
  record: DomainVerificationRecord,
): Promise<{ verified: boolean; reason?: string }> => {
  try {
    if (record.type === "txt") {
      const txtRecords = await resolveTxt(record.host);
      const values = txtRecords.map((parts) => parts.join(""));
      const verified = values.includes(record.value);
      return verified
        ? { verified }
        : { verified, reason: `TXT record found, but not ${record.value}.` };
    }

    const cnameRecords = await resolveCname(record.host);
    const expected = cleanDnsValue(record.value);
    const verified = cnameRecords.some((value) => cleanDnsValue(value) === expected);
    return verified
      ? { verified }
      : { verified, reason: `CNAME record found, but not ${record.value}.` };
  } catch (error) {
    return {
      verified: false,
      reason: error instanceof Error ? error.message : "DNS lookup failed.",
    };
  }
};
