import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Overview from './pages/Overview.jsx';
import Inventory from './pages/Inventory.jsx';
import StockActivity from './pages/StockActivity.jsx';
import Reports from './pages/Reports.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Overview />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="stock-activity" element={<StockActivity />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}

export default App;