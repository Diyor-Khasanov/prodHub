import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CircleUser, Quote } from 'lucide-react'; // Quote ikonkasini ham qo'shdik

const qoutes = [
  // ISLOMIY MOTIVATSIYA
  {
    "quote": "No one has ever eaten a better meal than that which he has earned by working with his own hands.",
    "author": "Prophet Muhammad (S.A.W)"
  },
  {
    "quote": "Strive for that which will benefit you, seek the help of Allah, and do not feel helpless.",
    "author": "Prophet Muhammad (S.A.W)"
  },
  {
    "quote": "The best of people are those who are most beneficial to others.",
    "author": "Prophet Muhammad (S.A.W)"
  },
  {
    "quote": "Tie your camel first, then put your trust in Allah.",
    "author": "Prophet Muhammad (S.A.W)"
  },
  {
    "quote": "Verily, with hardship comes ease.",
    "author": "The Holy Quran (94:6)"
  },
  {
    "quote": "And that there is not for man except that [good] for which he strives.",
    "author": "The Holy Quran (53:39)"
  },
  {
    "quote": "Patience is a pillar of faith.",
    "author": "Umar ibn Al-Khattab (R.A)"
  },
  {
    "quote": "To get what you love, you must first be patient with what you hate.",
    "author": "Imam Al-Ghazali"
  },
  {
    "quote": "Be like a flower that gives its fragrance even to the hand that crushes it.",
    "author": "Ali ibn Abi Talib (R.A)"
  },
  {
    "quote": "The best way to get through this world is with a beautiful patience.",
    "author": "The Holy Quran"
  },

  // DUNYOVIY MUVAFFAQIYAT VA MEHNAT
  {
    "quote": "The only way to do great work is to love what you do.",
    "author": "Steve Jobs"
  },
  {
    "quote": "Your time is limited, so don't waste it living someone else's life.",
    "author": "Steve Jobs"
  },
  {
    "quote": "If you don't give up, you still have a chance. Giving up is the greatest failure.",
    "author": "Jack Ma"
  },
  {
    "quote": "Work hard, have fun, make history.",
    "author": "Jeff Bezos"
  },
  {
    "quote": "It’s fine to celebrate success but it is more important to heed the lessons of failure.",
    "author": "Bill Gates"
  },
  {
    "quote": "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "author": "Winston Churchill"
  },
  {
    "quote": "I never took a day off in my twenties. Not one.",
    "author": "Bill Gates"
  },
  {
    "quote": "Work like there is someone working 24 hours a day to take it away from you.",
    "author": "Mark Cuban"
  },
  {
    "quote": "If you want to be successful, you have to be willing to be misunderstood.",
    "author": "Jeff Bezos"
  },
  {
    "quote": "The biggest risk is not taking any risk.",
    "author": "Mark Zuckerberg"
  },
  {
    "quote": "Move fast and break things. If you are not breaking things, you are not moving fast enough.",
    "author": "Mark Zuckerberg"
  },
  {
    "quote": "Don't count the days, make the days count.",
    "author": "Muhammad Ali"
  },
  {
    "quote": "The future depends on what you do today.",
    "author": "Mahatma Gandhi"
  },
  {
    "quote": "It always seems impossible until it's done.",
    "author": "Nelson Mandela"
  },
  {
    "quote": "Success is a lousy teacher. It seduces smart people into thinking they can't lose.",
    "author": "Bill Gates"
  },
  {
    "quote": "Genius is 1% inspiration and 99% perspiration.",
    "author": "Thomas Edison"
  },
  {
    "quote": "I have not failed. I've just found 10,000 ways that won't work.",
    "author": "Thomas Edison"
  },
  {
    "quote": "Quality is not an act, it is a habit.",
    "author": "Aristotle"
  },
  {
    "quote": "The best way to predict the future is to create it.",
    "author": "Peter Drucker"
  },
  {
    "quote": "Discipline is the bridge between goals and accomplishment.",
    "author": "Jim Rohn"
  },
  {
    "quote": "Formal education will make you a living; self-education will make you a fortune.",
    "author": "Jim Rohn"
  },
  {
    "quote": "Either you run the day, or the day runs you.",
    "author": "Jim Rohn"
  },
  {
    "quote": "Hard work beats talent when talent doesn't work hard.",
    "author": "Tim Notke"
  },
  {
    "quote": "Don’t wish it were easier. Wish you were better.",
    "author": "Jim Rohn"
  },
  {
    "quote": "Focus on being productive instead of busy.",
    "author": "Tim Ferriss"
  },
  {
    "quote": "Small daily improvements are the key to staggering long-term results.",
    "author": "Robin Sharma"
  },
  {
    "quote": "An investment in knowledge pays the best interest.",
    "author": "Benjamin Franklin"
  },
  {
    "quote": "Wake up with determination. Go to bed with satisfaction.",
    "author": "George Lorimer"
  },
  {
    "quote": "Success is walking from failure to failure with no loss of enthusiasm.",
    "author": "Winston Churchill"
  },
  {
    "quote": "Opportunities don't happen. You create them.",
    "author": "Chris Grosser"
  },

  // RUMIY VA DONOLAR
  {
    "quote": "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.",
    "author": "Rumi"
  },
  {
    "quote": "Do not be satisfied with the stories that come before you. Unfold your own myth.",
    "author": "Rumi"
  },
  {
    "quote": "Be grateful for whoever comes, because each has been sent as a guide from beyond.",
    "author": "Rumi"
  },
  {
    "quote": "Knowledge is of two kinds: that which is absorbed and that which is heard.",
    "author": "Ali ibn Abi Talib (R.A)"
  },
  {
    "quote": "The tongue is like a lion, if you let it loose, it will wound someone.",
    "author": "Ali ibn Abi Talib (R.A)"
  },
  {
    "quote": "A man's worth is what he can do well.",
    "author": "Ali ibn Abi Talib (R.A)"
  },
  {
    "quote": "The person who works to support his family is like a mujahid in the path of Allah.",
    "author": "Prophet Muhammad (S.A.W)"
  },
  {
    "quote": "Kindness is a mark of faith, and whoever is not kind has no faith.",
    "author": "Prophet Muhammad (S.A.W)"
  },
  {
    "quote": "Victory is not without struggle.",
    "author": "Umar ibn Al-Khattab (R.A)"
  },
  {
    "quote": "A wealth of knowledge is better than a wealth of gold.",
    "author": "Ali ibn Abi Talib (R.A)"
  }
];


const Home = () => {
  const [time, setTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(true);
  const [bgImage, setBgImage] = useState(localStorage.getItem('bgImage'));
  const [randomQuote, setRandomQuote] = useState({ quote: "", author: "" });

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * qoutes.length);
    setRandomQuote(qoutes[randomIndex]);
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
      {/* Background Section */}
      {bgImage ? (
        <div className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000" style={{ backgroundImage: `url(${bgImage})` }}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-slate-950">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/20 blur-[100px] rounded-full" />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='relative z-10 w-[90%] max-w-xl p-10 rounded-[40px] bg-black/40 backdrop-blur-3xl border border-white/10 shadow-2xl text-center'
      >
        {/* Clock Display */}
        <div className="flex justify-center items-center text-6xl md:text-8xl font-mono font-bold tracking-tighter mb-2">
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

        <p className="text-xs uppercase tracking-[0.4em] opacity-40 font-medium mb-6">
          Current Local Time
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIs24Hour(!is24Hour)}
          className="px-8 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium tracking-wide opacity-80 hover:opacity-100"
        >
          {is24Hour ? "Switch to 12H" : "Switch to 24H"}
        </motion.button>

        {/* Quote Block - Mana shu qism o'zgardi */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative mt-4 mb-8 p-8 rounded-3xl bg-white/5 backdrop-blur-md border border-white/5 overflow-hidden group"
        >
          {/* Ochilib yopiluvchi qo'shtirnoqlar (background bezak sifatida) */}
          <span className="absolute top-2 left-4 text-6xl font-serif opacity-10 select-none">“</span>
          <span className="absolute bottom-[-10px] right-4 text-6xl font-serif opacity-10 select-none">”</span>

          <div className="relative z-10">
            <p className="text-lg md:text-xl italic font-light leading-relaxed text-slate-100">
              <span className="text-blue-400/50 mr-1">“</span>
              {randomQuote.quote}
              <span className="text-blue-400/50 ml-1">”</span>
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 flex justify-center items-center gap-2 text-sm font-bold uppercase tracking-widest text-blue-400/80"
            >
              <div className="h-[1px] w-8 bg-blue-400/30"></div>
              <CircleUser size={18} />
              {randomQuote.author}
              <div className="h-[1px] w-8 bg-blue-400/30"></div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
