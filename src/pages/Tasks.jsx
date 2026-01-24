import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, CheckCircle2, Circle, X, FolderPlus } from 'lucide-react';

const Tasks = () => {
  const [bgImage] = useState(localStorage.getItem('bgImage'));

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('todo_categories');
    return saved
      ? JSON.parse(saved)
      : [
        { id: 'all', name: 'All', color: 'gray' },
        { id: '1', name: 'General', color: 'blue' }
      ];
  });

  const [activeCategory, setActiveCategory] = useState('all');

  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todo_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [newTodo, setNewTodo] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [showCatInput, setShowCatInput] = useState(false);

  useEffect(() => {
    localStorage.setItem('todo_categories', JSON.stringify(categories));
    localStorage.setItem('todo_tasks', JSON.stringify(todos));
  }, [categories, todos]);

  const macSpring = { type: "spring", stiffness: 200, damping: 20, mass: 1 };

  const addCategory = () => {
    if (!newCatName.trim()) return;
    const cat = { id: Date.now().toString(), name: newCatName, color: 'emerald' };
    setCategories([...categories, cat]);
    setNewCatName('');
    setShowCatInput(false);
    setActiveCategory(cat.id);
  };

  const deleteCategory = (id, e) => {
    e.stopPropagation();
    if (id === 'all' || categories.length === 1) return;

    setCategories(categories.filter(c => c.id !== id));
    setTodos(todos.filter(t => t.categoryId !== id));

    if (activeCategory === id) setActiveCategory('all');
  };

  const addTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim() || activeCategory === 'all') return;

    const todo = {
      id: Date.now(),
      text: newTodo,
      completed: false,
      categoryId: activeCategory
    };

    setTodos([todo, ...todos]);
    setNewTodo('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const getCategoryName = (id) => {
    return categories.find(c => c.id === id)?.name || 'Unknown';
  };


  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const filteredTodos =
    activeCategory === 'all'
      ? todos
      : todos.filter(t => t.categoryId === activeCategory);

  return (
    <div className='relative min-h-screen w-full flex flex-col items-center justify-center p-4 font-sans text-white'>
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
        className='relative z-10 w-full max-w-5xl h-[85vh] flex overflow-hidden rounded-3xl border border-white/30 shadow-2xl bg-black/10 backdrop-blur-3xl'
      >
        <div className="w-full md:w-64 bg-white/5 border-r border-white/10 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold tracking-tight">Categories</h2>
            <button onClick={() => setShowCatInput(!showCatInput)} className="hover:bg-white/10 p-1 rounded-lg transition-colors">
              <FolderPlus size={20} className="text-blue-400" />
            </button>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto pr-2">
            <AnimatePresence mode="popLayout">
              {showCatInput && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="mb-4">
                  <input
                    autoFocus
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    placeholder="Enter category name..."
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {categories.map((cat) => (
              <motion.div
                key={cat.id}
                layout
                onClick={() => setActiveCategory(cat.id)}
                className={`group flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer transition-all ${activeCategory === cat.id ? 'bg-white/15 shadow-lg' : 'hover:bg-white/5 opacity-60'}`}
              >
                <span className="font-medium truncate">{cat.name}</span>
                {cat.id !== 'all' && (
                  <button onClick={(e) => deleteCategory(cat.id, e)} className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all">
                    <X size={14} />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col p-6 md:p-10 overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <motion.h1 key={activeCategory} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-3xl font-bold">
              {categories.find(c => c.id === activeCategory)?.name}
            </motion.h1>
            <span className="bg-white/10 px-4 py-1 rounded-full text-sm font-mono opacity-60">
              {filteredTodos.length} task{filteredTodos.length !== 1 && 's'}
            </span>
          </div>

          {activeCategory !== 'all' && (
            <form onSubmit={addTodo} className="relative mb-8">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add a new task..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all text-lg"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 p-2 rounded-xl transition-colors">
                <Plus size={24} />
              </button>
            </form>
          )}

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {filteredTodos.map((todo) => (
                <motion.div
                  key={todo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={macSpring}
                  className={`flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-white/5 group transition-all ${todo.completed ? 'opacity-40' : ''}`}
                >
                  <button onClick={() => toggleTodo(todo.id)} className="transition-transform active:scale-90">
                    {todo.completed ? <CheckCircle2 className="text-emerald-400" /> : <Circle className="text-white/30" />}
                  </button>

                  <span className={`flex-1 text-lg ${todo.completed ? 'line-through' : ''} flex flex-col`}>
                    {todo.text}
                    {activeCategory === 'all' && (
                      <span className='text-sm opacity-60'>
                        {getCategoryName(todo.categoryId)}
                      </span>
                    )}
                  </span>

                  {activeCategory === 'all' && (
                    <div className="text-sm opacity-60">
                      {todo.completed ? 'Completed' : 'Pending'}
                    </div>
                  )}

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 rounded-xl text-red-400 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredTodos.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} className="text-center py-20 opacity-50 italic">
                No tasks yet...
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Tasks;
