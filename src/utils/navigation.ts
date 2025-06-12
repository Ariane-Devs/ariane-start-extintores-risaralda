// An array of links for navigation bar
const navBarLinks = [
  { name: "Home", url: "/" },
  { name: "Productos", url: "/products" },
  // { name: "Servicios", url: "/services" },
  // { name: "Blog", url: "/blog" },
  { name: "Contáctanos", url: "/contact" },
];

const footerLinks = [
  {
    section: "Company",
    links: [
      { name: "Sobre Nosotros", url: "#" },
      { name: "Blog", url: "/blog" },
    ],
  },
];

const socialLinks = {
  facebook: "https://www.facebook.com/extintorrisaralda/",
  x: "https://twitter.com/",
};

export default {
  navBarLinks,
  footerLinks,
  socialLinks,
};
