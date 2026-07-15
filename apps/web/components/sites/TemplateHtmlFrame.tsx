type Props = {
  src: string;
  title?: string;
  className?: string;
};

export function TemplateHtmlFrame({ src, title = "Website preview", className }: Props) {
  return (
    <iframe
      title={title}
      src={src}
      className={className ?? "template-html-frame"}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "100dvh",
        border: "none",
        display: "block",
        background: "#000",
        touchAction: "manipulation",
      }}
      loading="lazy"
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      allow="fullscreen"
    />
  );
}
