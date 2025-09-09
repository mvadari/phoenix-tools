import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import SearchPage from './components/SearchPage'
import ContentPage from './components/ContentPage'
import { DataService } from './services'

function AppHeader() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <header className="app-header">
      <div className="header-content">
        <Link 
          to="/" 
          className="app-title-link"
        >
          <h1>Phoenix Tools</h1>
        </Link>
        
        {!isHomePage && (
          <nav className="app-nav">
            <Link 
              to="/" 
              className="nav-link"
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
    <Router basename="/">
      <div className="App">
        <AppHeader />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/:category/:slug" element={<ContentPage />} />
            <Route path="/:category/:source/:slug" element={<ContentPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App