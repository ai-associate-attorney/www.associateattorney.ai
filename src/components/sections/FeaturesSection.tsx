import { Bot, FileText, LineChart, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const FeaturesSection = () => {
  return (
    <>
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Our Platform Features
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-16"
          >
            Why Choose Associate Attorney AI?
          </motion.h2>
          
          <div className="max-w-6xl mx-auto">
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl md:text-3xl font-bold text-center text-slate-900 mb-12"
            >
              AI-Powered Legal Automation in Numbers
            </motion.h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { value: "90%", text: "Time Saved on Document Processing" },
                { value: "24/7", text: "Availability for Client Support" },
                { value: "99%", text: "Accuracy in Form Completion" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
                  className="text-center p-6"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 100,
                      delay: 0.5 + index * 0.2 
                    }}
                    className="text-4xl font-bold text-yellow-400 mb-2"
                  >
                    {stat.value}
                  </motion.div>
                  <p className="text-slate-600">{stat.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const FeatureCard = ({ feature, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="text-center p-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-slate-50 border border-gray-100"
    >
      <motion.div 
        className="inline-flex items-center justify-center mb-6"
        whileHover={{ scale: 1.1 }}
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {feature.icon}
        </motion.div>
      </motion.div>
      <h3 className="text-xl font-semibold mb-4 text-slate-900">
        {feature.title}
      </h3>
      <p className="text-slate-600 mb-6 leading-relaxed">
        {feature.description}
      </p>
      {feature.confidenceScore && (
        <div className="mb-6">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-yellow-400"
              initial={{ width: 0 }}
              animate={{ width: `${feature.confidenceScore}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <p className="text-sm text-slate-600 mt-2">
            Confidence Score: {feature.confidenceScore}%
          </p>
        </div>
      )}
      <a
        href={feature.link}
        className="text-primary font-medium hover:text-yellow-500 transition-colors"
      >
        {feature.linkText}
      </a>
    </motion.div>
  );
};

const features = [
  {
    icon: <Bot className="w-12 h-12 text-yellow-400" />,
    title: "AI Form Assistant",
    description: "Conversational form filling that remembers context across all documents, making client intake seamless and efficient.",
    linkText: "Try It Now",
    link: "#"
  },
  {
    icon: <FileText className="w-12 h-12 text-yellow-400" />,
    title: "Once-Only Input",
    description: "Enter information once and populate everywhere automatically, eliminating redundant data entry and saving valuable time.",
    linkText: "See How It Works",
    link: "#"
  },
  {
    icon: <LineChart className="w-12 h-12 text-yellow-400" />,
    title: "Error Prevention",
    description: "AI validation prevents common legal documentation mistakes, ensuring accuracy and compliance in all your filings.",
    linkText: "Learn More",
    link: "#",
    confidenceScore: 95
  }
];

export default FeaturesSection;