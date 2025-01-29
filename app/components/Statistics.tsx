import { DollarSign, Clock, Shield } from "lucide-react"

const Statistic = ({ value, label, icon: Icon }: { value: string; label: string; icon: React.ElementType }) => (
  <div className="text-center flex flex-col items-center">
    <Icon className="h-12 w-12 text-yellow-400 mb-4" />
    <div className="text-4xl font-bold text-slate-800 mb-2">{value}</div>
    <div className="text-slate-600">{label}</div>
  </div>
)

export function Statistics() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose AssociateAttorney.ai?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Statistic icon={DollarSign} value="10X" label="Lower Legal Costs" />
          <Statistic icon={Clock} value="24/7" label="AI Availability" />
          <Statistic icon={Shield} value="100%" label="Secure Platform" />
        </div>
      </div>
    </section>
  )
}

