"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import { ShoppingBag, ScanLine, LayoutDashboard } from "lucide-react";

const portals = [
  {
    title: "Customer",
    subtitle: "Scan · Try · Pay",
    description:
      "Browse the catalog, scan barcodes, request fitting room items, and checkout — all from your device.",
    href: "/customer",
    icon: ShoppingBag,
  },
  {
    title: "Cashier POS",
    subtitle: "Process · Invoice · Close",
    description:
      "Full point-of-sale interface with barcode scanning, payment processing, and e-receipt generation.",
    href: "/pos",
    icon: ScanLine,
  },
  {
    title: "Fitting Room",
    subtitle: "Manage · Fulfill · Track",
    description:
      "Real-time Kanban board for fitting room orders. Track requests, fulfill items, and manage room occupancy.",
    href: "/staff",
    icon: LayoutDashboard,
  },
];

const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-20 min-h-screen">
      {/* Hero Section */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Floating brand pill */}
        <motion.div
          className="inline-flex items-center gap-2 px-5 py-2 mb-8 glass text-sm"
          style={{ borderRadius: "9999px" }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent-sage)] animate-pulse" />
          <span className="text-[var(--color-text-secondary)]">
            System Online
          </span>
        </motion.div>

        <h1 className="text-5xl sm:text-7xl tracking-tight mb-4 heading-serif">
          crwn
          <span className="text-[var(--color-secondary)]">.</span>
          st
        </h1>

        <motion.p
          className="text-lg sm:text-xl text-[var(--color-text-secondary)] max-w-lg mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Quiet luxury meets seamless retail.
          <br />
          <span className="text-[var(--color-muted)]">
            Choose your portal to begin.
          </span>
        </motion.p>
      </motion.div>

      {/* Portal Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {portals.map((portal, i) => (
          <Link key={portal.href} href={portal.href} className="group">
            <GlassCard
              float
              floatDelay={i}
              className="p-8 h-full flex flex-col gap-6 cursor-pointer"
            >
              {/* Icon Container */}
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center">
                <portal.icon
                  size={24}
                  className="text-[var(--color-base)]"
                  strokeWidth={1.5}
                />
              </div>

              {/* Content */}
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold text-[var(--color-primary)] group-hover:opacity-80 transition-opacity">
                  {portal.title}
                </h2>
                <p className="text-xs font-medium text-[var(--color-secondary)] tracking-[0.15em] uppercase">
                  {portal.subtitle}
                </p>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mt-1">
                  {portal.description}
                </p>
              </div>

              {/* Enter indicator */}
              <div className="mt-auto pt-4 flex items-center gap-2 text-sm text-[var(--color-muted)] group-hover:text-[var(--color-primary)] transition-colors">
                <span>Enter Portal</span>
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  →
                </motion.span>
              </div>
            </GlassCard>
          </Link>
        ))}
      </motion.div>

      {/* Bottom decorative element */}
      <motion.div
        className="mt-20 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <p className="text-xs text-[var(--color-muted)] tracking-[0.2em] uppercase">
          crwn.st — Crown Street
        </p>
      </motion.div>
    </div>
  );
}
