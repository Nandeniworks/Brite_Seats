import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export function GlassCard({ children, className, gradient = false, variant = "default", ...props }) {
  return (
    <motion.div
      className={cn("cream-card grain-el p-6 overflow-hidden", className)}
      {...props}
    >
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none rounded-[20px]" />
      )}
      {children}
    </motion.div>
  );
}
