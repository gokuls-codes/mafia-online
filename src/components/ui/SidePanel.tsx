import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";

type SidePanelProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export function SidePanel({
  isOpen,
  onClose,
  title,
  children,
}: SidePanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-[101] h-full w-full max-w-lg overflow-y-auto border-l border-white/5 bg-zinc-900 shadow-2xl"
          >
            <div className="space-y-8 p-8">
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <h2 className="text-3xl font-cinzel tracking-widest text-accent">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 transition-colors hover:bg-white/5"
                >
                  <X className="h-6 w-6 text-zinc-500" />
                </button>
              </div>
              <div className="space-y-6 pb-12 font-outfit">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
