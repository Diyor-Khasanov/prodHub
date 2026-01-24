import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const musicOptions = [
  { id: 'none', name: 'No Music', url: '' },
  { id: 'airplane', name: 'Airplane', url: '/public/sounds/airplane.mp3' },
  { id: 'brown-noise', name: 'Brown Noise', url: '/public/sounds/brown-noise.mp3' },
  { id: 'bubbles', name: 'Bubbles', url: '/public/sounds/bubbles.mp3' },
  { id: 'campfire', name: 'Campfire', url: '/public/sounds/campfire.mp3' },
  { id: 'cicada', name: 'Cicada', url: '/public/sounds/cicada.mp3' },
  { id: 'city-scape', name: 'City Scape', url: '/public/sounds/city-scape.mp3' },
  { id: 'city-scape', name: 'City Scape', url: '/public/sounds/city-scape.mp3' },
  { id: 'coffeeshop', name: 'Coffeeshop', url: '/public/sounds/coffeeshop.mp3' },
  { id: 'cosmos', name: 'Cosmos', url: '/public/sounds/cosmos.mp3' },
  { id: 'desert', name: 'Desert', url: '/public/sounds/desert.mp3' },
  { id: 'fan', name: 'Fan', url: '/public/sounds/fan.mp3' },
  { id: 'fire', name: 'Fire', url: '/public/sounds/fire.mp3' },
  { id: 'fireplace', name: 'Fireplace', url: '/public/sounds/fireplace.mp3' },
  { id: 'forest', name: 'Forest', url: '/public/sounds/forest.mp3' },
  { id: 'leaves', name: 'Leaves', url: '/public/sounds/leaves.mp3' },
  { id: 'ocean-waves', name: 'Ocean Waves', url: '/public/sounds/ocean-waves.mp3' },
  { id: 'pink-noise', name: 'Pink Noise', url: '/public/sounds/pink-noise.mp3' },
  { id: 'rain-and-thunder', name: 'Rain and Thunder', url: '/public/sounds/rain-and-thunder.mp3' },
  { id: 'rain-low', name: 'Rain Low', url: '/public/sounds/rain-low.mp3' },
  { id: 'rain-on-umbrella', name: 'Rain On Umbrella', url: '/public/sounds/rain-on-umbrella.mp3' },
  { id: 'rain-tent', name: 'Rain Tent', url: '/public/sounds/rain-tent.mp3' },
  { id: 'river-stream', name: 'River Stream', url: '/public/sounds/river-stream.mp3' },
  { id: 'space-engine', name: 'Space Engine', url: '/public/sounds/space-engine.mp3' },
  { id: 'summer-nights', name: 'Summer Nights', url: '/public/sounds/summer-nights.mp3' },
  { id: 'thunderstorm', name: 'Thunderstorm', url: '/public/sounds/thunderstorm.mp3' },
  { id: 'train', name: 'Train', url: '/public/sounds/train.mp3' },
];

const Pomodoro = () => {
  const [bgImage] = useState(localStorage.getItem('bgImage'));
  const [mode, setMode] = useState('focus');
  const [isActive, setIsActive] = useState(false);

  const alarmAudio = useRef(new Audio('/assets/musics/alarm(when_end_pomodoro).mp3'));
  const bgMusicAudio = useRef(new Audio(''));

  const macSpring = {
    type: "spring",
    stiffness: 200,
    damping: 20,
    mass: 1
  };

  useEffect(() => {
    const selectedMusicId = sessionStorage.getItem('bgMusic') || 'none';
    const music = musicOptions.find(m => m.id === selectedMusicId);

    if (music && music.url) {
      bgMusicAudio.current.src = music.url;
      bgMusicAudio.current.loop = true;
    } else {
      bgMusicAudio.current.src = '';
    }
  }, []);

  useEffect(() => {
    if (isActive && bgMusicAudio.current.src !== window.location.href) {
      bgMusicAudio.current.play().catch(e => console.log("Music play error:", e));
    } else {
      bgMusicAudio.current.pause();
    }
  }, [isActive]);

  const getStoredTime = (key, defaultValue) => {
    const stored = sessionStorage.getItem(key);
    return stored ? parseInt(stored) * 60 : defaultValue * 60;
  };

  const settings = {
    focus: {
      time: getStoredTime('focusTime', 25),
      label: 'Focus Time',
      color: 'text-blue-500',
      btnColor: 'border-blue-500/10 text-blue-50',
      liquid: 'bg-blue-500/50',
      glow: 'bg-blue-500/20'
    },
    break: {
      time: getStoredTime('breakTime', 5),
      label: 'Take Break',
      color: 'text-emerald-400',
      btnColor: 'border-emerald-400/40 text-emerald-50',
      liquid: 'bg-emerald-500/30',
      glow: 'bg-emerald-500/20'
    }
  };

  const [seconds, setSeconds] = useState(settings[mode].time);
  const progress = (seconds / settings[mode].time) * 100;

  useEffect(() => {
    setSeconds(settings[mode].time);
  }, [mode]);

  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      playAlarm();
      bgMusicAudio.current.pause();
      clearInterval(interval);
      toggleMode();
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, mode]);

  const playAlarm = () => {
    alarmAudio.current.currentTime = 0;
    alarmAudio.current.play().catch(error => console.log("Ovoz chalishda xato:", error));
  };

  const toggleMode = () => {
    const nextMode = mode === 'focus' ? 'break' : 'focus';
    setMode(nextMode);
    setSeconds(getStoredTime(nextMode === 'focus' ? 'focusTime' : 'breakTime', nextMode === 'focus' ? 25 : 5));
    setIsActive(false);
  };

  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className='relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden font-sans text-white'>
      {bgImage ? (
        <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-xl" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-slate-950" />
      )}

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={macSpring}
        layout
        className='relative z-10 w-[90%] max-w-xl p-8 md:p-12 rounded-[40px] bg-white/2 backdrop-blur-3xl border border-white/30 shadow-2xl text-center'
      >
        <div className="flex justify-center gap-4 mb-8">
          {['focus', 'break'].map((m) => (
            <motion.button
              key={m}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setMode(m);
                setIsActive(false);
                alarmAudio.current.pause();
                bgMusicAudio.current.pause();
              }}
              className={`relative px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${mode === m ? 'bg-white/10 border border-white/20' : 'opacity-40'}`}
            >
              {mode === m && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white/5 rounded-full"
                  transition={macSpring}
                />
              )}
              <span className="relative z-10">{m}</span>
            </motion.button>
          ))}
        </div>

        <div className="flex flex-col justify-center items-center font-mono">
          <AnimatePresence mode="wait">
            <motion.h2
              key={mode}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={macSpring}
              className={`text-xl font-bold mb-2 tracking-[0.2em] uppercase ${settings[mode].color}`}
            >
              {settings[mode].label}
            </motion.h2>
          </AnimatePresence>

          <motion.h1
            key={seconds}
            initial={{ scale: 0.98, opacity: 0.9 }}
            animate={{ scale: 1, opacity: 1 }}
            className='text-7xl md:text-9xl font-bold tracking-tighter tabular-nums'
          >
            {formatTime(seconds)}
          </motion.h1>

          <div className='flex gap-4 mt-10 w-full'>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={macSpring}
              onClick={() => {
                setIsActive(!isActive);
                alarmAudio.current.pause();
              }}
              className={`relative flex-1 px-8 py-5 rounded-2xl overflow-hidden transition-all text-xl font-bold border ${isActive ? "border-red-500/40" : settings[mode].btnColor} bg-white/5 shadow-inner`}
            >
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "linear" }}
                className={`absolute inset-0 z-0 ${isActive ? 'bg-red-500/20' : settings[mode].liquid}`}
                style={{ originX: 0 }}
              />
              <span className="relative z-10 tracking-widest uppercase">
                {isActive ? 'Pause' : 'Start'}
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={macSpring}
              onClick={() => {
                setIsActive(false);
                setSeconds(settings[mode].time);
                alarmAudio.current.pause();
                bgMusicAudio.current.pause();
              }}
              className="px-8 py-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/20 text-xl font-bold transition-all uppercase tracking-widest"
            >
              <motion.span
                animate={{ rotate: isActive ? 0 : 360 }}
                transition={{ duration: 0.5 }}
                style={{ display: 'inline-block' }}
              >
                Reset
              </motion.span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Pomodoro;
