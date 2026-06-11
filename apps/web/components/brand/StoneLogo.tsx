import Image from "next/image";
import { STONEAI_LOGO_ALT, STONEAI_LOGO_SRC } from "@/lib/brand";

type StoneLogoProps = {
  size?: number;
  showWordmark?: boolean;
  className?: string;
  wordmarkClassName?: string;
  priority?: boolean;
};

export function StoneLogo({
  size = 28,
  showWordmark = true,
  className = "",
  wordmarkClassName = "",
  priority = false,
}: StoneLogoProps) {
  return (
    <span className={`stone-brand-logo ${className}`.trim()} aria-label={STONEAI_LOGO_ALT}>
      <Image
        src={STONEAI_LOGO_SRC}
        alt={STONEAI_LOGO_ALT}
        width={size}
        height={size}
        priority={priority}
        className="stone-brand-logo-image"
        style={{ width: size, height: size }}
      />
      {showWordmark ? <span className={`stone-brand-wordmark ${wordmarkClassName}`.trim()}>StoneAI</span> : null}
    </span>
  );
}
