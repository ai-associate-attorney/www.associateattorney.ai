import { DollarSign, Clock, Building2 } from "lucide-react";
import CountUp from "react-countup";
import { useState } from "react";

const StatisticsSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 animate-gradient" />
      
      <div className="max-w-layout mx-auto px-4 relative">
        <h2 className="text-4xl font-bold text-center text-slate-800 mb-16">
          AI-Powered Legal Automation in Numbers
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

const StatCard = ({ icon, value, description, insight }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      className="p-6 rounded-xl transition-all duration-300 hover:bg-white hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-6">
        {icon}
      </div>
      <div className="text-4xl font-bold text-slate-800 mb-2">
        <CountUp
          end={value.number}
          prefix={value.prefix}
          suffix={value.suffix}
          duration={2.5}
          separator=","
        />
      </div>
      <p className="text-slate-600 mb-4">{description}</p>
      
      {/* Hover insight */}
      <div className={`text-sm text-slate-500 transition-all duration-300 ${
        isHovered ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0'
      }`}>
        {insight}
      </div>
    </div>
  );
};

const stats = [
  {
    icon: <Clock className="w-8 h-8 text-secondary" />,
    value: { number: 85, suffix: "%" },
    description: "Time saved on form completion",
    insight: "Automated processes complete in minutes instead of days",
  },
  {
    icon: <DollarSign className="w-8 h-8 text-secondary" />,
    value: { number: 95, suffix: "%" },
    description: "Reduction in form errors",
    insight: "AI-powered validation ensures accuracy and compliance",
  },
  {
    icon: <Clock className="w-8 h-8 text-secondary" />,
    value: { number: 70, suffix: "%" },
    description: "Decrease in client wait time",
    insight: "Clients receive completed documents faster than ever before",
  },
  {
    icon: <Building2 className="w-8 h-8 text-secondary" />,
    value: { number: 3, suffix: "X" },
    description: "Increase in form processing capacity",
    insight: "Handle more client requests without increasing staff",
  },
];

export default StatisticsSection;