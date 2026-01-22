import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MacAlert from '../components/MacAlert';

const Settings = () => {
  const navigate = useNavigate();
  const [bgImage] = useState(localStorage.getItem('bgImage'));
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    type: 'warning',
    message: ''
  });

  const [settings, setSettings] = useState({
    bgImage: localStorage.getItem('bgImage') || '',
    focusTime: sessionStorage.getItem('focusTime') || '25',
    breakTime: sessionStorage.getItem('breakTime') || '5'
  });

  const macSpring = {
    type: "spring",
    stiffness: 260,
    damping: 20
  };

  const handleSave = () => {
    const focusNum = parseFloat(settings.focusTime);
    const breakNum = parseFloat(settings.breakTime);

    if (focusNum < 1 || breakNum < 1 || isNaN(focusNum) || isNaN(breakNum)) {
      setAlertConfig({
        isOpen: true,
        type: 'warning',
        message: "The minimum value must be at least 1!"
      });
      return;
    }

    if (breakNum >= focusNum) {
      setAlertConfig({
        isOpen: true,
        type: 'warning',
        message: "Break time must be less than focus time!"
      });
      return;
    }

    localStorage.setItem('bgImage', settings.bgImage);
    sessionStorage.setItem('focusTime', settings.focusTime);
    sessionStorage.setItem('breakTime', settings.breakTime);

    setAlertConfig({
      isOpen: true,
      type: 'success',
      message: "Changes saved successfully"
    });

    setTimeout(() => {
      navigate('/');
    }, 2000)
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex justify-center items-start pt-12 relative overflow-hidden">
      {bgImage ? (
        <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-slate-950">
          <motion.div animate={{ x: [0, 50, 0], y: [0, 30, 0] }} transition={{ duration: 10, repeat: Infinity }} className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/20 blur-[100px] rounded-full" />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={macSpring}
        className="relative z-10 w-full max-w-2xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/')}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </motion.button>
        </div>

        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-widest px-1">Timer Configuration</h2>
            <div className="grid grid-cols-2 gap-4 bg-white/5 p-5 rounded-2xl border border-white/5">
              <div className="flex flex-col gap-2">
                <label className="text-xs opacity-70">Focus (min)</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={settings.focusTime}
                  onChange={(e) => setSettings({ ...settings, focusTime: e.target.value })}
                  className="bg-black/40 border border-white/10 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs opacity-70">Break (min)</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={settings.breakTime}
                  onChange={(e) => setSettings({ ...settings, breakTime: e.target.value })}
                  className="bg-black/40 border border-white/10 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-widest px-1">Appearance</h2>
            <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
              <label className="text-sm opacity-70 block mb-2">Background Image URL</label>
              <input
                type="text"
                value={settings.bgImage}
                onChange={(e) => setSettings({ ...settings, bgImage: e.target.value })}
                className="w-full bg-black/40 border border-white/10 p-3 rounded-xl outline-none focus:border-white/30 transition-all"
                placeholder="https://..."
              />
            </div>
          </section>
        </div>

        <div className="mt-10 flex gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            className="flex-1 py-4 rounded-2xl bg-white/5 font-semibold border border-white/5"
          >
            Cancel
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="flex-1 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 transition-all font-semibold shadow-lg shadow-blue-600/20"
          >
            Save Changes
          </motion.button>
        </div>
      </motion.div>

      <MacAlert
        isOpen={alertConfig.isOpen}
        type={alertConfig.type}
        message={alertConfig.message}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
      />
    </div>
  );
};

export default Settings;
