import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-bx-bg text-bx-text">
      <div className="flex">
        <Sidebar />
        <main className="min-h-screen flex-1">
          <Navbar />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
