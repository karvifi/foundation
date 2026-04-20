/**
 * Reusable JSON-LD structured data component.
 *
 * Server Component. Renders a <script type="application/ld+json"> tag with
 * the provided data serialized safely. The `<` escape prevents breaking out
 * of the script tag if a string payload ever contains "</script>".
 *
 * Usage:
 *   <JsonLd data={{ "@context": "https://schema.org", "@type": "SoftwareApplication", ... }} />
 *
 * Pass an array via `data` to emit multiple nodes in a single @graph document.
 *
 * Security note: the payload must originate from trusted, statically-defined
 * structured data — never from user input. JSON.stringify with the `<` escape
 * is the standard, XSS-safe pattern for emitting JSON-LD in React/Next.js.
 */

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export function JsonLd({ data }: JsonLdProps) {
  const payload = Array.isArray(data)
    ? { "@context": "https://schema.org", "@graph": data }
    : data;

  const json = JSON.stringify(payload).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
