import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Settings = () => {
  const navigate = useNavigate();

  // State-larni guruhlangan holatda boshqarish
  const [settings, setSettings] = useState({
    bgImage: localStorage.getItem('bgImage') || '',
    soundEnabled: JSON.parse(localStorage.getItem('soundEnabled')) || false,
    language: localStorage.getItem('language') || 'EN',
    themeColor: localStorage.getItem('themeColor') || 'violet'
  });

  const handleSave = () => {
    Object.keys(settings).forEach(key => {
      localStorage.setItem(key, settings[key]);
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex justify-center items-start pt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <button
            onClick={() => navigate('/')}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-8">

          {/* GROUP 1: APPEARANCE (Ko'rinish) */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-widest px-1">Appearance</h2>
            <div className="grid gap-4 bg-white/5 p-5 rounded-2xl border border-white/5">
              <div className="flex flex-col gap-2">
                <label className="text-sm opacity-70">Background Image URL</label>
                <input
                  type="text"
                  value={settings.bgImage}
                  onChange={(e) => setSettings({ ...settings, bgImage: e.target.value })}
                  className="bg-black/40 border border-white/10 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Paste URL here..."
                />
              </div>
            </div>
          </section>

          {/* GROUP 2: SYSTEM & SOUND (Tizim va Ovoz) */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-widest px-1">System & Sound</h2>
            <div className="grid gap-4 bg-white/5 p-5 rounded-2xl border border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">System Sounds</p>
                  <p className="text-xs opacity-50">Enable clock ticking or alerts</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
                  className={`w-12 h-6 rounded-full transition-all duration-300 flex items-center px-1 ${settings.soundEnabled ? 'bg-blue-600' : 'bg-slate-700'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-all ${settings.soundEnabled ? 'ml-6' : 'ml-0'}`} />
                </button>
              </div>
            </div>
          </section>

          {/* GROUP 3: LOCALIZATION (Til) */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-widest px-1">Localization</h2>
            <div className="grid gap-4 bg-white/5 p-5 rounded-2xl border border-white/5">
              <div className="flex items-center justify-between">
                <span className="font-medium">Interface Language</span>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="bg-black/40 border border-white/10 p-2 rounded-lg outline-none text-sm"
                >
                  <option value="EN">English</option>
                  <option value="UZ">O'zbekcha</option>
                  <option value="RU">Русский</option>
                </select>
              </div>
            </div>
          </section>

        </div>

        {/* ACTIONS */}
        <div className="mt-10 flex gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all font-semibold border border-white/5"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 transition-all font-semibold shadow-lg shadow-blue-600/20"
          >
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
