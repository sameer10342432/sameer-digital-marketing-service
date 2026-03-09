import type { Express, Request, Response } from 'express';
import { createServer, type Server } from 'node:http';
import { storage } from './storage';
import { z } from 'zod';

function getToken(req: Request): string | null {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    return auth.slice(7);
  }
  return null;
}

function requireAdmin(req: Request, res: Response): boolean {
  const token = getToken(req);
  if (!token || !storage.isValidToken(token)) {
    res.status(401).json({ message: 'Unauthorized' });
    return false;
  }
  return true;
}

const inquirySchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().min(1).max(30),
  service: z.string().min(1).max(100),
  message: z.string().min(1).max(2000),
});

const credentialsSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(4).max(100),
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }
    const token = storage.validateAdmin(username, password);
    if (!token) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    return res.json({ token });
  });

  app.put('/api/admin/credentials', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const result = credentialsSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: 'Invalid credentials format' });
    }
    storage.updateCredentials(result.data.username, result.data.password);
    const newToken = storage.getCurrentToken();
    return res.json({ token: newToken, message: 'Credentials updated' });
  });

  app.get('/api/admin/inquiries', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    return res.json(storage.getInquiries());
  });

  app.delete('/api/admin/inquiries/:id', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const deleted = storage.deleteInquiry(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    return res.json({ message: 'Deleted' });
  });

  app.patch('/api/admin/inquiries/:id/read', (req: Request, res: Response) => {
    if (!requireAdmin(req, res)) return;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    storage.markAsRead(id);
    return res.json({ message: 'Marked as read' });
  });

  app.post('/api/inquiries', (req: Request, res: Response) => {
    const result = inquirySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: 'Invalid form data', errors: result.error.errors });
    }
    const inquiry = storage.addInquiry(result.data);
    return res.status(201).json(inquiry);
  });

  const httpServer = createServer(app);
  return httpServer;
}
