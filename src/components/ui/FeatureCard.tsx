import { Check } from "lucide-react";
import { Button } from "./button";

interface FeatureCardProps {
  title: string;
  benefits: string[];
  ctaText: string;
  ctaLink?: string;
  isExternalLink?: boolean;
}

const FeatureCard = ({ title, benefits, ctaText, ctaLink, isExternalLink }: FeatureCardProps) => {
  const handleClick = () => {
    if (isExternalLink && ctaLink) {
      window.location.href = ctaLink;
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-subtle">
      <h3 className="text-2xl font-bold mb-6">{title}</h3>
      <ul className="space-y-4 mb-8">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
            <span className="text-slate-700">{benefit}</span>
          </li>
        ))}
      </ul>
      <Button className="w-full" onClick={handleClick}>{ctaText}</Button>
    </div>
  );
};

export default FeatureCard;