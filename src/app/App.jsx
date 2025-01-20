import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import InputPage from './pages/InputPage';
import HistoryPage from './pages/HistoryPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-100 py-10">
        <div className="container max-w-screen-xl mx-auto">
          <div className=""><Navigation /></div>
          <div className="bg-white mt-10 rounded-2xl">
            <Routes>
              <Route path="/" element={<InputPage />} />
              <Route path="/history" element={<HistoryPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
