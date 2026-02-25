import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-foreground text-lg font-bold tracking-tight">
              digitalheavyweights<span className="text-primary">.</span>
            </h3>
            <p className="text-muted text-sm mt-3 leading-relaxed">
              Lead management systems for Eugene contractors. Stop missing leads.
            </p>
            <p className="text-muted text-sm mt-2">Eugene, Oregon</p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-foreground text-sm font-semibold uppercase tracking-wider mb-4">Services</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/services" className="text-muted hover:text-foreground transition-colors duration-200">Lead Management Systems</Link></li>
              <li><Link href="/pricing" className="text-muted hover:text-foreground transition-colors duration-200">Pricing</Link></li>
              <li><Link href="/case-studies/halleman-construction" className="text-muted hover:text-foreground transition-colors duration-200">Case Study</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-foreground text-sm font-semibold uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="text-muted hover:text-foreground transition-colors duration-200">About</Link></li>
              <li><Link href="/blog" className="text-muted hover:text-foreground transition-colors duration-200">Blog</Link></li>
              <li><Link href="/contact" className="text-muted hover:text-foreground transition-colors duration-200">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-foreground text-sm font-semibold uppercase tracking-wider mb-4">Get in Touch</h4>
            <ul className="space-y-3 text-sm text-muted">
              <li><a href="mailto:travis@digitalheavyweights.com" className="hover:text-foreground transition-colors duration-200">travis@digitalheavyweights.com</a></li>
              <li>Eugene, Oregon</li>
              <li>Mon-Fri, 9am-6pm PST</li>
            </ul>
            <Link
              href="/contact"
              className="inline-block mt-5 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]"
            >
              Free Audit
            </Link>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted text-sm">&copy; {new Date().getFullYear()} digitalheavyweights Inc. All rights reserved.</p>
          <p className="text-muted/60 text-xs">Custom lead management systems for contractors in Eugene, OR.</p>
        </div>
      </div>
    </footer>
  );
}
