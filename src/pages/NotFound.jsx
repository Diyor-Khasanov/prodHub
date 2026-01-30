import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Home, RefreshCcw } from 'lucide-react';
import Toolbar from '../components/Toolbar';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  const springTransition = { type: "spring", stiffness: 300, damping: 20 };
  const [bgImage] = useState(localStorage.getItem('bgImage'))

  return (
    <div className="min-h-screen relative w-full flex items-center justify-center p-6 font-sans select-none overflow-hidden bg-slate-950">
      {bgImage && (
        <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xl" />
        </div>
      )}

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={springTransition}
        className="relative z-10 w-[90%] max-w-xl p-12 rounded-[40px]
          bg-black/10 backdrop-blur-3xl
          border border-white/10 shadow-2xl text-center"
      >
        <motion.div
          className="mx-auto w-24 h-24 mb-8 bg-linear-to-tr from-violet-600 to-blue-500
            rounded-[22px] flex items-center justify-center shadow-lg shadow-black/10"
        >
          <img src="/assets/icon.png" alt="" className='rounded-2xl' />
        </motion.div>

        <h1 className="text-6xl font-bold tracking-tight text-white mb-4">
          404
        </h1>
        <p className="text-lg text-gray-400 mb-10 font-medium">
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
