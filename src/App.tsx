import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import SearchPage from './components/SearchPage'
import ContentPage from './components/ContentPage'
import { DataService } from './services'

function AppHeader() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <header style={{
      backgroundColor: '#f8f9fa',
      padding: '1rem 2rem',
      borderBottom: '1px solid #dee2e6',
      marginBottom: '1rem'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <Link 
          to="/" 
          style={{ 
            textDecoration: 'none', 
            color: '#495057',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Phoenix Tools</h1>
        </Link>
        
        {!isHomePage && (
          <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link 
              to="/" 
              style={{
                color: '#007bff',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                backgroundColor: '#e9ecef',
                fontSize: '0.9rem'
              }}
            >
              ← Back to Search
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}

function App() {
  useEffect(() => {
    // Initialize data service and caching on app start
    const initializeApp = async () => {
      await DataService.initialize();
    };
    initializeApp().catch(console.error);
  }, []);

  return (
    <Router basename="/phoenix-tools">
      <div className="App">
        <AppHeader />
        <main style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 2rem' 
        }}>
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/:category/:source/:slug" element={<ContentPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App