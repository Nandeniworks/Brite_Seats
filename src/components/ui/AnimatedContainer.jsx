import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: (stagger = 0.1) => ({
    opacity: 1,
    transition: { staggerChildren: stagger }
  })
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export function AnimatedContainer({ 
  children, 
  className, 
  stagger = 0.1, 
  delay = 0,
  ...props 
}) {
  return (
    <motion.div
      variants={containerVariants}
      custom={stagger}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      className={cn("space-y-6", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedItem({ children, className, ...props }) {
  return (
    <motion.div
      variants={itemVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
