import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import LoginPage from './components/Auth/LoginPage';
import Header from './components/Header';
import Navbar from './components/Navbar';
import FirstAidSection from './components/FirstAid/FirstAidSection';
import FidgetSection from './components/Fidget/FidgetSection';
import GamesSection from './components/Games/GamesSection';

export default function App() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('firstaid');

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-[#ffd1dc] flex flex-col select-none">
      {/* Ambient background glows */}
      <div className="absolute top-10 -left-20 w-80 h-80 bg-pink-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 -right-20 w-80 h-80 bg-rose-400/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 w-full h-full relative overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'firstaid' && (
            <motion.div
              key="firstaid"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="w-full h-full"
            >
              <FirstAidSection />
            </motion.div>
          )}

          {activeTab === 'fidget' && (
            <motion.div
              key="fidget"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="w-full h-full"
            >
              <FidgetSection />
            </motion.div>
          )}

          {activeTab === 'games' && (
            <motion.div
              key="games"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="w-full h-full"
            >
              <GamesSection />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <Navbar activeTab={activeTab} onSelectTab={setActiveTab} />
    </div>
  );
}
