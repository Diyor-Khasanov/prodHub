import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2, Sidebar as SidebarIcon, Edit3, Pin, Lock, Key, Unlock,
  Bold, Italic, Underline, Strikethrough, Heading1, Heading2,
  Type, Code, Quote, Link
} from 'lucide-react';
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
  const [activeFormats, setActiveFormats] = useState({ bold: false, italic: false, underline: false, strikeThrough: false });

  const [editorMenu, setEditorMenu] = useState({ visible: false, x: 0, y: 0 });
  const editorRef = useRef(null);

  const commands = [
    { id: 'h1', label: 'Title', icon: <Heading1 size={16} />, command: 'formatBlock', value: 'H1' },
    { id: 'h2', label: 'Heading', icon: <Heading2 size={16} />, command: 'formatBlock', value: 'H2' },
    { id: 'p', label: 'Default Text', icon: <Type size={16} />, command: 'formatBlock', value: 'P' },
    { id: 'code', label: 'Code', icon: <Code size={16} />, command: 'formatBlock', value: 'PRE' },
    { id: 'quote', label: 'Quote', icon: <Quote size={16} />, command: 'formatBlock', value: 'BLOCKQUOTE' },
  ];



  useEffect(() => {
    localStorage.setItem('apple_notes_data', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    if (editorRef.current && activeNote && isAccessible) {
      if (editorRef.current.innerHTML !== activeNote.content) {
        editorRef.current.innerHTML = activeNote.content || '';
      }
    }
  }, [selectedId, unlockedNotes]);

  const checkActiveFormats = () => {
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikeThrough: document.queryCommandState('strikeThrough'),
    });
  };

  const handleEditorContextMenu = (e) => {
    e.preventDefault();
    setEditorMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY
    });
  };

  const executeCommand = (cmd, value) => {
    editorRef.current.focus();
    if (value === 'prompt') {
      const url = prompt("Enter URL:");
      if (url) document.execCommand(cmd, false, url);
    } else {
      document.execCommand(cmd, false, value);
    }
    setEditorMenu({ ...editorMenu, visible: false });
    updateNote(selectedId, 'content', editorRef.current.innerHTML);
  };

  const applyFormat = (command) => {
    document.execCommand(command, false, null);
    checkActiveFormats();
    updateNote(selectedId, 'content', editorRef.current.innerHTML);
  };

  const updateNote = (id, field, value) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, [field]: value } : n));
  };

  const deleteNote = (id) => {
    const newNotes = notes.filter(n => n.id !== id);
    setNotes(newNotes);
    if (selectedId === id) setSelectedId(newNotes[0]?.id || null);
    setAlertConfig({ isOpen: true, type: 'info', message: "Note deleted successfully" });
  };

  const confirmPassword = () => {
    const note = notes.find(n => n.id === lockModal.noteId);
    if (!note) return;

    if (!note.locked) {
      // Yangi parol o'rnatish
      setNotes(prev => prev.map(n => n.id === note.id ? { ...n, locked: true, password: passwordInput } : n));
      setLockModal({ open: false, noteId: null });
      setAlertConfig({ isOpen: true, type: 'success', message: "Note locked successfully" });
    } else {
      // Parolni tekshirish
      if (note.password === passwordInput) {
        setUnlockedNotes(prev => [...prev, note.id]);
        setLockModal({ open: false, noteId: null }); // To'g'ri bo'lsa modal yopiladi
        setAlertConfig({ isOpen: true, type: 'success', message: "Access granted" });
      } else {
        // XATO BO'LGANDA: Avval modalni yopamiz, keyin Alert chiqaramiz
        setLockModal({ open: false, noteId: null });
        setAlertConfig({
          isOpen: true,
          type: 'error',
          message: "Incorrect Password. Please try again."
        });
      }
    }
    setPasswordInput('');
  };

  const removePassword = (noteId) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === noteId
          ? {
            ...note,
            locked: false,
            password: null
          }
          : note
      )
    );

    setUnlockedNotes(prev => prev.filter(id => id !== noteId));

    setAlertConfig({
      isOpen: true,
      type: 'info',
      message: 'Password removed successfully'
    });
  };


  const activeNote = notes.find(n => n.id === selectedId);
  const isAccessible = activeNote && (!activeNote.locked || unlockedNotes.includes(activeNote.id));

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center p-6 font-sans select-none overflow-hidden bg-slate-950"
      onClick={() => {
        setContextMenu({ ...contextMenu, visible: false });
        setEditorMenu({ ...editorMenu, visible: false });
      }}
    >
      {bgImage && (
        <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xl" />
        </div>
      )}

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 w-full max-w-5xl h-[85vh] flex overflow-hidden rounded-3xl border border-white/20 shadow-2xl bg-black/20 backdrop-blur-3xl">

        {/* Sidebar */}
        <AnimatePresence initial={false}>
          {isSidebarOpen && (
            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 280, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="border-r border-white/10 flex flex-col overflow-hidden bg-white/5">
              <div className="h-16 flex justify-between items-center px-5 shrink-0 text-white mb-6">
                <h2 className="opacity-50 font-bold text-lg">Notes</h2>
                <button onClick={() => {
                  const newId = Date.now();
                  setNotes([{ id: newId, title: '', content: '', date: 'Now', pinned: false, locked: false, password: null }, ...notes]);
                  setSelectedId(newId);
                }} className='mt-5'><Edit3 size={18} className="text-blue-400" /></button>
              </div>
              <div className="flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar">
                {notes.sort((a, b) => b.pinned - a.pinned).map(note => (
                  <div
                    key={note.id}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setContextMenu({ visible: true, x: e.clientX, y: e.clientY, noteId: note.id });
                    }}
                    onClick={() => setSelectedId(note.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-all duration-300 text-white ${selectedId === note.id ? 'bg-blue-600' : 'hover:bg-white/10'}`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm truncate">{note.locked && !unlockedNotes.includes(note.id) ? 'Locked Note' : (note.title || 'New Note')}</h3>
                      {note.pinned && <Pin size={10} className="fill-current" />}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 shrink-0">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-blue-400"><SidebarIcon size={20} /></button>

            {isAccessible && (
              <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                {['bold', 'italic', 'underline', 'strikeThrough'].map(f => (
                  <button key={f} onMouseDown={(e) => { e.preventDefault(); applyFormat(f); }} className={`p-2 rounded-lg transition-all ${activeFormats[f] ? 'bg-blue-600 text-white' : 'text-white/70 hover:bg-white/10'}`}>
                    {f === 'bold' ? <Bold size={16} /> : f === 'italic' ? <Italic size={16} /> : f === 'underline' ? <Underline size={16} /> : <Strikethrough size={16} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto relative custom-scrollbar">
            {activeNote ? (
              isAccessible ? (
                <div className="max-w-2xl mx-auto px-10 py-12">
                  <span className="block text-center text-[11px] text-white/30 font-bold uppercase mb-10 tracking-widest">{activeNote.date}</span>
                  <input className="w-full bg-transparent text-4xl font-bold outline-none mb-6 text-white" value={activeNote.title} onChange={(e) => updateNote(selectedId, 'title', e.target.value)} placeholder="Title" />

                  <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onContextMenu={handleEditorContextMenu}
                    className="w-full min-h-[50vh] bg-transparent outline-none text-[18px] text-white/80 leading-relaxed prose prose-invert max-w-none"
                    onInput={(e) => updateNote(selectedId, 'content', e.currentTarget.innerHTML)}
                    onSelect={checkActiveFormats}
                  />
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-white space-y-6">
                  <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl"><Lock size={64} className="text-blue-500" /></div>
                  <button onClick={() => setLockModal({ open: true, noteId: activeNote.id })} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold transition-all">Unlock Note</button>
                </div>
              )
            ) : <div className="h-full flex items-center justify-center text-white/20">Select a note</div>}
          </div>
        </div>
      </motion.div>

      {/* Editor Kontekst Menyusi (Formatting) */}
      <AnimatePresence>
        {editorMenu.visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: editorMenu.y, left: editorMenu.x }}
            className="z-[999] w-64 bg-neutral-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-2"
          >
            <div className="px-3 py-1.5 text-[10px] font-bold text-white/30 uppercase tracking-widest border-b border-white/5 mb-1">Formatting</div>
            {commands.map((cmd) => (
              <button key={cmd.id} onClick={() => executeCommand(cmd.command, cmd.value)} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-white/80 hover:bg-blue-600 hover:text-white rounded-xl transition-all group">
                <div className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg group-hover:bg-white/20">{cmd.icon}</div>
                <span className="font-medium">{cmd.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {contextMenu.visible && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: contextMenu.y, left: contextMenu.x }} className="z-[999] w-48 bg-neutral-900/90 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-2xl p-1.5">
            <button onClick={() => { updateNote(contextMenu.noteId, 'pinned', !notes.find(n => n.id === contextMenu.noteId).pinned); setContextMenu({ ...contextMenu, visible: false }); }} className="flex w-full items-center gap-3 px-3 py-2 text-sm text-white hover:bg-blue-600 rounded-xl transition-colors">
              <Pin size={14} /> {notes.find(n => n.id === contextMenu.noteId)?.pinned ? 'Unpin' : 'Pin Note'}
            </button>
            {(() => {
              const note = notes.find(n => n.id === contextMenu.noteId);
              const isLocked = note?.locked;

              return (
                <button
                  onClick={() => {
                    const note = notes.find(n => n.id === contextMenu.noteId);

                    if (note.locked) {
                      removePassword(note.id);
                    } else {
                      setLockModal({ open: true, noteId: note.id });
                    }

                    setContextMenu({ ...contextMenu, visible: false });
                  }}
                  className="flex w-full items-center gap-3 px-3 py-2 text-sm text-white hover:bg-blue-600 rounded-xl transition-colors"
                >
                  {isLocked ? <Unlock size={14} /> : <Lock size={14} />}
                  {isLocked ? 'Remove Password' : 'Set Password'}
                </button>
              );
            })()}
            <div className="h-px bg-white/10 my-1" />
            <button onClick={() => { deleteNote(contextMenu.noteId); setContextMenu({ ...contextMenu, visible: false }); }} className="flex w-full items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-colors">
              <Trash2 size={14} /> Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lock Modal */}
      <AnimatePresence>
        {lockModal.open && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="w-full max-w-sm bg-neutral-900 border border-white/10 rounded-[2rem] p-8 text-white text-center">
              <Key className="mx-auto mb-6 text-blue-400" size={32} />
              <h3 className="text-2xl font-bold mb-4">Password</h3>
              <input autoFocus type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && confirmPassword()} className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 mb-6 outline-none focus:ring-2 ring-blue-500" placeholder="••••••••" />
              <div className="flex gap-3">
                <button onClick={() => setLockModal({ open: false })} className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">Cancel</button>
                <button onClick={confirmPassword} className="flex-1 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 transition-all font-bold">Confirm</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <MacAlert isOpen={alertConfig.isOpen} type={alertConfig.type} message={alertConfig.message} onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })} />

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        h1 { font-size: 2.5rem; font-weight: 800; color: white; margin-bottom: 1rem; }
        h2 { font-size: 1.8rem; font-weight: 700; color: #cbd5e1; margin-top: 1.5rem; }
        pre { background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 1rem; color: #60a5fa; font-family: monospace; }
        blockquote { border-left: 4px solid #3b82f6; padding-left: 1.5rem; font-style: italic; color: #94a3b8; }
      `}} />


      <MacAlert
        isOpen={alertConfig.isOpen}
        type={alertConfig.type}
        message={alertConfig.message}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
      />
    </div>
  );
};

export default Notes;
