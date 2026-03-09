import crypto from 'crypto';

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

interface AdminCredentials {
  username: string;
  password: string;
}

const inquiries: Inquiry[] = [];

let adminCredentials: AdminCredentials = {
  username: 'sameerliaqat81@gmail.com',
  password: '####Sameer12345',
};

const SALT = crypto.randomBytes(32).toString('hex');

function generateToken(username: string, password: string): string {
  return crypto
    .createHmac('sha256', SALT)
    .update(`${username}:${password}`)
    .digest('hex');
}

export const storage = {
  addInquiry(data: Omit<Inquiry, 'id' | 'createdAt' | 'isRead'>): Inquiry {
    const inquiry: Inquiry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...data,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    inquiries.unshift(inquiry);
    return inquiry;
  },

  getInquiries(): Inquiry[] {
    return inquiries;
  },

  deleteInquiry(id: string): boolean {
    const idx = inquiries.findIndex((i) => i.id === id);
    if (idx === -1) return false;
    inquiries.splice(idx, 1);
    return true;
  },

  markAsRead(id: string): boolean {
    const inquiry = inquiries.find((i) => i.id === id);
    if (!inquiry) return false;
    inquiry.isRead = true;
    return true;
  },

  validateAdmin(username: string, password: string): string | null {
    if (
      username === adminCredentials.username &&
      password === adminCredentials.password
    ) {
      return generateToken(username, password);
    }
    return null;
  },

  getCurrentToken(): string {
    return generateToken(adminCredentials.username, adminCredentials.password);
  },

  updateCredentials(newUsername: string, newPassword: string): void {
    adminCredentials = { username: newUsername, password: newPassword };
  },

  isValidToken(token: string): boolean {
    return token === this.getCurrentToken();
  },
};
