import React, { useState, useEffect } from 'react'
import { Trash2, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Links = () => {
  const [bgImage] = useState(localStorage.getItem('bgImage'))

  const [links, setLinks] = useState([])
  const [categories, setCategories] = useState([])
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [category, setCategory] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const storedLinks = JSON.parse(localStorage.getItem('links')) || []
    const storedCategories = JSON.parse(localStorage.getItem('categories')) || []
    setLinks(storedLinks)
    setCategories(storedCategories)
  }, [])

  useEffect(() => {
    localStorage.setItem('links', JSON.stringify(links))
  }, [links])

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories))
  }, [categories])

  const addLink = () => {
    if (!title || !url) return
    setLinks([...links, { id: Date.now(), title, url, category }])
    setTitle('')
    setUrl('')
    setCategory('')
  }

  const deleteLink = (id) => {
    setLinks(links.filter(link => link.id !== id))
  }

  const addCategory = () => {
    if (!newCategory) return
    if (categories.includes(newCategory)) return
    setCategories([...categories, newCategory])
    setNewCategory('')
  }

  const filteredLinks =
    filter === 'all' ? links : links.filter(l => l.category === filter)

  return (
    <div className="min-h-screen flex justify-center items-start pt-16 relative overflow-hidden bg-gray-900 text-white">
      {/* Background */}
      {bgImage ? (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-xl" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-gray-900" />
      )}

      {/* Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-xl bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-white drop-shadow-lg flex items-center gap-2">
          🔗 Link Manager
        </h2>

        {/* Add category */}
        <div className="flex gap-2 mb-4">
          <input
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            placeholder="New category"
            className="flex-1 px-3 py-2 rounded-lg bg-white/20 backdrop-blur-sm placeholder-white/70 text-white transition duration-300 focus:bg-white/30 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addCategory}
            className="bg-indigo-600 px-4 py-2 rounded-lg shadow-md flex items-center gap-1"
          >
            <Plus size={18} /> Add
          </motion.button>
        </div>

        {/* Add link */}
        <div className="space-y-2 mb-4">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full px-3 py-2 rounded-lg bg-white/20 backdrop-blur-sm placeholder-white/70 text-white transition duration-300 focus:bg-white/30 focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="URL"
            className="w-full px-3 py-2 rounded-lg bg-white/20 backdrop-blur-sm placeholder-white/70 text-white transition duration-300 focus:bg-white/30 focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white transition duration-300 focus:bg-white/30 focus:ring-2 focus:ring-green-400 focus:outline-none"
          >
            <option value="">No category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={addLink}
            className="w-full bg-green-600 py-2 rounded-lg hover:bg-green-500 transition-all duration-300 shadow-md flex items-center justify-center gap-1"
          >
            <Plus size={18} /> Add Link
          </motion.button>
        </div>

        {/* Filter */}
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded-lg bg-white/20 text-white backdrop-blur-sm transition duration-300 focus:bg-white/30 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        >
          <option value="all">All</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Links list */}
        <ul className="space-y-3">
          <AnimatePresence>
            {filteredLinks.map(link => (
              <motion.li
                key={link.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex justify-between items-center bg-white/10 hover:bg-white/20 transition-colors duration-300 px-4 py-3 rounded-xl shadow-inner backdrop-blur-sm"
              >
                <a
                  href={link.url}
                  target="_blank"
                  className="text-indigo-400 hover:text-indigo-300 transition-all duration-300"
                >
                  {link.title}
                </a>
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => deleteLink(link.id)}
                  className="text-red-400 hover:text-red-300 transition-colors duration-300"
                >
                  <Trash2 size={18} />
                </motion.button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </motion.div>
    </div>
  )
}

export default Links
