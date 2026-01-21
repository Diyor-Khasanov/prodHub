import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Home, RefreshCcw } from 'lucide-react';
import Toolbar from '../components/Toolbar';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  const springTransition = { type: "spring", stiffness: 300, damping: 20 };

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950 bg-linear-to-br from-slate-950 to-blue-950">

      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/20 blur-[100px] rounded-full"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 60, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full"
        />
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={springTransition}
        className="relative z-10 w-[90%] max-w-xl p-12 rounded-[40px]
          bg-black/40 backdrop-blur-3xl
          border border-white/10 shadow-2xl text-center"
      >
        <motion.div
          className="mx-auto w-24 h-24 mb-8 bg-linear-to-tr from-violet-600 to-blue-500
            rounded-[22px] flex items-center justify-center shadow-lg shadow-blue-500/30"
        >
          <img src="../../public/assets/icon.png" alt="" className='rounded-2xl' />
        </motion.div>

        <h1 className="text-6xl font-bold tracking-tight text-white mb-4">
          404
        </h1>
        <p className="text-lg text-slate-400 mb-10 font-medium">
          The page you're looking for has drifted into deep space.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={'/'}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full bg-white text-black
              font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Home size={18} /> Back Home
            </motion.button></Link>

          <motion.button
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-full bg-white/10 text-white
              font-semibold backdrop-blur-md border border-white/5
              flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
          >
            <RefreshCcw size={18} /> Retry
          </motion.button>
        </div>
      </motion.div>

      <Toolbar />
    </div>
  );
};

export default NotFoundPage;
