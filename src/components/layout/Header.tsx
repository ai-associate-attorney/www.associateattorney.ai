import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-layout mx-auto px-6 py-5 flex items-center justify-between">
        <div className="text-xl font-bold text-slate-900">AssociateAttorney.ai</div>
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