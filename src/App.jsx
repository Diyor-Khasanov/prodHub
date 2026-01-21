import React from 'react'
import { Outlet } from 'react-router-dom'
import Toolbar from './components/Toolbar'

const App = () => {
  return (
    <div className='font-sans'>
      <Outlet />
      <Toolbar />
    </div>
  )
}

export default App
