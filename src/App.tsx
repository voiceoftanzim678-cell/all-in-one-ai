import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext.js';
import { Navbar } from './components/Navbar.js';
import { Hero } from './components/Hero.js';
import { CategoryNav } from './components/CategoryNav.js';
import { ToolGrid } from './components/ToolGrid.js';
import { CategoriesView } from './components/CategoriesView.js';
import { ToolDetailModal } from './components/ToolDetailModal.js';
import { AboutSection } from './components/AboutSection.js';
import { ContactSection } from './components/ContactSection.js';
import { LegalPages } from './components/LegalPages.js';
import { Footer } from './components/Footer.js';
import { AdPlaceholder } from './components/AdPlaceholder.js';
import { AdminLogin } from './components/admin/AdminLogin.js';
import { AdminDashboard } from './components/admin/AdminDashboard.js';

const MainContent: React.FC = () => {
  const {
    activePage,
    selectedTool,
    setSelectedTool,
    isAdmin,
    tools,
  } = useApp();

  // Check URL params on mount (for deep-linking e.g. ?tool=tool-chatgpt or ?page=admin)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const toolId = params.get('tool');
    if (toolId && tools.length > 0) {
      const match = tools.find(t => t.id === toolId);
      if (match) {
        setSelectedTool(match);
      }
    }
  }, [tools, setSelectedTool]);

  // If in Admin route
  if (activePage === 'admin') {
    return isAdmin ? <AdminDashboard /> : <AdminLogin />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Monetization Header Ad Placement */}
      <AdPlaceholder zone="header" />

      {/* Primary Top Bar Contract Navigation */}
      <Navbar />

      {/* Main Page Routing */}
      <main className="flex-1">
        {activePage === 'home' && (
          <>
            <Hero />
            <AdPlaceholder zone="homepage" />
            <CategoryNav />
            <ToolGrid />
            <div className="border-t border-slate-200/80 dark:border-slate-800/80">
              <AboutSection />
            </div>
          </>
        )}

        {activePage === 'tools' && (
          <>
            <CategoryNav />
            <ToolGrid />
          </>
        )}

        {activePage === 'categories' && <CategoriesView />}

        {activePage === 'popular' && (
          <>
            <CategoryNav />
            <ToolGrid />
          </>
        )}

        {activePage === 'about' && <AboutSection />}

        {activePage === 'contact' && <ContactSection />}

        {activePage === 'privacy' && <LegalPages type="privacy" />}

        {activePage === 'terms' && <LegalPages type="terms" />}

        {activePage === 'disclaimer' && <LegalPages type="disclaimer" />}
      </main>

      {/* AI Tool Detail Modal / Dedicated View */}
      {selectedTool && (
        <ToolDetailModal
          tool={selectedTool}
          onClose={() => setSelectedTool(null)}
        />
      )}

      {/* Global Footer with Ad Area and Links */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
