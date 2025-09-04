import { useEffect } from 'react'
import SearchPage from './components/SearchPage'
import { DataService } from './services'

function App() {
  useEffect(() => {
    // Initialize data service and caching on app start
    DataService.initialize().catch(console.error);
  }, []);

  return (
    <div className="App">
      <header>
        <h1>5e Tools</h1>
      </header>
      <main>
        <SearchPage />
      </main>
    </div>
  )
}

export default App