import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Sidebar as SidebarIcon, Edit3, Pin, Lock, Key, Unlock } from 'lucide-react';
import MacAlert from '../components/MacAlert';

const Notes = () => {
  const [bgImage] = useState(localStorage.getItem('bgImage'));
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('apple_notes_data');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedId, setSelectedId] = useState(notes[0]?.id || null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, noteId: null });
  const [lockModal, setLockModal] = useState({ open: false, noteId: null });
  const [passwordInput, setPasswordInput] = useState('');
  const [unlockedNotes, setUnlockedNotes] = useState([]);
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, type: 'warning', message: '' });

  useEffect(() => {
    localStorage.setItem('apple_notes_data', JSON.stringify(notes));
  }, [notes]);

  const handleContextMenu = (e, id) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.pageX, y: e.pageY, noteId: id });
  };

  const closeContextMenu = () => setContextMenu({ ...contextMenu, visible: false });

  const updateNote = (id, field, value) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, [field]: value } : n));
  };

  const deleteNote = (id) => {
    const newNotes = notes.filter(n => n.id !== id);
    setNotes(newNotes);
    if (selectedId === id) setSelectedId(newNotes[0]?.id || null);
    closeContextMenu();
  };

  const confirmPassword = () => {
    const note = notes.find(n => n.id === lockModal.noteId);
    if (!note) return;

    if (!note.locked) {
      if (passwordInput.length < 1) {
        setAlertConfig({ isOpen: true, type: 'warning', message: "Password is required" });
        return;
      }
      setNotes(prev => prev.map(n => n.id === note.id ? { ...n, locked: true, password: passwordInput } : n));
      setLockModal({ open: false, noteId: null });
      setPasswordInput('');
      setTimeout(() => setAlertConfig({ isOpen: true, type: 'success', message: "Note locked" }), 300);
    } else {
      if (note.password === passwordInput) {
        const alreadyUnlocked = unlockedNotes.includes(note.id);

        if (alreadyUnlocked) {
          // REMOVE LOCK LOGIC
          setNotes(prev => prev.map(n => n.id === note.id ? { ...n, locked: false, password: null } : n));
          setUnlockedNotes(prev => prev.filter(id => id !== note.id));
          setLockModal({ open: false, noteId: null });
          setPasswordInput('');
          setTimeout(() => setAlertConfig({ isOpen: true, type: 'success', message: "Protection removed" }), 300);
        } else {
          // UNLOCK FOR SESSION
          setUnlockedNotes(prev => [...prev, note.id]);
          setLockModal({ open: false, noteId: null });
          setPasswordInput('');
          setTimeout(() => setAlertConfig({ isOpen: true, type: 'success', message: "Access granted" }), 300);
        }
      } else {
        setLockModal({ open: false, noteId: null });
        setPasswordInput('');
        setTimeout(() => setAlertConfig({ isOpen: true, type: 'error', message: "Incorrect Password" }), 300);
      }
    }
  };

  const sortedNotes = [...notes].sort((a, b) => b.pinned - a.pinned);
  const activeNote = notes.find(n => n.id === selectedId);
  const isAccessible = activeNote && (!activeNote.locked || unlockedNotes.includes(activeNote.id));

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 font-sans select-none overflow-hidden" onClick={closeContextMenu}>
      {bgImage ? (
        <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-xl" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-slate-950" />
      )}

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 w-full max-w-5xl h-[85vh] flex overflow-hidden rounded-3xl border border-white/30 shadow-2xl bg-black/10 backdrop-blur-3xl">
        <AnimatePresence initial={false}>
          {isSidebarOpen && (
            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 280, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="border-r border-white/10 bg-white/5 flex flex-col overflow-hidden">
              <div className="h-16 flex items-center justify-between px-5 shrink-0 text-white">
                <h2 className="opacity-50 font-bold text-lg">Notes</h2>
                <button onClick={() => {
                  const newId = Date.now();
                  setNotes([{ id: newId, title: '', content: '', date: 'Now', pinned: false, locked: false, password: null }, ...notes]);
                  setSelectedId(newId);
                }}><Edit3 size={18} className="text-blue-400" /></button>
              </div>
              <div className="flex-1 overflow-y-auto px-2 space-y-1">
                {sortedNotes.map(note => {
                  const isNoteLocked = note.locked && !unlockedNotes.includes(note.id);
                  return (
                    <div key={note.id} onContextMenu={(e) => handleContextMenu(e, note.id)} onClick={() => setSelectedId(note.id)} className={`group p-3 rounded-xl cursor-pointer transition-all duration-300 text-white ${selectedId === note.id ? 'bg-blue-600' : 'hover:bg-white/10'}`}>
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm truncate w-[80%]">{isNoteLocked ? 'Locked Note' : (note.title || 'New Note')}</h3>
                        <div className="flex gap-1">
                          {note.pinned && <Pin size={10} className="fill-current" />}

                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] opacity-60">{note.date}</span>
                        <span className="text-[10px] truncate opacity-40">{isNoteLocked ? '••••••••' : (note.content || '...')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 flex flex-col overflow-hidden bg-black/5">
          <div className="h-16 flex items-center px-6 border-b border-white/5 shrink-0">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/20 rounded-xl transition-colors"><SidebarIcon size={20} className="text-blue-400" /></button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {activeNote ? (
              isAccessible ? (
                <motion.div key={selectedId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto px-10 py-12">
                  <span className="block text-center text-[11px] text-gray-500 font-bold uppercase mb-10 tracking-widest">{activeNote.date}</span>
                  <input className="w-full bg-transparent text-4xl font-bold outline-none mb-6 text-white" value={activeNote.title} onChange={(e) => updateNote(selectedId, 'title', e.target.value)} placeholder="Title" />
                  <textarea className="w-full h-[50vh] bg-transparent outline-none resize-none text-[18px] text-white/80" value={activeNote.content} onChange={(e) => updateNote(selectedId, 'content', e.target.value)} placeholder="Start writing..." />
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-white space-y-6">
                  <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl"><Lock size={64} className="text-blue-500 animate-pulse" /></div>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold">This note is locked</h2>
                    <p className="text-white/40 text-sm mt-2">Enter password to view content</p>
                  </div>
                  <button onClick={() => setLockModal({ open: true, noteId: activeNote.id })} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold transition-all shadow-lg active:scale-95">Unlock Note</button>
                </div>
              )
            ) : <div className="h-full flex items-center justify-center text-white/20">Select a note</div>}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {contextMenu.visible && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ top: contextMenu.y, left: contextMenu.x }} className="fixed z-[100] w-48 bg-white/10 backdrop-blur-3xl border border-white/20 shadow-2xl rounded-2xl p-1.5">
            <button onClick={() => { updateNote(contextMenu.noteId, 'pinned', !notes.find(n => n.id === contextMenu.noteId).pinned); closeContextMenu(); }} className="flex w-full items-center gap-3 px-3 py-2 text-sm text-white hover:bg-blue-600 rounded-xl transition-colors">
              <Pin size={14} /> {notes.find(n => n.id === contextMenu.noteId)?.pinned ? 'Unpin' : 'Pin Note'}
            </button>
            <button onClick={() => { setLockModal({ open: true, noteId: contextMenu.noteId }); closeContextMenu(); }} className="flex w-full items-center gap-3 px-3 py-2 text-sm text-white hover:bg-blue-600 rounded-xl transition-colors">
              {notes.find(n => n.id === contextMenu.noteId)?.locked ? <><Unlock size={14} /> Remove Lock</> : <><Lock size={14} /> Lock Note</>}
            </button>
            <div className="h-px bg-white/10 my-1" />
            <button onClick={() => deleteNote(contextMenu.noteId)} className="flex w-full items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-colors"><Trash2 size={14} /> Delete</button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lockModal.open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[2rem] p-8 shadow-2xl text-white text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/30 mx-auto"><Key className="text-blue-400" size={32} /></div>
              <h3 className="text-2xl font-bold mb-1">{notes.find(n => n.id === lockModal.noteId)?.locked ? 'Security Check' : 'Set Password'}</h3>
              <p className="text-white/40 text-sm mb-8">Enter password to proceed</p>
              <input autoFocus type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && confirmPassword()} placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 outline-none focus:ring-2 ring-blue-500/50 transition-all mb-8 text-center text-xl" />
              <div className="flex gap-3 w-full">
                <button onClick={() => { setLockModal({ open: false, noteId: null }); setPasswordInput(''); }} className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors font-semibold">Cancel</button>
                <button onClick={confirmPassword} className="flex-1 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 transition-all font-semibold">Confirm</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <MacAlert isOpen={alertConfig.isOpen} type={alertConfig.type} message={alertConfig.message} onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })} />
    </div>
  );
};

export default Notes;
