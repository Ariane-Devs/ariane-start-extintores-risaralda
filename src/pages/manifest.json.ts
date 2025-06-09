import type { APIRoute, ImageMetadata } from "astro";
import { getImage } from "astro:assets";

const icon = {
  src: "/icon.png",
  width: 512,
  height: 512,
  format: "png"
};
const maskableIcon = {
  src: "/icon-maskable.png",
  width: 512,
  height: 512,
  format: "png"
};

interface Favicon {
  purpose: 'any' | 'maskable' | 'monochrome';
  src: ImageMetadata;
  sizes: number[];
}

const sizes = [192, 512];
const favicons: Favicon[] = [
  {
    purpose: 'any',
    src: icon as any,
    sizes,
  },
  {
    purpose: 'maskable',
    src: maskableIcon as any,
    sizes,
   },
];

export const GET: APIRoute = async () => {
  const icons = await Promise.all(
    favicons.flatMap((favicon) =>
      favicon.sizes.map(async (size) => {
        const image = await getImage({
          src: favicon.src,
          width: size,
          height: size,
          format: "png",
        });
        return {
          src: image.src,
          sizes: `${image.options.width}x${image.options.height}`,
          type: `image/${image.options.format}`,
          purpose: favicon.purpose,
        };
      }),
    ),
  );

  const manifest = {
    short_name: "Extintoresdelrisaralda",
    name: "Extintoresdelrisaralda",
    icons,
    display: "minimal-ui",
    id: "/",
    start_url: "/",
    theme_color: "#FFEDD5",
    background_color: "#262626",
  };

  return new Response(JSON.stringify(manifest));
};
