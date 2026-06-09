import type { SupabaseClient } from "@supabase/supabase-js";
import {
  checkDnsVerification,
  getVerificationRecord,
  normalizeDomainName,
  type VerificationType,
} from "@/lib/domains/dns";

export type DomainStatus = "pending" | "verified" | "active" | "failed";

export type CustomDomain = {
  id: string;
  userId: string;
  siteId: string | null;
  domain: string;
  status: DomainStatus;
  verificationToken: string;
  verificationType: VerificationType;
  verificationHost: string;
  verificationValue: string;
  verifiedAt: string | null;
  lastCheckedAt: string | null;
  failureReason: string | null;
  createdAt: string;
};

type DomainRow = {
  id: string;
  user_id: string;
  site_id: string | null;
  domain: string;
  status: DomainStatus;
  verification_token: string;
  verification_type: VerificationType;
  verification_host: string;
  verification_value: string;
  verified_at: string | null;
  last_checked_at: string | null;
  failure_reason: string | null;
  created_at: string;
};

const domainSelect =
  "id,user_id,site_id,domain,status,verification_token,verification_type,verification_host,verification_value,verified_at,last_checked_at,failure_reason,created_at";

const toCustomDomain = (row: DomainRow): CustomDomain => ({
  id: row.id,
  userId: row.user_id,
  siteId: row.site_id,
  domain: row.domain,
  status: row.status,
  verificationToken: row.verification_token,
  verificationType: row.verification_type,
  verificationHost: row.verification_host,
  verificationValue: row.verification_value,
  verifiedAt: row.verified_at,
  lastCheckedAt: row.last_checked_at,
  failureReason: row.failure_reason,
  createdAt: row.created_at,
});

export const domainService = {
  async listDomains(
    supabase: SupabaseClient,
    userId: string,
  ): Promise<CustomDomain[]> {
    const { data, error } = await supabase
      .from("domains")
      .select(domainSelect)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return ((data ?? []) as DomainRow[]).map(toCustomDomain);
  },

  async createDomain(
    supabase: SupabaseClient,
    input: {
      userId: string;
      siteId?: string | null;
      domain: string;
      verificationType?: VerificationType;
    },
  ): Promise<CustomDomain> {
    const domain = normalizeDomainName(input.domain);
    const verificationType = input.verificationType ?? "txt";
    const verificationToken = crypto.randomUUID().replaceAll("-", "");
    const verificationRecord = getVerificationRecord(
      domain,
      verificationToken,
      verificationType,
    );

    const { data, error } = await supabase
      .from("domains")
      .insert({
        user_id: input.userId,
        site_id: input.siteId ?? null,
        domain,
        status: "pending",
        verification_token: verificationToken,
        verification_type: verificationRecord.type,
        verification_host: verificationRecord.host,
        verification_value: verificationRecord.value,
      })
      .select(domainSelect)
      .single();

    if (error) throw error;
    return toCustomDomain(data as DomainRow);
  },

  async verifyDomain(
    supabase: SupabaseClient,
    input: {
      userId: string;
      domainId: string;
    },
  ): Promise<CustomDomain> {
    const { data: existingDomain, error: lookupError } = await supabase
      .from("domains")
      .select(domainSelect)
      .eq("id", input.domainId)
      .eq("user_id", input.userId)
      .single();

    if (lookupError) throw lookupError;

    const domain = toCustomDomain(existingDomain as DomainRow);
    const verification = await checkDnsVerification({
      type: domain.verificationType,
      host: domain.verificationHost,
      value: domain.verificationValue,
    });

    const status: DomainStatus = verification.verified
      ? domain.siteId
        ? "active"
        : "verified"
      : "failed";
    const { data, error } = await supabase
      .from("domains")
      .update({
        status,
        verified_at: verification.verified ? new Date().toISOString() : null,
        last_checked_at: new Date().toISOString(),
        failure_reason: verification.verified ? null : verification.reason,
      })
      .eq("id", input.domainId)
      .eq("user_id", input.userId)
      .select(domainSelect)
      .single();

    if (error) throw error;
    return toCustomDomain(data as DomainRow);
  },

  async activateDomain(
    supabase: SupabaseClient,
    input: {
      userId: string;
      domainId: string;
    },
  ): Promise<CustomDomain> {
    const { data, error } = await supabase
      .from("domains")
      .update({ status: "active" })
      .eq("id", input.domainId)
      .eq("user_id", input.userId)
      .in("status", ["verified", "active"])
      .select(domainSelect)
      .single();

    if (error) throw error;
    return toCustomDomain(data as DomainRow);
  },

  async removeDomain(
    supabase: SupabaseClient,
    input: {
      userId: string;
      domainId: string;
    },
  ) {
    const { error } = await supabase
      .from("domains")
      .delete()
      .eq("id", input.domainId)
      .eq("user_id", input.userId);

    if (error) throw error;
  },
};
