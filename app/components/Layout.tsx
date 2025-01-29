import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Github, Linkedin } from "lucide-react"
import type React from "react"
import Image from "next/image"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-[1920px] mx-auto px-6 py-2 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src="/logo.png" 
              alt="AssociateAttorney.ai Logo" 
              width={240}
              height={40}
              className="h-8 w-[240px] object-contain"
              priority
            />
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="https://www.associateattorney.ai/onboarding/">
              <Button variant="ghost">For Law Firms</Button>
            </Link>
            <Link href="https://app.associateattorney.ai/login">
              <Button variant="outline">Login</Button>
            </Link>
          </div>
        </div>
      </nav>
      <main className="flex-grow">{children}</main>
      <footer className="bg-slate-800 text-white py-16">
        <div className="max-w-[1920px] mx-auto px-6 text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="https://talent.associateattorney.ai/">
                    We are hiring
                  </Link>
                </li>
                <li>
                  <Link href="https://www.associateattorney.ai/forms/">
                    Legal Forms AI Assistant
                  </Link>
                </li>
                <li>
                  <Link href="https://www.associateattorney.ai/cases/">
                    Legal Cases AI Assistant
                  </Link>
                </li>
                <li>
                  <Link href="https://www.associateattorney.ai/blogs/">
                    Blogs
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xl font-semibold mb-6">Contact</h3>
              <ul className="space-y-3">
                <li>
                  <a href="mailto:vikas@associateattorney.ai">
                    vikas@associateattorney.ai
                  </a>
                </li>
                <li>
                  <a href="tel:775-443-6747">
                    775-443-6747
                  </a>
                </li>
                <li>101 S. California Ave. #D100A Palo Alto, CA 94306</li>
              </ul>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-6 mt-12">
            <a href="#" className="hover:opacity-80" aria-label="GitHub">
              <Github className="h-6 w-6" />
            </a>
            <a href="#" className="hover:opacity-80" aria-label="LinkedIn">
              <Linkedin className="h-6 w-6" />
            </a>
          </div>

          {/* Copyright and Legal */}
          <div className="mt-12 text-center space-y-4">
            <p>&copy; 2025 AI Associate Attorney. All rights reserved.</p>
            <p className="text-sm text-slate-400">
              Legal disclaimer: Results may vary. AI assistance should be reviewed by qualified legal professionals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

