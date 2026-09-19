import { AboutPage } from "@/components/sections/about-page";
import { getAboutGalleryPreview } from "@/server/about";

/**
 * Gallery preview of the About page draft.
 * Not a public page — copy stays draft until founders approve.
 */
export async function AboutSpecimen() {
  const about = await getAboutGalleryPreview();

  return (
    <div>
      <h3>About (draft)</h3>
      <p className="ds-support mt-2 max-w-reading">
        Full draft for review, including proposed mission/vision. Public{" "}
        <code>/about</code> stays sparse until page approval. Founder cards stay
        omitted until approved profiles exist.
      </p>
      <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
        <AboutPage
          about={about}
          headingLevel={2}
          idPrefix="gallery-about-"
          showBreadcrumb={false}
        />
      </div>
    </div>
  );
}
