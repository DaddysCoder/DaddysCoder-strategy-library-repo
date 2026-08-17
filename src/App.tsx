import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { DisclaimerGate } from './components/DisclaimerGate'
import { Layout } from './components/Layout'
import { Strategies } from './pages/Strategies'
import { Responsive } from './pages/Responsive'
import { StrategyDetail } from './pages/StrategyDetail'
import { NewPersonalisation } from './pages/NewPersonalisation'
import { Personalisations } from './pages/Personalisations'
import { Settings } from './pages/Settings'
import { ensureSeeded } from './lib/seedData'

function App() {
  useEffect(() => {
    ensureSeeded()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <DisclaimerGate>
              <Layout />
            </DisclaimerGate>
          }
        >
          <Route path="/" element={<Strategies />} />
          <Route path="/responsive" element={<Responsive />} />
          <Route path="/strategies/:strategyId" element={<StrategyDetail />} />
          <Route path="/personalisations" element={<Personalisations />} />
          <Route path="/personalisations/new" element={<NewPersonalisation />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
