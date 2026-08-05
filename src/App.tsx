import { useState } from 'react'
import Landing from './pages/Landing'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import { ToastProvider } from './components/cultr-ui'

type Page = 'landing' | 'signin' | 'signup' | 'dashboard'

export default function App() {
  const [page, setPage] = useState<Page>('landing')

  return (
    <ToastProvider>
      {page === 'landing' && (
        <Landing
          onSignIn={() => setPage('signin')}
          onSignUp={() => setPage('signup')}
        />
      )}
      {page === 'signin' && (
        <SignIn
          onSignIn={() => setPage('dashboard')}
          onSignUp={() => setPage('signup')}
        />
      )}
      {page === 'signup' && (
        <SignUp
          onSignIn={() => setPage('signin')}
          onComplete={() => setPage('dashboard')}
        />
      )}
      {page === 'dashboard' && (
        <Dashboard
          onSignOut={() => setPage('landing')}
        />
      )}
    </ToastProvider>
  )
}
