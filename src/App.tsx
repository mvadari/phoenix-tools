import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import HomePage from './components/HomePage'
import SearchPage from './components/SearchPage'
import ContentPage from './components/ContentPage'
import GlobalSearch from './components/GlobalSearch'
import { DataService } from './services'

function AppHeader() {
  const location = useLocation();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const toggleMobileSearch = () => {
    setMobileSearchOpen(!mobileSearchOpen);
  };

  // Close mobile search when route changes
  useEffect(() => {
    setMobileSearchOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className="app-header">
        <div className="header-content">
          <Link
            to="/"
            className="app-title-link"
            onClick={() => setMobileSearchOpen(false)}
          >
            <h1>Phoenix Tools</h1>
          </Link>

          <div className="header-search">
            <GlobalSearch isMobile={false} />
          </div>

          <nav className="app-nav">
            <Link
              to="/search"
              className="nav-link desktop-only"
            >
              Advanced Search
            </Link>

            <button
              className="mobile-search-toggle"
              onClick={toggleMobileSearch}
              aria-label="Toggle search"
            >
              <div className={`hamburger ${mobileSearchOpen ? 'open' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
          </nav>
        </div>
      </header>

      {mobileSearchOpen && (
        <GlobalSearch
          isMobile={true}
          isOpen={mobileSearchOpen}
          onToggle={toggleMobileSearch}
        />
      )}
    </>
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
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/:category/:slug" element={<ContentPage />} />
            <Route path="/:category/:source/:slug" element={<ContentPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App