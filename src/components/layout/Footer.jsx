import { Link } from "react-router-dom";

const quickLinks = [
  ["Home", "/"],
  ["My Posts", "/my-posts"],
  ["New Post", "/posts/new"],
];
const helpLinks = ["About QuickBlog", "Contact Us", "Privacy Policy"];
const socialLinks = ["Instagram", "Twitter", "Facebook", "YouTube"];

export default function Footer() {
  return (
    <footer className="bg-indigo-50/50 dark:bg-gray-900">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="QuickBlog" className="h-9 w-9 object-cover object-left" />
            <span className="text-xl font-bold text-slate-900 dark:text-white">Quickblog</span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-7 text-gray-600 dark:text-gray-400">
            A simple space to share ideas, stories, and useful things with the community.
          </p>
        </div>
        <FooterColumn title="Quick Links" links={quickLinks} />
        <FooterColumn title="Need Help?" links={helpLinks.map((label) => [label, "/"])} />
        <FooterColumn title="Follow Us" links={socialLinks.map((label) => [label, "/"])} />
      </div>
      <div className="border-t border-indigo-100 px-6 py-5 text-center text-xs text-gray-500 dark:border-gray-800">
        Copyright {new Date().getFullYear()} QuickBlog. All rights reserved.
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h2 className="font-semibold text-gray-900 dark:text-white">{title}</h2>
      <ul className="mt-5 space-y-3">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link to={href} className="text-sm text-gray-600 hover:text-indigo-600 dark:text-gray-400">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
