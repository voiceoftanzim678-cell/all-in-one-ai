import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AiTool, Category, SiteSettings, User } from '../types.js';
import { Language, getTranslation } from '../i18n.js';

export type PageRoute = 
  | 'home' 
  | 'tools' 
  | 'categories' 
  | 'popular' 
  | 'about' 
  | 'contact' 
  | 'admin' 
  | 'privacy' 
  | 'terms' 
  | 'disclaimer';

export type AdminTab = 'dashboard' | 'tools' | 'add-tool' | 'categories' | 'settings';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: Parameters<typeof getTranslation>[0]) => string;
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  tools: AiTool[];
  categories: Category[];
  settings: SiteSettings | null;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;

  user: User | null;
  token: string | null;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;

  activePage: PageRoute;
  navigateTo: (page: PageRoute, param?: string) => void;
  selectedTool: AiTool | null;
  setSelectedTool: (tool: AiTool | null) => void;

  // Search & Filter
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedFilter: string;
  setSelectedFilter: (f: string) => void;
  selectedPricing: string;
  setSelectedPricing: (p: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  resetFilters: () => void;

  // Admin
  adminActiveTab: AdminTab;
  setAdminActiveTab: (tab: AdminTab) => void;
  editingTool: AiTool | null;
  setEditingTool: (tool: AiTool | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language preference stored locally
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('aio_lang') as Language;
    return saved === 'bn' || saved === 'en' ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('aio_lang', lang);
  };

  const t = useCallback((key: Parameters<typeof getTranslation>[0]) => {
    return getTranslation(key, language);
  }, [language]);

  // 2. Theme stored locally
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('aio_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('aio_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // 3. User & Auth state
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('aio_token'));

  // 4. Data states
  const [tools, setTools] = useState<AiTool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 5. Routing & navigation states
  const [activePage, setActivePage] = useState<PageRoute>('home');
  const [selectedTool, setSelectedTool] = useState<AiTool | null>(null);

  // 6. Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFilter, setSelectedFilter] = useState('all'); // all, featured, popular, sponsored
  const [selectedPricing, setSelectedPricing] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // 7. Admin UI states
  const [adminActiveTab, setAdminActiveTab] = useState<AdminTab>('dashboard');
  const [editingTool, setEditingTool] = useState<AiTool | null>(null);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedFilter('all');
    setSelectedPricing('all');
    setSortBy('newest');
  }, []);

  const navigateTo = useCallback((page: PageRoute, param?: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (page === 'popular') {
      setSelectedFilter('popular');
    } else if (page === 'tools') {
      if (param) setSelectedCategory(param);
    }
  }, []);

  // Fetch initial data
  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const [toolsRes, catsRes, settingsRes] = await Promise.all([
        fetch('/api/tools?includeInactive=true', { headers }),
        fetch('/api/categories?includeInactive=true', { headers }),
        fetch('/api/settings'),
      ]);

      if (!toolsRes.ok || !catsRes.ok) {
        throw new Error('Failed to load directory data.');
      }

      const toolsData = await toolsRes.json();
      const catsData = await catsRes.json();
      const settingsData = await settingsRes.json();

      setTools(toolsData);
      setCategories(catsData);
      setSettings(settingsData);
    } catch (err: any) {
      console.error('Error fetching directory data:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Check auth session on boot
  useEffect(() => {
    async function checkAuth() {
      if (!token) {
        setUser(null);
        return;
      }
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          // Token expired or invalid
          localStorage.removeItem('aio_token');
          setToken(null);
          setUser(null);
        }
      } catch {
        localStorage.removeItem('aio_token');
        setToken(null);
        setUser(null);
      }
    }
    checkAuth();
  }, [token]);

  // Load data on start
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Real Login
  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed.' };
      }

      localStorage.setItem('aio_token', data.token);
      setToken(data.token);
      setUser(data.user);
      setActivePage('admin');
      setAdminActiveTab('dashboard');
      refreshData();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error during login.' };
    }
  };

  // Real Logout
  const logout = async () => {
    try {
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('aio_token');
      setToken(null);
      setUser(null);
      if (activePage === 'admin') {
        setActivePage('home');
      }
      refreshData();
    }
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        theme,
        toggleTheme,
        tools,
        categories,
        settings,
        loading,
        error,
        refreshData,
        user,
        token,
        isAdmin: user?.role === 'admin',
        login,
        logout,
        activePage,
        navigateTo,
        selectedTool,
        setSelectedTool,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedFilter,
        setSelectedFilter,
        selectedPricing,
        setSelectedPricing,
        sortBy,
        setSortBy,
        resetFilters,
        adminActiveTab,
        setAdminActiveTab,
        editingTool,
        setEditingTool,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
