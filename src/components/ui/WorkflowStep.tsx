import { motion } from "framer-motion";

interface WorkflowStepProps {
  title: string;
  description: string;
  icon: string;
  animation: string;
  index: number;
  inView: boolean;
}

const WorkflowStep = ({ title, description, icon, animation, index, inView }: WorkflowStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="flex items-start gap-6"
    >
      <div className="relative">
        <motion.div
          className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-2xl
                     text-white shadow-lg"
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.3, delay: index * 0.2 }}
        >
          {icon}
        </motion.div>
      </div>

      <div className="flex-1">
        <h3 className="text-xl font-semibold mb-2 text-slate-800">{title}</h3>
        <p className="text-slate-600 mb-4">{description}</p>
        
        {/* Custom animation based on step type */}
        <div className="h-24 bg-white rounded-lg shadow-md p-4">
          {animation === "chat" && (
            <motion.div
              className="w-full h-full bg-blue-50 rounded"
              animate={inView ? { 
                background: ["#EFF6FF", "#DBEAFE", "#EFF6FF"]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
          {animation === "form" && (
            <motion.div
              className="w-full h-2 bg-blue-500 rounded"
              initial={{ width: "0%" }}
              animate={inView ? { width: "100%" } : {}}
              transition={{ duration: 1.5, delay: index * 0.2 }}
            />
          )}
          {animation === "meter" && (
            <motion.div
              className="w-full h-4 bg-green-100 rounded overflow-hidden"
              initial={{ width: "0%" }}
              animate={inView ? { width: "100%" } : {}}
              transition={{ duration: 1.5, delay: index * 0.2 }}
            >
              <motion.div
                className="h-full bg-green-500"
                initial={{ width: "0%" }}
                animate={inView ? { width: "80%" } : {}}
                transition={{ duration: 1, delay: (index * 0.2) + 0.5 }}
              />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default WorkflowStep; 