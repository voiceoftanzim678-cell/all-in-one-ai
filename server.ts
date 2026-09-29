import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { db, isValidUrl } from './server/db.js';
import { AiTool, Category, PricingType } from './src/types.js';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name?: string;
  };
}

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Token extraction helper
function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  return null;
}

// Authentication middleware
function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (token) {
    const user = db.getUserByToken(token);
    if (user) {
      req.user = user;
    }
  }
  next();
}

// Admin authorization guard
function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) {
    res.status(401).json({ error: 'Authentication required. Please log in.' });
    return;
  }

  const user = db.getUserByToken(token);
  if (!user || user.role !== 'admin') {
    res.status(403).json({ error: 'Access denied: Administrator privileges required.' });
    return;
  }

  req.user = user;
  next();
}

app.use(authenticate);

// ==========================================
// API ROUTES
// ==========================================

// --- Auth Routes ---
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  const user = db.verifyCredentials(email.trim(), password);
  if (!user) {
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  const token = db.createSession(user.id);
  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
  });
});

app.get('/api/auth/me', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated.' });
    return;
  }
  res.json({ user: req.user });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const token = extractToken(req);
  if (token) {
    db.destroySession(token);
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

app.post('/api/auth/change-password', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 8) {
    res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    return;
  }

  const success = db.updateAdminPassword(req.user!.id, newPassword);
  if (success) {
    res.json({ success: true, message: 'Password updated successfully.' });
  } else {
    res.status(500).json({ error: 'Failed to update password.' });
  }
});

// --- Admin Stats ---
app.get('/api/admin/stats', requireAdmin, (req: Request, res: Response) => {
  const stats = db.getStats();
  res.json(stats);
});

// --- AI Tools Routes ---
app.get('/api/tools', (req: AuthenticatedRequest, res: Response) => {
  const isAdmin = req.user?.role === 'admin';
  const includeInactive = isAdmin && req.query.includeInactive === 'true';

  let tools = db.getTools(!includeInactive);

  // Filter by category
  const categoryId = req.query.category as string;
  if (categoryId && categoryId !== 'all') {
    tools = tools.filter(t => t.category_id === categoryId);
  }

  // Filter by pricing
  const pricing = req.query.pricing as string;
  if (pricing && pricing !== 'all') {
    tools = tools.filter(t => t.pricing_type.toLowerCase() === pricing.toLowerCase());
  }

  // Filter by status (popular / featured / sponsored)
  const filter = req.query.filter as string;
  if (filter === 'popular') {
    tools = tools.filter(t => t.popular);
  } else if (filter === 'featured') {
    tools = tools.filter(t => t.featured);
  } else if (filter === 'sponsored') {
    tools = tools.filter(t => t.sponsored);
  }

  // Real-time search across English and Bengali fields, tags, and category name
  const query = (req.query.search as string || '').trim().toLowerCase();
  if (query) {
    const categories = db.getCategories(false);
    const catMap = new Map(categories.map(c => [c.id, `${c.name_en} ${c.name_bn}`.toLowerCase()]));

    tools = tools.filter(t => {
      const catText = catMap.get(t.category_id) || '';
      return (
        t.name_en.toLowerCase().includes(query) ||
        (t.name_bn && t.name_bn.toLowerCase().includes(query)) ||
        t.short_description_en.toLowerCase().includes(query) ||
        (t.short_description_bn && t.short_description_bn.toLowerCase().includes(query)) ||
        t.full_description_en.toLowerCase().includes(query) ||
        (t.full_description_bn && t.full_description_bn.toLowerCase().includes(query)) ||
        t.tags.some(tag => tag.toLowerCase().includes(query)) ||
        catText.includes(query)
      );
    });
  }

  // Sort
  const sort = req.query.sort as string;
  if (sort === 'alphabetical') {
    tools.sort((a, b) => a.name_en.localeCompare(b.name_en));
  } else if (sort === 'popular') {
    tools.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
  } else {
    // default: newest
    tools.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  res.json(tools);
});

app.get('/api/tools/:id', (req: AuthenticatedRequest, res: Response) => {
  const isAdmin = req.user?.role === 'admin';
  const tool = db.getToolById(req.params.id, !isAdmin);
  if (!tool) {
    res.status(404).json({ error: 'AI Tool not found.' });
    return;
  }
  res.json(tool);
});

// Admin Add AI Tool
app.post('/api/tools', requireAdmin, (req: Request, res: Response) => {
  const body = req.body;

  // Validation
  if (!body.name_en || !body.name_en.trim()) {
    res.status(400).json({ error: 'AI Name (English) is required.' });
    return;
  }

  if (!body.website_url || !isValidUrl(body.website_url)) {
    res.status(400).json({ error: 'A valid official website URL starting with http:// or https:// is required.' });
    return;
  }

  if (body.logo_url && !isValidUrl(body.logo_url)) {
    res.status(400).json({ error: 'Logo URL must be a valid http:// or https:// URL.' });
    return;
  }

  if (!body.category_id) {
    res.status(400).json({ error: 'Category is required.' });
    return;
  }

  if (!body.short_description_en || !body.short_description_en.trim()) {
    res.status(400).json({ error: 'Short description (English) is required.' });
    return;
  }

  const validPricing: PricingType[] = ['Free', 'Freemium', 'Paid', 'Free Trial', 'Unknown'];
  const pricing: PricingType = validPricing.includes(body.pricing_type) ? body.pricing_type : 'Freemium';

  const tags = Array.isArray(body.tags)
    ? body.tags.map((t: string) => String(t).trim().toLowerCase()).filter(Boolean)
    : typeof body.tags === 'string'
    ? body.tags.split(',').map((t: string) => t.trim().toLowerCase()).filter(Boolean)
    : [];

  const features_en = Array.isArray(body.features_en)
    ? body.features_en.filter(Boolean)
    : typeof body.features_en === 'string'
    ? body.features_en.split('\n').map((f: string) => f.trim()).filter(Boolean)
    : [];

  const features_bn = Array.isArray(body.features_bn)
    ? body.features_bn.filter(Boolean)
    : typeof body.features_bn === 'string'
    ? body.features_bn.split('\n').map((f: string) => f.trim()).filter(Boolean)
    : [];

  const newTool = db.addTool({
    name_en: body.name_en.trim(),
    name_bn: (body.name_bn || '').trim(),
    logo_url: (body.logo_url || '').trim(),
    website_url: body.website_url.trim(),
    category_id: body.category_id,
    short_description_en: body.short_description_en.trim(),
    short_description_bn: (body.short_description_bn || '').trim(),
    full_description_en: (body.full_description_en || body.short_description_en).trim(),
    full_description_bn: (body.full_description_bn || body.short_description_bn || '').trim(),
    tags,
    features_en,
    features_bn,
    languages: Array.isArray(body.languages) ? body.languages : ['Multilingual', 'English'],
    featured: Boolean(body.featured),
    popular: Boolean(body.popular),
    active: body.active !== undefined ? Boolean(body.active) : true,
    sponsored: Boolean(body.sponsored),
    pricing_type: pricing,
  });

  res.status(201).json(newTool);
});

// Admin Edit AI Tool
app.put('/api/tools/:id', requireAdmin, (req: Request, res: Response) => {
  const body = req.body;

  if (body.website_url && !isValidUrl(body.website_url)) {
    res.status(400).json({ error: 'A valid official website URL starting with http:// or https:// is required.' });
    return;
  }

  if (body.logo_url && !isValidUrl(body.logo_url)) {
    res.status(400).json({ error: 'Logo URL must be a valid http:// or https:// URL.' });
    return;
  }

  const updates: Partial<AiTool> = {};
  if (body.name_en !== undefined) updates.name_en = body.name_en.trim();
  if (body.name_bn !== undefined) updates.name_bn = body.name_bn.trim();
  if (body.logo_url !== undefined) updates.logo_url = body.logo_url.trim();
  if (body.website_url !== undefined) updates.website_url = body.website_url.trim();
  if (body.category_id !== undefined) updates.category_id = body.category_id;
  if (body.short_description_en !== undefined) updates.short_description_en = body.short_description_en.trim();
  if (body.short_description_bn !== undefined) updates.short_description_bn = body.short_description_bn.trim();
  if (body.full_description_en !== undefined) updates.full_description_en = body.full_description_en.trim();
  if (body.full_description_bn !== undefined) updates.full_description_bn = body.full_description_bn.trim();
  if (body.featured !== undefined) updates.featured = Boolean(body.featured);
  if (body.popular !== undefined) updates.popular = Boolean(body.popular);
  if (body.active !== undefined) updates.active = Boolean(body.active);
  if (body.sponsored !== undefined) updates.sponsored = Boolean(body.sponsored);
  if (body.pricing_type !== undefined) updates.pricing_type = body.pricing_type;

  if (body.tags !== undefined) {
    updates.tags = Array.isArray(body.tags)
      ? body.tags.map((t: string) => String(t).trim().toLowerCase()).filter(Boolean)
      : typeof body.tags === 'string'
      ? body.tags.split(',').map((t: string) => t.trim().toLowerCase()).filter(Boolean)
      : [];
  }

  if (body.features_en !== undefined) {
    updates.features_en = Array.isArray(body.features_en)
      ? body.features_en.filter(Boolean)
      : typeof body.features_en === 'string'
      ? body.features_en.split('\n').map((f: string) => f.trim()).filter(Boolean)
      : [];
  }

  if (body.features_bn !== undefined) {
    updates.features_bn = Array.isArray(body.features_bn)
      ? body.features_bn.filter(Boolean)
      : typeof body.features_bn === 'string'
      ? body.features_bn.split('\n').map((f: string) => f.trim()).filter(Boolean)
      : [];
  }

  const updated = db.updateTool(req.params.id, updates);
  if (!updated) {
    res.status(404).json({ error: 'AI Tool not found.' });
    return;
  }

  res.json(updated);
});

// Admin Delete AI Tool
app.delete('/api/tools/:id', requireAdmin, (req: Request, res: Response) => {
  const success = db.deleteTool(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'AI Tool not found.' });
    return;
  }
  res.json({ success: true, message: 'Tool deleted successfully.' });
});

// --- Categories Routes ---
app.get('/api/categories', (req: AuthenticatedRequest, res: Response) => {
  const isAdmin = req.user?.role === 'admin';
  const includeInactive = isAdmin && req.query.includeInactive === 'true';
  const categories = db.getCategories(!includeInactive);
  res.json(categories);
});

app.post('/api/categories', requireAdmin, (req: Request, res: Response) => {
  const { name_en, name_bn, description_en, description_bn, icon, active, sort_order } = req.body;
  if (!name_en || !name_en.trim()) {
    res.status(400).json({ error: 'Category English name is required.' });
    return;
  }

  const newCat = db.addCategory({
    name_en: name_en.trim(),
    name_bn: (name_bn || '').trim(),
    description_en: (description_en || '').trim(),
    description_bn: (description_bn || '').trim(),
    icon: (icon || 'Folder').trim(),
    active: active !== undefined ? Boolean(active) : true,
    sort_order: sort_order ? parseInt(sort_order, 10) : 0,
  });

  res.status(201).json(newCat);
});

app.put('/api/categories/:id', requireAdmin, (req: Request, res: Response) => {
  const body = req.body;
  const updates: Partial<Category> = {};

  if (body.name_en !== undefined) updates.name_en = body.name_en.trim();
  if (body.name_bn !== undefined) updates.name_bn = body.name_bn.trim();
  if (body.description_en !== undefined) updates.description_en = body.description_en.trim();
  if (body.description_bn !== undefined) updates.description_bn = body.description_bn.trim();
  if (body.icon !== undefined) updates.icon = body.icon.trim();
  if (body.active !== undefined) updates.active = Boolean(body.active);
  if (body.sort_order !== undefined) updates.sort_order = parseInt(body.sort_order, 10);

  const updated = db.updateCategory(req.params.id, updates);
  if (!updated) {
    res.status(404).json({ error: 'Category not found.' });
    return;
  }

  res.json(updated);
});

app.delete('/api/categories/:id', requireAdmin, (req: Request, res: Response) => {
  // Check if tools belong to this category
  const tools = db.getTools(false);
  const inUse = tools.some(t => t.category_id === req.params.id);
  if (inUse) {
    res.status(400).json({
      error: 'Cannot delete category because it is currently assigned to one or more AI tools. Please reassign the tools first.'
    });
    return;
  }

  const success = db.deleteCategory(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Category not found.' });
    return;
  }

  res.json({ success: true, message: 'Category deleted successfully.' });
});

// --- Settings Routes ---
app.get('/api/settings', (req: Request, res: Response) => {
  const settings = db.getSettings();
  res.json(settings);
});

app.put('/api/settings', requireAdmin, (req: Request, res: Response) => {
  const body = req.body;
  const updated = db.updateSettings(body);
  res.json(updated);
});

// ==========================================
// STATIC FILES & VITE DEV SERVER INTEGRATION
// ==========================================
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ALL IN ONE Server] Running on http://localhost:${PORT} (${isDev ? 'development' : 'production'})`);
  });
}

startServer().catch(err => {
  console.error('[Server Error]', err);
});
