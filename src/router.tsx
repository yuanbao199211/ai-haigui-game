import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { GamePage } from './pages/GamePage'
import { HomePage } from './pages/HomePage'
import { ResultPage } from './pages/ResultPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'game/:id', element: <GamePage /> },
      { path: 'result/:id', element: <ResultPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
