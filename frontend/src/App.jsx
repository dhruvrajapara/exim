import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Home from './pages/Home';
import FloatingActionButtons from './components/FloatingActionButtons';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="*" element={<div className="p-8 text-center"><h1 className="text-4xl font-bold mb-4">404 - Not Found</h1><p>The page you are looking for does not exist.</p></div>} />
        </Route>
      </Routes>
      <FloatingActionButtons />
    </BrowserRouter>
  );
}

export default App;
