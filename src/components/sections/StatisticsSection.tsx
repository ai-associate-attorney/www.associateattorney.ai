import { DollarSign, Clock, Shield } from "lucide-react";

const StatisticsSection = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-layout mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-6">
                {stat.icon}
              </div>
              <div className="text-4xl font-bold text-slate-800 mb-2">{stat.value}</div>
              <p className="text-slate-600">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const stats = [
  {
    icon: <DollarSign className="w-8 h-8 text-secondary" />,
    value: "90%",
    description: "Cost Reduction",
  },
  {
    icon: <Clock className="w-8 h-8 text-secondary" />,
    value: "24/7",
    description: "Availability",
  },
  {
    icon: <Shield className="w-8 h-8 text-secondary" />,
    value: "100%",
    description: "Secure & Compliant",
  },
];

export default StatisticsSection;