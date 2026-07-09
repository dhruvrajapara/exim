import { Outlet as RouterOutlet } from 'react-router-dom';
import Header from './Header';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-light text-text font-sans">
      <Header />
      
      <main className="flex-grow w-full max-w-[1440px] mx-auto py-10 md:py-12">
        <RouterOutlet />
      </main>

      <footer className="bg-slate-900 text-slate-300 py-8 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} Enterprise AI Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
