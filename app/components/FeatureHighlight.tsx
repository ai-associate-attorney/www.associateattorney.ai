import { Check } from "lucide-react"

interface FeatureHighlightProps {
  features: string[]
}

export function FeatureHighlight({ features }: FeatureHighlightProps) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-8 mb-12">
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center space-x-3">
            <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
            <span className="text-slate-700 font-medium">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

