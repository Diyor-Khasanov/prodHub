import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, AlertTriangle, XOctagon } from 'lucide-react';

const alertStyles = {
  success: {
    icon: <ShieldCheck className="text-green-400" size={60} strokeWidth={1.5} />,
    title: "Success",
    bg: "bg-green-500/10",
    shadow: "shadow-[0_0_30px_rgba(34,197,94,0.3)]"
  },
  warning: {
    icon: <AlertTriangle className="text-amber-400" size={60} strokeWidth={1.5} />,
    title: "Warning",
    bg: "bg-amber-500/10",
    shadow: "shadow-[0_0_30px_rgba(251,191,36,0.3)]"
  },
  error: {
    icon: <XOctagon className="text-red-400" size={60} strokeWidth={1.5} />,
    title: "Error",
    bg: "bg-red-500/10",
    shadow: "shadow-[0_0_30px_rgba(239,68,68,0.3)]"
  }
};

const MacAlert = ({ type = 'success', message, isOpen, onClose }) => {
  const config = alertStyles[type] || alertStyles.success;

  useEffect(() => {
    if (isOpen && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 backdrop-blur-md bg-black/10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 20, stiffness: 250 }}
            className={`relative w-full max-w-[500px] overflow-hidden ${config.shadow || 'shadow-[0_0_30px_rgba(0,0,0,0.3)]'}`}
            style={{ borderRadius: '32px' }}
          >
            <div className="relative overflow-hidden bg-white/60 dark:bg-black/40 backdrop-blur-3xl border border-white/30 dark:border-white/10 p-6 flex flex-col items-center">

              <div className={`absolute -top-10 -left-10 w-32 h-32 blur-3xl opacity-30 rounded-full ${config.bg}`} />

              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-4 relative z-10"
              >
                {config.icon}
              </motion.div>

              <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                {config.title}
              </h3>

              <p className="text-xl font-medium text-slate-600 dark:text-slate-300 text-center leading-relaxed mb-6">
                {message}
              </p>

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={onClose}
                className="w-full py-4 rounded-2xl bg-white/40 dark:bg-white/10 hover:bg-white/60 dark:hover:bg-white/20 transition-all border border-white/20 dark:border-white/5 shadow-inner"
              >
                <span className="text-[15px] font-bold text-slate-800 dark:text-white">
                  Got It
                </span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MacAlert;
