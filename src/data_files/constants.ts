import ogImageSrc from "@images/social.png";

export const SITE = {
  title: "Extintoresdelrisaralda",
  tagline: "Top-quality Hardware Tools",
  description:
    "Extintoresdelrisaralda es tu aliado en seguridad contra incendios: venta de extintores, gabinetes, señalización y servicios de instalación y mantenimiento profesional. Protege tu empresa, hogar o proyecto con productos certificados y atención experta en Risaralda y el Eje Cafetero.",
  description_short:
    "Venta de extintores, gabinetes, señalización y servicios de instalación y mantenimiento profesional en Risaralda.",
  url: "https://screwfast.uk",
  author: "Emil ArianeDevs",
};

export const SEO = {
  title: SITE.title,
  description: SITE.description,
  structuredData: {
    "@context": "https://schema.org",
    "@type": "WebPage",
    inLanguage: "en-US",
    "@id": SITE.url,
    url: SITE.url,
    name: SITE.title,
    description: SITE.description,
    isPartOf: {
      "@type": "WebSite",
      url: SITE.url,
      name: SITE.title,
      description: SITE.description,
    },
  },
};

export const OG = {
  locale: "en_US",
  type: "website",
  url: SITE.url,
  title: `${SITE.title}: Extintores del Risaralda`,
  description:
    "Equip your projects with Extintoresdelrisaralda's top-quality hardware tools and expert construction services. Trusted by industry leaders, Extintoresdelrisaralda offers simplicity, affordability, and reliability. Experience the difference with user-centric design and cutting-edge tools. Start exploring now!",
  image: ogImageSrc,
};

export const partnersData = [
  {
    icon: '<img src="/partners/partner1.png" alt="Partner 1" class="mx-auto h-auto w-40 py-3 sm:mx-0 lg:w-70 lg:py-5" />',
    name: "First",
    href: "#",
  },
  {
    icon: '<img src="/partners/partner2.png" alt="Partner 2" class="mx-auto h-auto w-36 py-3 sm:mx-0 lg:w-50 lg:py-5" />',
    name: "Second",
    href: "#",
  },
  {
    icon: '<img src="/partners/partner3.png" alt="Partner 3" class="mx-auto h-auto w-30 py-3 sm:mx-0 lg:w-40 lg:py-5" />',
    name: "Third",
    href: "#",
  },
  {
    icon: '<img src="/partners/partner4.png" alt="Partner 4" class="mx-auto h-auto w-32 py-3 sm:mx-0 lg:w-50 lg:py-5" />',
    name: "Fourth",
    href: "#",
  },
];
