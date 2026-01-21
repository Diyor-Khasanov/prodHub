import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Pomodoro from './pages/Pomodoro.jsx'
import Tasks from './pages/Tasks.jsx'
import Notes from './pages/Notes.jsx'
import BlockSites from './pages/BlockSites.jsx'
import Links from './pages/Links.jsx'
import Calendar from './pages/Calendar.jsx'
import Settings from './pages/Settings.jsx'
import NotFound from './pages/NotFound.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: '/pomodoro',
        element: <Pomodoro />
      },
      {
        path: '/tasks',
        element: <Tasks />
      },
      {
        path: '/notes',
        element: <Notes />
      },
      {
        path: '/blockSites',
        element: <BlockSites />
      },
      {
        path: '/links',
        element: <Links />
      },
      {
        path: '/calendar',
        element: <Calendar />
      },
      {
        path: '/settings',
        element: <Settings />
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
  </StrictMode>,
)
