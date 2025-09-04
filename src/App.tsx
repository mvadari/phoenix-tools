import { useEffect } from 'react'
import SearchPage from './components/SearchPage'
import { DataService } from './services'

function App() {
  useEffect(() => {
    // Initialize data service and caching on app start
    const initializeApp = async () => {
      await DataService.initialize();
    };
    initializeApp().catch(console.error);
  }, []);

  return (
    <div className="App">
      <header>
        <h1>Phoenix Tools</h1>
      </header>
      <main>
        <SearchPage />
      </main>
    </div>
  )
}

export default App