import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export function SectionHeader({ title, subtitle, badge, align = "left", className, accent = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("space-y-3", align === "center" && "text-center flex flex-col items-center", className)}
    >
      {accent && (
        <span
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest grain-el"
          style={{
            backgroundColor: "var(--cream-dark)",
            border: "1.5px solid rgba(140,120,100,0.2)",
            color: "var(--ink-muted)",
            boxShadow: "0 2px 8px rgba(100,80,60,0.08), inset 0 1px 0 rgba(255,255,255,0.55)"
          }}
        >
          ✦ {badge || "Intelligence Core"}
        </span>
      )}
      <h2
        className={cn("text-4xl font-black tracking-tight leading-tight", align === "center" && "mx-auto")}
        style={{ color: "var(--ink)", fontFamily: "Playfair Display, serif" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn("text-sm font-medium max-w-xl", align === "center" && "mx-auto")} style={{ color: "var(--ink-muted)" }}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
