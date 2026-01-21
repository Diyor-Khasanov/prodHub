import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Home, Settings, CalendarDaysIcon, ClockFading, ListTodo, Link2Icon, NotepadText, ShieldBan } from 'lucide-react';

const icons = [
  { id: 1, icon: <Home />, label: 'Home', path: '/' },
  { id: 2, icon: <ClockFading />, label: 'Pomodoro', path: '/pomodoro' },
  { id: 3, icon: <ListTodo />, label: 'Tasks', path: '/tasks' },
  { id: 4, icon: <NotepadText />, label: 'Notes', path: '/notes' },
  { id: 5, icon: <ShieldBan />, label: 'Block', path: '/blockSites' },
  { id: 6, icon: <Link2Icon />, label: 'Links', path: '/links' },
  { id: 7, icon: <CalendarDaysIcon />, label: 'Calendar', path: '/calendar' },
  { id: 8, icon: <Settings />, label: 'Settings', path: '/settings' },
];

const Toolbar = () => {
  let mouseX = useMotionValue(Infinity);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex h-[64px] items-end gap-2 rounded-2xl
                   bg-white/10 backdrop-blur-2xl px-3 pb-3
                   border border-white/20 shadow-2xl"
      >
        {icons.map((item) => (
          <IconContainer mouseX={mouseX} key={item.id} item={item}>
            {item.icon}
          </IconContainer>
        ))}
      </motion.div>
    </div>
  );
};

function IconContainer({ mouseX, children, item }) {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Kattalashish diapazoni
  const widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const iconSizeTransform = useTransform(distance, [-150, 0, 150], [20, 40, 20]);

  // SAKRASH EFFEKTI UCHUN: mass kam, stiffness baland, damping past
  const springConfig = {
    mass: 0.1,
    stiffness: 250, // Joyiga tez qaytishi uchun
    damping: 10     // "Sakrash" (bounce) hosil qilishi uchun
  };

  const width = useSpring(widthTransform, springConfig);
  const height = useSpring(heightTransform, springConfig);
  const iconSize = useSpring(iconSizeTransform, springConfig);

  return (
    <Link to={item.path} className="relative block">
      <motion.div
        ref={ref}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ width, height }}
        /* Bosganda sakrash effekti */
        whileTap={{ scale: 0.4 }}
        className="group flex items-center justify-center rounded-xl
                   bg-white/5 border border-white/5 text-white/80
                   hover:bg-white/20 hover:border-white/30
                   transition-colors duration-200"
      >
        <AnimatePresence>
          {isHovered && (
            <motion.span
              initial={{ opacity: 0, y: 10, scale: 0.8, x: '-50%' }}
              animate={{ opacity: 1, y: -65, scale: 1, x: '-50%' }}
              exit={{ opacity: 0, y: 10, scale: 0.8, x: '-50%' }}
              // Label uchun ham sakrash
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="absolute left-1/2 px-2.5 py-1 rounded-lg
                         bg-black/80 backdrop-blur-md text-white
                         text-[12px] font-medium border border-white/10
                         shadow-xl whitespace-nowrap pointer-events-none"
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>

        <motion.div
          style={{ width: iconSize, height: iconSize }}
          className="flex items-center justify-center"
        >
          {React.isValidElement(children) &&
            React.cloneElement(children, {
              size: "100%",
              strokeWidth: 1.5,
              // Ikonaga biroz soya (macOS kabi)
              className: "drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)]"
            })}
        </motion.div>
      </motion.div>
    </Link>
  );
}

export default Toolbar;
