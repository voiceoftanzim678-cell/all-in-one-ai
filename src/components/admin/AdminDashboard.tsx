import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.js';
import { AiTool, Category, PricingType, AdminStats } from '../../types.js';
import { 
  LayoutDashboard, Wrench, PlusCircle, FolderTree, Settings, 
  LogOut, Sparkles, Flame, CheckCircle, Trash2, Edit3, 
  ExternalLink, Search, RefreshCw, X, Shield, ArrowLeft,
  DollarSign, Check, Menu, AlertTriangle
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    t,
    language,
    token,
    logout,
    tools,
    categories,
    settings,
    refreshData,
    adminActiveTab,
    setAdminActiveTab,
    editingTool,
    setEditingTool,
    navigateTo,
  } = useApp();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [adminSearch, setAdminSearch] = useState('');

  // Forms states
  const [toolForm, setToolForm] = useState<{
    name_en: string;
    name_bn: string;
    logo_url: string;
    website_url: string;
    category_id: string;
    short_description_en: string;
    short_description_bn: string;
    full_description_en: string;
    full_description_bn: string;
    tags: string;
    features_en: string;
    features_bn: string;
    pricing_type: PricingType;
    featured: boolean;
    popular: boolean;
    active: boolean;
    sponsored: boolean;
  }>({
    name_en: '',
    name_bn: '',
    logo_url: '',
    website_url: '',
    category_id: '',
    short_description_en: '',
    short_description_bn: '',
    full_description_en: '',
    full_description_bn: '',
    tags: '',
    features_en: '',
    features_bn: '',
    pricing_type: 'Freemium',
    featured: false,
    popular: false,
    active: true,
    sponsored: false,
  });

  const [catForm, setCatForm] = useState<{
    id?: string;
    name_en: string;
    name_bn: string;
    description_en: string;
    description_bn: string;
    icon: string;
    sort_order: number;
    active: boolean;
  }>({
    name_en: '',
    name_bn: '',
    description_en: '',
    description_bn: '',
    icon: 'Folder',
    sort_order: 1,
    active: true,
  });

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Settings form
  const [settingsForm, setSettingsForm] = useState({
    site_name: '',
    tagline_en: '',
    tagline_bn: '',
    description_en: '',
    description_bn: '',
    contact_email: '',
    twitter: '',
    github: '',
    linkedin: '',
    footer_text_en: '',
    footer_text_bn: '',
    ad_placeholders_enabled: true,
    privacy_policy_en: '',
    privacy_policy_bn: '',
    terms_of_service_en: '',
    terms_of_service_bn: '',
    disclaimer_en: '',
    disclaimer_bn: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Load stats from server
  const fetchStats = async () => {
    if (!token) return;
    try {
      setStatsLoading(true);
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [token, tools]);

  // Sync settings when loaded
  useEffect(() => {
    if (settings) {
      setSettingsForm({
        site_name: settings.site_name || 'ALL IN ONE',
        tagline_en: settings.tagline_en || '',
        tagline_bn: settings.tagline_bn || '',
        description_en: settings.description_en || '',
        description_bn: settings.description_bn || '',
        contact_email: settings.contact_email || '',
        twitter: settings.social_links?.twitter || '',
        github: settings.social_links?.github || '',
        linkedin: settings.social_links?.linkedin || '',
        footer_text_en: settings.footer_text_en || '',
        footer_text_bn: settings.footer_text_bn || '',
        ad_placeholders_enabled: settings.ad_placeholders_enabled ?? true,
        privacy_policy_en: settings.privacy_policy_en || '',
        privacy_policy_bn: settings.privacy_policy_bn || '',
        terms_of_service_en: settings.terms_of_service_en || '',
        terms_of_service_bn: settings.terms_of_service_bn || '',
        disclaimer_en: settings.disclaimer_en || '',
        disclaimer_bn: settings.disclaimer_bn || '',
      });
    }
  }, [settings]);

  // Sync tool edit form
  useEffect(() => {
    if (editingTool) {
      setToolForm({
        name_en: editingTool.name_en,
        name_bn: editingTool.name_bn || '',
        logo_url: editingTool.logo_url || '',
        website_url: editingTool.website_url,
        category_id: editingTool.category_id,
        short_description_en: editingTool.short_description_en,
        short_description_bn: editingTool.short_description_bn || '',
        full_description_en: editingTool.full_description_en || '',
        full_description_bn: editingTool.full_description_bn || '',
        tags: editingTool.tags ? editingTool.tags.join(', ') : '',
        features_en: editingTool.features_en ? editingTool.features_en.join('\n') : '',
        features_bn: editingTool.features_bn ? editingTool.features_bn.join('\n') : '',
        pricing_type: editingTool.pricing_type,
        featured: editingTool.featured,
        popular: editingTool.popular,
        active: editingTool.active,
        sponsored: Boolean(editingTool.sponsored),
      });
      setAdminActiveTab('add-tool');
    }
  }, [editingTool]);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setActionMessage({ type, text });
    setTimeout(() => setActionMessage(null), 4000);
  };

  // Handle Tool Submit (Add or Edit)
  const handleToolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!toolForm.name_en.trim()) {
      showNotification('error', 'AI Name (English) is required.');
      return;
    }
    if (!toolForm.website_url.trim()) {
      showNotification('error', 'Official Website URL is required.');
      return;
    }

    try {
      setActionLoading(true);
      const isEditing = Boolean(editingTool);
      const endpoint = isEditing ? `/api/tools/${editingTool!.id}` : '/api/tools';
      const method = isEditing ? 'PUT' : 'POST';

      const payload = {
        name_en: toolForm.name_en,
        name_bn: toolForm.name_bn,
        logo_url: toolForm.logo_url,
        website_url: toolForm.website_url,
        category_id: toolForm.category_id || categories[0]?.id || 'cat-chat',
        short_description_en: toolForm.short_description_en,
        short_description_bn: toolForm.short_description_bn,
        full_description_en: toolForm.full_description_en,
        full_description_bn: toolForm.full_description_bn,
        tags: toolForm.tags,
        features_en: toolForm.features_en,
        features_bn: toolForm.features_bn,
        pricing_type: toolForm.pricing_type,
        featured: toolForm.featured,
        popular: toolForm.popular,
        active: toolForm.active,
        sponsored: toolForm.sponsored,
      };

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save AI tool.');
      }

      showNotification('success', isEditing ? 'AI tool updated successfully!' : 'AI tool created successfully!');
      setEditingTool(null);
      setToolForm({
        name_en: '',
        name_bn: '',
        logo_url: '',
        website_url: '',
        category_id: categories[0]?.id || 'cat-chat',
        short_description_en: '',
        short_description_bn: '',
        full_description_en: '',
        full_description_bn: '',
        tags: '',
        features_en: '',
        features_bn: '',
        pricing_type: 'Freemium',
        featured: false,
        popular: false,
        active: true,
        sponsored: false,
      });
      await refreshData();
      setAdminActiveTab('tools');
    } catch (err: any) {
      showNotification('error', err.message || 'Error occurred.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Tool Delete
  const handleDeleteTool = async (id: string, name: string) => {
    if (!token) return;
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      setActionLoading(true);
      const res = await fetch(`/api/tools/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete tool');
      }
      showNotification('success', `Deleted "${name}" successfully.`);
      await refreshData();
    } catch (err: any) {
      showNotification('error', err.message || 'Error deleting tool.');
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle tool active / featured / popular directly
  const handleToggleToolFlag = async (tool: AiTool, field: 'active' | 'featured' | 'popular') => {
    if (!token) return;
    try {
      const updates = { [field]: !tool[field] };
      const res = await fetch(`/api/tools/${tool.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        await refreshData();
      }
    } catch (err) {
      console.error('Failed toggling tool flag:', err);
    }
  };

  // Handle Category Submit
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!catForm.name_en.trim()) {
      showNotification('error', 'Category English name is required.');
      return;
    }

    try {
      setActionLoading(true);
      const isEditing = Boolean(editingCategory);
      const endpoint = isEditing ? `/api/categories/${editingCategory!.id}` : '/api/categories';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(catForm),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save category.');
      }

      showNotification('success', isEditing ? 'Category updated!' : 'Category created!');
      setEditingCategory(null);
      setCatForm({
        name_en: '',
        name_bn: '',
        description_en: '',
        description_bn: '',
        icon: 'Folder',
        sort_order: categories.length + 1,
        active: true,
      });
      await refreshData();
    } catch (err: any) {
      showNotification('error', err.message || 'Error saving category.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Category Delete
  const handleDeleteCategory = async (id: string, name: string) => {
    if (!token) return;
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;

    try {
      setActionLoading(true);
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete category.');
      }
      showNotification('success', `Deleted category "${name}".`);
      await refreshData();
    } catch (err: any) {
      showNotification('error', err.message || 'Error deleting category.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Settings Submit
  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      setActionLoading(true);
      const payload = {
        site_name: settingsForm.site_name,
        tagline_en: settingsForm.tagline_en,
        tagline_bn: settingsForm.tagline_bn,
        description_en: settingsForm.description_en,
        description_bn: settingsForm.description_bn,
        contact_email: settingsForm.contact_email,
        social_links: {
          twitter: settingsForm.twitter,
          github: settingsForm.github,
          linkedin: settingsForm.linkedin,
        },
        footer_text_en: settingsForm.footer_text_en,
        footer_text_bn: settingsForm.footer_text_bn,
        ad_placeholders_enabled: settingsForm.ad_placeholders_enabled,
        privacy_policy_en: settingsForm.privacy_policy_en,
        privacy_policy_bn: settingsForm.privacy_policy_bn,
        terms_of_service_en: settingsForm.terms_of_service_en,
        terms_of_service_bn: settingsForm.terms_of_service_bn,
        disclaimer_en: settingsForm.disclaimer_en,
        disclaimer_bn: settingsForm.disclaimer_bn,
      };

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to update settings.');
      }

      showNotification('success', 'Website settings updated successfully!');
      await refreshData();
    } catch (err: any) {
      showNotification('error', err.message || 'Error updating settings.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Password Update
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (passwordForm.newPassword.length < 8) {
      showNotification('error', 'New password must be at least 8 characters.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showNotification('error', 'Passwords do not match.');
      return;
    }

    try {
      setActionLoading(true);
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword: passwordForm.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update password');
      showNotification('success', 'Admin password changed successfully!');
      setPasswordForm({ newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      showNotification('error', err.message || 'Failed updating password');
    } finally {
      setActionLoading(false);
    }
  };

  // Filter tools for tools tab
  const filteredTools = tools.filter(t => {
    if (!adminSearch) return true;
    const q = adminSearch.toLowerCase();
    return (
      t.name_en.toLowerCase().includes(q) ||
      (t.name_bn && t.name_bn.toLowerCase().includes(q)) ||
      t.short_description_en.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row text-slate-900 dark:text-slate-100">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigateTo('home')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('navHome')}</span>
        </button>

        <span className="font-extrabold text-sm text-cyan-600 dark:text-cyan-400">
          ALL IN ONE ADMIN
        </span>

        <button
          onClick={() => setMobileSidebarOpen(prev => !prev)}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileSidebarOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-5 shrink-0 flex flex-col justify-between`}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-600 text-white">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-black tracking-tight">ALL IN ONE</div>
                <div className="text-[10px] text-slate-400 font-mono">Admin Portal</div>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            <button
              onClick={() => {
                setAdminActiveTab('dashboard');
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                adminActiveTab === 'dashboard'
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{t('adminDashboardTitle')}</span>
            </button>

            <button
              onClick={() => {
                setAdminActiveTab('tools');
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                adminActiveTab === 'tools'
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Wrench className="w-4 h-4" />
                <span>{t('manageAiTools')}</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                {tools.length}
              </span>
            </button>

            <button
              onClick={() => {
                setEditingTool(null);
                setToolForm({
                  name_en: '',
                  name_bn: '',
                  logo_url: '',
                  website_url: '',
                  category_id: categories[0]?.id || 'cat-chat',
                  short_description_en: '',
                  short_description_bn: '',
                  full_description_en: '',
                  full_description_bn: '',
                  tags: '',
                  features_en: '',
                  features_bn: '',
                  pricing_type: 'Freemium',
                  featured: false,
                  popular: false,
                  active: true,
                  sponsored: false,
                });
                setAdminActiveTab('add-tool');
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                adminActiveTab === 'add-tool'
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>{editingTool ? t('editAiTool') : t('addNewAiTool')}</span>
            </button>

            <button
              onClick={() => {
                setAdminActiveTab('categories');
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                adminActiveTab === 'categories'
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <FolderTree className="w-4 h-4" />
                <span>{t('manageCategories')}</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                {categories.length}
              </span>
            </button>

            <button
              onClick={() => {
                setAdminActiveTab('settings');
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                adminActiveTab === 'settings'
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>{t('manageSettings')}</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <button
            onClick={() => navigateTo('home')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'bn' ? 'ওয়েবসাইটে ফিরে যান' : 'Back to Website'}</span>
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('navLogout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-1 p-4 sm:p-8 max-w-6xl overflow-y-auto">
        {/* Banner notification */}
        {actionMessage && (
          <div
            className={`mb-6 p-4 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-xs ${
              actionMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
            }`}
          >
            <span>{actionMessage.text}</span>
            <button onClick={() => setActionMessage(null)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {adminActiveTab === 'dashboard' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-xl sm:text-2xl font-black">{t('adminDashboardTitle')}</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {language === 'bn' ? 'ডিরেক্টরি সামগ্রিক পরিসংখ্যান ও নিয়ন্ত্রণ ব্যবস্থা' : 'Overview and health of your ALL IN ONE directory.'}
              </p>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500 font-medium">{t('totalAiTools')}</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-cyan-600 dark:text-cyan-400 mt-1 tabular-nums">
                  {stats?.total_tools ?? tools.length}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500 font-medium">{t('totalCategories')}</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1 tabular-nums">
                  {stats?.total_categories ?? categories.length}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500 font-medium">{t('featuredTools')}</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-cyan-500 mt-1 tabular-nums">
                  {stats?.featured_count ?? tools.filter(t => t.featured).length}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500 font-medium">{t('popularTools')}</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-rose-500 mt-1 tabular-nums">
                  {stats?.popular_count ?? tools.filter(t => t.popular).length}
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setEditingTool(null);
                  setAdminActiveTab('add-tool');
                }}
                className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t('addNewAiTool')}</span>
              </button>

              <button
                onClick={() => setAdminActiveTab('tools')}
                className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
              >
                <Wrench className="w-4 h-4" />
                <span>{t('manageAiTools')}</span>
              </button>

              <button
                onClick={() => refreshData()}
                className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 ml-auto"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{language === 'bn' ? 'রিফ্রেশ' : 'Sync'}</span>
              </button>
            </div>

            {/* Recently Added Tools */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="text-sm font-bold mb-4">{t('recentlyAdded')}</h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {tools.slice(0, 5).map(tool => (
                  <div key={tool.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-cyan-600 shrink-0">
                        {tool.name_en.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xs font-bold">{tool.name_en}</div>
                        <div className="text-[11px] text-slate-400">{tool.website_url}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingTool(tool);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-500"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTool(tool.id, tool.name_en)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE AI TOOLS */}
        {adminActiveTab === 'tools' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black">{t('manageAiTools')}</h1>
                <p className="text-xs text-slate-500 mt-1">
                  {language === 'bn' ? 'সবগুলো AI টুল দেখা, এডিট ও মুছার ড্যাশবোর্ড' : 'Search, edit, toggle visibility, and delete directory tools.'}
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingTool(null);
                  setAdminActiveTab('add-tool');
                }}
                className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-2 self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t('addNewAiTool')}</span>
              </button>
            </div>

            {/* Quick Filter Search */}
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={adminSearch}
                onChange={e => setAdminSearch(e.target.value)}
                placeholder="Search tools in admin..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Tools Table / Responsive List */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-500">
                    <tr>
                      <th className="py-3 px-4">Tool</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Pricing</th>
                      <th className="py-3 px-4 text-center">Active</th>
                      <th className="py-3 px-4 text-center">Featured</th>
                      <th className="py-3 px-4 text-center">Popular</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredTools.map(tool => (
                      <tr key={tool.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{tool.name_en}</span>
                            {tool.sponsored && (
                              <span className="text-[9px] bg-amber-100 dark:bg-amber-950 text-amber-600 px-1.5 py-0.5 rounded uppercase font-semibold">
                                Sponsored
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate max-w-xs">{tool.website_url}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                          {categories.find(c => c.id === tool.category_id)?.name_en || tool.category_id}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium">
                            {tool.pricing_type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleToggleToolFlag(tool, 'active')}
                            className={`p-1 rounded text-xs font-semibold ${
                              tool.active ? 'text-emerald-500' : 'text-slate-400'
                            }`}
                          >
                            {tool.active ? 'Yes' : 'Hidden'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleToggleToolFlag(tool, 'featured')}
                            className={`p-1 rounded ${
                              tool.featured ? 'text-cyan-500 font-bold' : 'text-slate-300 dark:text-slate-700'
                            }`}
                          >
                            ★
                          </button>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleToggleToolFlag(tool, 'popular')}
                            className={`p-1 rounded ${
                              tool.popular ? 'text-rose-500 font-bold' : 'text-slate-300 dark:text-slate-700'
                            }`}
                          >
                            🔥
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => setEditingTool(tool)}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-cyan-500"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTool(tool.id, tool.name_en)}
                            className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 hover:bg-rose-100"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ADD / EDIT AI TOOL FORM */}
        {adminActiveTab === 'add-tool' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-black">
                  {editingTool ? t('editAiTool') : t('addNewAiTool')}
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  {language === 'bn' ? 'ইংরেজি ও বাংলা উভয় ভাষার তথ্যসহ AI টুল সংরক্ষণ করুন।' : 'Complete bilingual metadata, official URLs, and pricing specifications.'}
                </p>
              </div>

              {editingTool && (
                <button
                  onClick={() => {
                    setEditingTool(null);
                    setAdminActiveTab('tools');
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold"
                >
                  {t('cancel')}
                </button>
              )}
            </div>

            <form onSubmit={handleToolSubmit} className="space-y-6">
              {/* Basic Details Box */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  1. Basic Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      {t('toolNameEn')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={toolForm.name_en}
                      onChange={e => setToolForm({ ...toolForm, name_en: e.target.value })}
                      placeholder="ChatGPT"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      {t('toolNameBn')}
                    </label>
                    <input
                      type="text"
                      value={toolForm.name_bn}
                      onChange={e => setToolForm({ ...toolForm, name_bn: e.target.value })}
                      placeholder="চ্যাটজিপিটি"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      {t('websiteUrl')} * (HTTP or HTTPS)
                    </label>
                    <input
                      type="url"
                      required
                      value={toolForm.website_url}
                      onChange={e => setToolForm({ ...toolForm, website_url: e.target.value })}
                      placeholder="https://chatgpt.com"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      {t('categorySelect')} *
                    </label>
                    <select
                      value={toolForm.category_id}
                      onChange={e => setToolForm({ ...toolForm, category_id: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-cyan-500"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name_en} ({cat.name_bn})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Logo URL with Live Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold mb-1">
                      {t('logoUrl')} (Image URL)
                    </label>
                    <input
                      type="url"
                      value={toolForm.logo_url}
                      onChange={e => setToolForm({ ...toolForm, logo_url: e.target.value })}
                      placeholder="https://example.com/logo.png"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      {t('previewLogo')}
                    </label>
                    <div className="w-12 h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden p-1.5">
                      {toolForm.logo_url ? (
                        <img
                          src={toolForm.logo_url}
                          alt="preview"
                          className="w-full h-full object-contain"
                          onError={e => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="text-xs text-slate-400">None</span>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    {t('tagsComma')}
                  </label>
                  <input
                    type="text"
                    value={toolForm.tags}
                    onChange={e => setToolForm({ ...toolForm, tags: e.target.value })}
                    placeholder="chat, coding, writing, openai"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Descriptions Box */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  2. Bilingual Descriptions & Features
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      {t('shortDescEn')} *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={toolForm.short_description_en}
                      onChange={e => setToolForm({ ...toolForm, short_description_en: e.target.value })}
                      placeholder="An AI assistant for writing, learning, brainstorming, coding..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      {t('shortDescBn')}
                    </label>
                    <textarea
                      rows={2}
                      value={toolForm.short_description_bn}
                      onChange={e => setToolForm({ ...toolForm, short_description_bn: e.target.value })}
                      placeholder="লেখালেখি, কোডিং এবং দৈনন্দিন কাজের জন্য একটি নির্ভরযোগ্য AI সহকারী..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      {t('fullDescEn')}
                    </label>
                    <textarea
                      rows={4}
                      value={toolForm.full_description_en}
                      onChange={e => setToolForm({ ...toolForm, full_description_en: e.target.value })}
                      placeholder="Detailed overview for the tool details page..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      {t('fullDescBn')}
                    </label>
                    <textarea
                      rows={4}
                      value={toolForm.full_description_bn}
                      onChange={e => setToolForm({ ...toolForm, full_description_bn: e.target.value })}
                      placeholder="বিস্তারিত বিবরণ (বাংলায়)..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Key Features (One per line) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      Key Features - English (one per line)
                    </label>
                    <textarea
                      rows={3}
                      value={toolForm.features_en}
                      onChange={e => setToolForm({ ...toolForm, features_en: e.target.value })}
                      placeholder="Conversational reasoning&#10;Code generation&#10;File analysis"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      Key Features - Bengali (one per line)
                    </label>
                    <textarea
                      rows={3}
                      value={toolForm.features_bn}
                      onChange={e => setToolForm({ ...toolForm, features_bn: e.target.value })}
                      placeholder="কোড জেনারেশন&#10;স্বাভাবিক ভাষায় উত্তর প্রদান"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Settings & Flags Box */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  3. Pricing & Placement
                </h3>

                <div className="max-w-xs">
                  <label className="block text-xs font-semibold mb-1">
                    {t('pricingTypeLabel')}
                  </label>
                  <select
                    value={toolForm.pricing_type}
                    onChange={e => setToolForm({ ...toolForm, pricing_type: e.target.value as PricingType })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Free">Free</option>
                    <option value="Freemium">Freemium</option>
                    <option value="Paid">Paid</option>
                    <option value="Free Trial">Free Trial</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                    <input
                      type="checkbox"
                      checked={toolForm.featured}
                      onChange={e => setToolForm({ ...toolForm, featured: e.target.checked })}
                      className="rounded text-cyan-600 focus:ring-cyan-500 w-4 h-4"
                    />
                    <span>{t('featuredCheckbox')}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                    <input
                      type="checkbox"
                      checked={toolForm.popular}
                      onChange={e => setToolForm({ ...toolForm, popular: e.target.checked })}
                      className="rounded text-cyan-600 focus:ring-cyan-500 w-4 h-4"
                    />
                    <span>{t('popularCheckbox')}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                    <input
                      type="checkbox"
                      checked={toolForm.active}
                      onChange={e => setToolForm({ ...toolForm, active: e.target.checked })}
                      className="rounded text-cyan-600 focus:ring-cyan-500 w-4 h-4"
                    />
                    <span>{t('activeCheckbox')}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                    <input
                      type="checkbox"
                      checked={toolForm.sponsored}
                      onChange={e => setToolForm({ ...toolForm, sponsored: e.target.checked })}
                      className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                    />
                    <span>{t('sponsoredCheckbox')}</span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-md transition-all disabled:opacity-50"
                >
                  {actionLoading ? t('saving') : t('saveChanges')}
                </button>

                <button
                  type="button"
                  onClick={() => setAdminActiveTab('tools')}
                  className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold"
                >
                  {t('cancel')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: CATEGORY MANAGEMENT */}
        {adminActiveTab === 'categories' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-black">{t('manageCategories')}</h1>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'bn' ? 'ক্যাটাগরি তৈরি, রিনেম ও সাজানোর ব্যবস্থা' : 'Add, rename, reorder, and manage directory categories.'}
              </p>
            </div>

            {/* Category Form */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold mb-4">
                {editingCategory ? t('editCategory') : t('addNewCategory')}
              </h3>

              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      {t('categoryNameEn')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={catForm.name_en}
                      onChange={e => setCatForm({ ...catForm, name_en: e.target.value })}
                      placeholder="e.g. Robotics AI"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      {t('categoryNameBn')}
                    </label>
                    <input
                      type="text"
                      value={catForm.name_bn}
                      onChange={e => setCatForm({ ...catForm, name_bn: e.target.value })}
                      placeholder="রোবটিক্স AI"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      {t('categoryDescEn')}
                    </label>
                    <input
                      type="text"
                      value={catForm.description_en}
                      onChange={e => setCatForm({ ...catForm, description_en: e.target.value })}
                      placeholder="Short summary for this category..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      {t('categoryDescBn')}
                    </label>
                    <input
                      type="text"
                      value={catForm.description_bn}
                      onChange={e => setCatForm({ ...catForm, description_bn: e.target.value })}
                      placeholder="সংক্ষিপ্ত বিবরণ..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      {t('sortOrder')}
                    </label>
                    <input
                      type="number"
                      value={catForm.sort_order}
                      onChange={e => setCatForm({ ...catForm, sort_order: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                      <input
                        type="checkbox"
                        checked={catForm.active}
                        onChange={e => setCatForm({ ...catForm, active: e.target.checked })}
                        className="rounded text-cyan-600 focus:ring-cyan-500 w-4 h-4"
                      />
                      <span>Active</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-sm transition-all"
                  >
                    {editingCategory ? t('saveChanges') : t('addNewCategory')}
                  </button>

                  {editingCategory && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCategory(null);
                        setCatForm({
                          name_en: '',
                          name_bn: '',
                          description_en: '',
                          description_bn: '',
                          icon: 'Folder',
                          sort_order: categories.length + 1,
                          active: true,
                        });
                      }}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-semibold"
                    >
                      {t('cancel')}
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Existing Categories List */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
              {categories.map(cat => {
                const toolsInCat = tools.filter(t => t.category_id === cat.id).length;
                return (
                  <div key={cat.id} className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-bold flex items-center gap-2">
                        <span>{cat.name_en}</span>
                        {cat.name_bn && <span className="text-slate-400">({cat.name_bn})</span>}
                        {!cat.active && (
                          <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-500 px-1.5 py-0.2 rounded">
                            Inactive
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {toolsInCat} tools assigned · Order: {cat.sort_order}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingCategory(cat);
                          setCatForm({
                            name_en: cat.name_en,
                            name_bn: cat.name_bn || '',
                            description_en: cat.description_en || '',
                            description_bn: cat.description_bn || '',
                            icon: cat.icon || 'Folder',
                            sort_order: cat.sort_order || 0,
                            active: cat.active,
                          });
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-cyan-500"
                        title="Edit Category"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.name_en)}
                        className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 hover:bg-rose-100"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: WEBSITE SETTINGS & ADMIN SECURITY */}
        {adminActiveTab === 'settings' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-xl sm:text-2xl font-black">{t('manageSettings')}</h1>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'bn' ? 'ওয়েবসাইট নাম, সোশ্যাল লিংক, বিজ্ঞাপন ও পলিসি কনফিগারেশন' : 'Manage site brand, ad placeholders, legal disclosures, and security.'}
              </p>
            </div>

            {/* General Site Branding */}
            <form onSubmit={handleSettingsSubmit} className="space-y-6">
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-sm font-bold border-b border-slate-100 dark:border-slate-800 pb-2">
                  Branding & Contact Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Website Name</label>
                    <input
                      type="text"
                      value={settingsForm.site_name}
                      onChange={e => setSettingsForm({ ...settingsForm, site_name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={settingsForm.contact_email}
                      onChange={e => setSettingsForm({ ...settingsForm, contact_email: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Tagline (English)</label>
                    <input
                      type="text"
                      value={settingsForm.tagline_en}
                      onChange={e => setSettingsForm({ ...settingsForm, tagline_en: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Tagline (Bengali / বাংলা)</label>
                    <input
                      type="text"
                      value={settingsForm.tagline_bn}
                      onChange={e => setSettingsForm({ ...settingsForm, tagline_bn: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Social Links */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Twitter / X URL</label>
                    <input
                      type="url"
                      value={settingsForm.twitter}
                      onChange={e => setSettingsForm({ ...settingsForm, twitter: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">GitHub URL</label>
                    <input
                      type="url"
                      value={settingsForm.github}
                      onChange={e => setSettingsForm({ ...settingsForm, github: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">LinkedIn URL</label>
                    <input
                      type="url"
                      value={settingsForm.linkedin}
                      onChange={e => setSettingsForm({ ...settingsForm, linkedin: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Monetization Switch */}
                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                    <input
                      type="checkbox"
                      checked={settingsForm.ad_placeholders_enabled}
                      onChange={e => setSettingsForm({ ...settingsForm, ad_placeholders_enabled: e.target.checked })}
                      className="rounded text-cyan-600 focus:ring-cyan-500 w-4 h-4"
                    />
                    <span>Enable Monetization & Advertisement Placeholders</span>
                  </label>
                </div>
              </div>

              {/* Editable Legal Pages Section */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-sm font-bold border-b border-slate-100 dark:border-slate-800 pb-2">
                  Legal Documents (Privacy, Terms, Disclaimer)
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Privacy Policy (English)</label>
                    <textarea
                      rows={3}
                      value={settingsForm.privacy_policy_en}
                      onChange={e => setSettingsForm({ ...settingsForm, privacy_policy_en: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Terms of Service (English)</label>
                    <textarea
                      rows={3}
                      value={settingsForm.terms_of_service_en}
                      onChange={e => setSettingsForm({ ...settingsForm, terms_of_service_en: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Disclaimer (English)</label>
                    <textarea
                      rows={3}
                      value={settingsForm.disclaimer_en}
                      onChange={e => setSettingsForm({ ...settingsForm, disclaimer_en: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-md transition-all"
              >
                {t('saveChanges')}
              </button>
            </form>

            {/* Admin Password Change Box */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-sm font-bold border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-500" />
                <span>Change Admin Password</span>
              </h3>

              <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-semibold mb-1">New Password (min 8 chars)</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.newPassword}
                    onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.confirmPassword}
                    onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-950 font-semibold text-xs transition-all"
                >
                  {t('changePassword')}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
