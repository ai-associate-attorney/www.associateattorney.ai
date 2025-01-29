import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="mx-auto px-4 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="AssociateAttorney.ai Logo"
            width={160}
            height={160}
            className="h-8 w-auto"
          />
        </Link>
        <nav className="flex items-center gap-6">
          <Button
            variant="ghost"
            className="text-slate-600 hover:text-slate-900"
            onClick={() => window.location.href = 'https://www.associateattorney.ai/onboarding/'}
          >
            For Law Firms
          </Button>
          <Button
            variant="outline"
            className="border-slate-200 text-slate-900 hover:bg-slate-50"
            onClick={() => window.location.href = 'https://app.associateattorney.ai/login'}
          >
            Login
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;