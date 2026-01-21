import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
  const [time, setTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(true);
  // Получаем изображение из локального хранилища
  const [bgImage, setBgImage] = useState(localStorage.getItem('bgImage'));

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: !is24Hour,
    });
  };

  const timeString = formatTime();

  return (
    <div className='relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden font-sans text-white'>

      {/* ЛОГИКА ФОНА */}
      {bgImage ? (
        // Вариант 1: Если есть картинка
        <div
          className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        </div>
      ) : (
        // Вариант 2: Если картинки нет — ваш оригинальный анимированный фон
        <div className="absolute inset-0 z-0 bg-slate-950 bg-linear-to-br from-slate-950 to-blue-950">
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
      )}

      {/* ОСНОВНОЙ КОНТЕНТ */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className='relative z-10 w-[90%] max-w-xl p-12 rounded-[40px] bg-black/40 backdrop-blur-3xl border border-white/10 shadow-2xl text-center'
      >
        <div className="flex justify-center items-center text-6xl md:text-8xl font-mono font-bold tracking-tighter">
          {timeString.split('').map((char, index) => (
            <div key={index} className="relative overflow-hidden h-[100px] flex items-center">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={char + index}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -40, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "backOut" }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 items-center">
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIs24Hour(!is24Hour)}
              className="px-6 py-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-all text-sm font-semibold"
            >
              {is24Hour ? "Switch to 12H" : "Switch to 24H"}
            </motion.button>

            <Link to="/settings">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-6 py-2 rounded-full bg-blue-600/30 border border-blue-400/30 hover:bg-blue-600/50 transition-all text-sm font-semibold"
              >
                Settings
              </motion.button>
            </Link>
          </div>

          <p className="text-xs uppercase tracking-[0.4em] opacity-40 font-medium">
            Current Local Time
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
