import React from "react";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="max-w-7xl mx-auto px-4 pt-12 text-center">
        {/* Brand */}
        <div className="mb-8">
          <Link href="/" className="inline-block">
            <span className="bg-primary px-2 py-1 font-extrabold text-white rounded-l-md">
              Net
            </span>
            <span className="font-extrabold text-secondary px-2 py-1 border-y border-r rounded-r-md">
              Forms
            </span>
          </Link>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto">
            Create powerful forms with AI assistance. Streamline your data
            collection process.
          </p>
        </div>

        {/* Contact Info */}
        <div className="mb-8">
          <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
          <div className="flex flex-col items-center space-y-3">
            <div className="flex items-center space-x-3 text-muted-foreground">
              <a
                href="mailto:help.netforms@gmail.com"
                className="flex items-center space-x-3 hover:text-secondary transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>help.netforms@gmail.com</span>
              </a>
            </div>
            <div className="flex items-center space-x-3 text-muted-foreground">
              <a
                href="tel:+2349012446975"
                className="flex items-center space-x-3 hover:text-secondary transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>+234 9012 44 6975</span>
              </a>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="mb-8">
          <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
          <div className="flex justify-center space-x-4">
          <a
              href="https://instagram.com/netforms.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-muted p-2 rounded-full hover:bg-primary transition-colors"
            >
              <Instagram className="w-5 h-5 hover:text-white" />
              <span className="sr-only">Instagram</span>
            </a>
            <a
              // href="https://twitter.com"
              // target="_blank"
              // rel="noopener noreferrer"
              className="bg-muted p-2 rounded-full hover:bg-primary transition-colors"
            >
              <Twitter className="w-5 h-5 hover:text-white" />
              <span className="sr-only">Twitter</span>
            </a>
            
            <a
              // href="https://linkedin.com"
              // target="_blank"
              // rel="noopener noreferrer"
              className="bg-muted p-2 rounded-full hover:bg-primary transition-colors"
            >
              <Linkedin className="w-5 h-5 hover:text-white" />
              <span className="sr-only">LinkedIn</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border text-center text-muted-foreground mb-6">
          <p>© {new Date().getFullYear()} NetForms. All rights reserved.</p>
          <div className="mt-2 space-x-4 text-sm">
            <Link
              href="/privacy"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
          </div>

          {/* <div className="mt-5 mb-5">
            <hr className="w-40 mx-auto" />
            <Link
              href="#"
              className=" transition-colors text-sm"
            >
              Powered by <span className="hover:text-primary">NeTcrest</span>
            </Link>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
