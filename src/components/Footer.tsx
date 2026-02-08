import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link
              className="font-display font-bold text-xl tracking-widest text-primary mb-6 block"
              href="/"
            >
              FIT IN <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" />
            </Link>
            <p className="text-xs text-muted leading-relaxed mb-6">
              Luxury redefined for the modern individual. Designed to fit in, styled to stand out.
            </p>
            <div className="flex space-x-4">
              <a
                className="text-muted hover:text-primary transition-colors"
                href="https://www.facebook.com"
                aria-label="Facebook"
                target="_blank"
                rel="noreferrer"
              >
                <span className="material-icons-outlined text-lg">facebook</span>
              </a>
              <a
                className="text-muted hover:text-primary transition-colors"
                href="https://www.instagram.com"
                aria-label="Instagram"
                target="_blank"
                rel="noreferrer"
              >
                <span className="material-icons-outlined text-lg">camera_alt</span>
              </a>
              <a
                className="text-muted hover:text-primary transition-colors"
                href="mailto:hello@fitin.com"
                aria-label="Email"
              >
                <span className="material-icons-outlined text-lg">alternate_email</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-text mb-6">Shop</h4>
            <ul className="space-y-4 text-xs text-muted uppercase tracking-wide">
              <li>
                <Link className="hover:text-primary transition-colors" href="/collections">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="/collections">
                  Bestsellers
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="/collections">
                  Accessories
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="/collections">
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-text mb-6">Company</h4>
            <ul className="space-y-4 text-xs text-muted uppercase tracking-wide">
              <li>
                <Link className="hover:text-primary transition-colors" href="/about">
                  About Us
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="/about">
                  Careers
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="/contact">
                  Contact
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="/stores">
                  Stores
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-text mb-6">Legal</h4>
            <ul className="space-y-4 text-xs text-muted uppercase tracking-wide">
              <li>
                <Link className="hover:text-primary transition-colors" href="/privacy">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="/terms">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" href="/returns">
                  Returns
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-muted">
          <p>© 2023 FIT IN. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <span>Currency: USD</span>
            <span>Language: English</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
