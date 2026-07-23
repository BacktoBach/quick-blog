import { Link } from "react-router-dom";
import logo from "../../assets/logoimg.png";

const footerSections = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", to: "/" },
      { label: "Best Sellers", to: "/"  },
      { label: "Offers & Deals", to: "/"  },
      { label: "Contact Us", to: "/"  },
      { label: "FAQs", to: "/"  },
    ],
  },
  {
    title: "Need Help?",
    links: [
      { label: "Delivery Information", to: "/"  },
      { label: "Return & Refund Policy", to: "/"  },
      { label: "Payment Methods" , to: "/" },
      { label: "Track your Order", to: "/"  },
      { label: "Contact Us", to: "/"  },
    ],
  },
  {
    title: "Follow Us",
    links: [
      { label: "Instagram", to: "/"  },
      { label: "Twitter", to: "/" },
      { label: "Facebook" , to: "/" },
      { label: "YouTube" , to: "/" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#f7f7ff] dark:bg-slate-900">
      <div className="mx-auto grid max-w-7xl gap-x-16 gap-y-11 px-5 py-14 sm:px-8 sm:py-16 md:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_0.9fr] lg:gap-x-20 lg:py-20">
        <div className="max-w-md">
          <Link to="/" aria-label="QuickBlog home" className="inline-flex">
            <img src={logo} alt="QuickBlog" className="h-11 w-11" />
          </Link>
          <p className="mt-7 text-base leading-9 text-slate-900 dark:text-slate-300">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum
            unde quaerat eveniet cumque accusamus atque qui error quo enim
            fugiat?
          </p>
        </div>
        {footerSections.map((section) => (
          <FooterColumn key={section.title} {...section} />
        ))}
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-950 dark:text-white">{title}</h2>
      <ul className="mt-6 space-y-4">
        {links.map((link) => (
          <li key={link.label}>
            <FooterLink {...link} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterLink({ label, to, href }) {
  const className =
    "text-base text-slate-600 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300";

  if (to) {
    return <Link to={to} className={className}>{label}</Link>;
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {label}
      </a>
    );
  }

  return <span className="text-base text-slate-600 dark:text-slate-400">{label}</span>;
}
