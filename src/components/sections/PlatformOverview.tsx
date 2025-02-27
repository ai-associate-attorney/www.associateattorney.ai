import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import WorkflowStep from "../ui/WorkflowStep";

const PlatformOverview = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const steps = [
    {
      title: "Initiate",
      description: "User starts a conversation with the AI legal assistant",
      icon: "1",
      animation: "chat",
    },
    {
      title: "Inform",
      description: "User answers questions in natural language once",
      icon: "2",
      animation: "form",
    },
    {
      title: "Generate",
      description: "AI automatically fills all relevant legal forms",
      icon: "3",
      animation: "document",
    },
    {
      title: "Review",
      description: "Quick validation workflow for the attorney",
      icon: "4",
      animation: "check",
    },
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-center mb-16 text-slate-800"
        >
          How Our Platform Works
        </motion.h2>

        <div ref={ref} className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6 relative">
            {steps.map((step, index) => (
              <WorkflowStep
                key={index}
                {...step}
                index={index}
                inView={inView}
              />
            ))}
            
            {/* Desktop: Horizontal connecting line */}
            <div className="hidden md:block absolute top-[40px] left-[60px] right-[60px] w-[calc(100%-120px)] h-1 bg-blue-100 z-0">
              <motion.div
                className="absolute left-0 top-0 h-full bg-blue-500"
                initial={{ width: "0%" }}
                animate={inView ? { width: "100%" } : { width: "0%" }}
                transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
              />
            </div>
            
            {/* Mobile: Vertical connecting line */}
            <div className="md:hidden absolute left-[40px] top-[60px] bottom-[60px] w-1 h-[calc(100%-120px)] bg-blue-100 z-0">
              <motion.div
                className="absolute left-0 top-0 w-full bg-blue-500"
                initial={{ height: "0%" }}
                animate={inView ? { height: "100%" } : { height: "0%" }}
                transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
              />
            </div>
          </div>
        </div>

        {/* Workflow explanation with vertical bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="max-w-4xl mx-auto mt-16 p-6 bg-white rounded-lg shadow-md border-l-4 border-blue-500"
        >
          <h3 className="text-xl font-semibold mb-3 text-slate-800">Streamlined Legal Process</h3>
          <p className="text-slate-600">
            Our platform transforms complex legal workflows into a simple four-step process, 
            reducing time spent on paperwork by up to 80%. The intuitive design guides users 
            from initial conversation to final document review, ensuring accuracy while 
            dramatically improving efficiency.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-16"
        >
          <a
            href="/demo"
            className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg 
                     font-semibold hover:bg-blue-700 transition-colors
                     shadow-lg hover:shadow-xl"
          >
            Try AI-Powered Legal Workflow – Book a Demo
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default PlatformOverview;