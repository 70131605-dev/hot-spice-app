import Image from "next/image";
import Link from "next/link";
import { CONTENT_WIDTH_CLASS } from "@/lib/constants";

// lucide-react no longer ships brand/social logos, so these are small
// hand-drawn glyphs instead of pulling in a separate icon package.
function YoutubeGlyph() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor">
      <path d="M22 12s0-3.2-.4-4.7a3 3 0 0 0-2.1-2.1C17.9 4.8 12 4.8 12 4.8s-5.9 0-7.5.4a3 3 0 0 0-2.1 2.1C2 8.8 2 12 2 12s0 3.2.4 4.7a3 3 0 0 0 2.1 2.1c1.6.4 7.5.4 7.5.4s5.9 0 7.5-.4a3 3 0 0 0 2.1-2.1c.4-1.5.4-4.7.4-4.7Zm-12 3V9l5.2 3-5.2 3Z" />
    </svg>
  );
}

function InstagramGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={18}
      height={18}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookGlyph() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor">
      <path d="M14 22v-8h2.7l.4-3.2H14V8.7c0-.9.3-1.6 1.6-1.6h1.7V4.2C17 4.1 15.9 4 14.7 4 12 4 10.2 5.6 10.2 8.4v2.4H7.5V14h2.7v8h3.8Z" />
    </svg>
  );
}

const COLUMN_1 = [
  { href: "/about", label: "About Us" },
  { href: "/favorites", label: "My Favorites" },
  { href: "/addresses", label: "My Addresses" },
];

const COLUMN_2 = [
  { href: "/menu", label: "Explore Menu" },
  { href: "/orders", label: "Track Order" },
  { href: "/about", label: "Contact Us" },
];

export function Footer() {
  return (
    <footer className="border-t border-[#eee] bg-white pb-20 md:pb-0">
      <div className={`mx-auto ${CONTENT_WIDTH_CLASS} px-4 py-10`}>
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/logo.jpeg"
            alt="Hot N Spicy Pizza & Grill"
            width={1374}
            height={1145}
            className="h-16 w-auto"
          />
          <div className="flex items-center gap-3">
            <a
              href="#"
              aria-label="YouTube"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fafafa] text-[#1a1a1a] hover:bg-brand-tint hover:text-brand"
            >
              <YoutubeGlyph />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fafafa] text-[#1a1a1a] hover:bg-brand-tint hover:text-brand"
            >
              <InstagramGlyph />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fafafa] text-[#1a1a1a] hover:bg-brand-tint hover:text-brand"
            >
              <FacebookGlyph />
            </a>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3">
          <div className="flex flex-col gap-3">
            {COLUMN_1.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-semibold text-[#555] hover:text-brand"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            {COLUMN_2.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-semibold text-[#555] hover:text-brand"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-sm font-semibold text-[#555]">
              042-111-000-111
            </p>
            <p className="mt-2 text-sm font-semibold text-[#555]">
              support@hotandspice.pk
            </p>
            <p className="mt-2 text-sm font-semibold text-[#555]">
              Lahore, Pakistan
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-[#eee] pt-6 text-center text-xs text-[#999]">
          © {new Date().getFullYear()} Hot &amp; Spice. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
