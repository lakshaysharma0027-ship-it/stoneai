import { JsonLd } from "@/components/blog/JsonLd";
import { sitewideSchemas, reviewSchema } from "@/lib/seo/sitewide-schema";

export function StructuredData() {
  return (
    <JsonLd
      data={[...sitewideSchemas(), reviewSchema()]}
    />
  );
}
