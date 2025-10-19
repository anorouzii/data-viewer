const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  expiresIn: string;
}

export interface Group {
  name: string;
  slug: string;
}

export interface FileItem {
  name: string;
  path: string;
  content?: string;
}

export interface FolderItem {
  name: string;
  path: string;
  files: FileItem[];
  folders: FolderItem[];
}

export interface GroupStructure {
  group: string;
  files: FileItem[];
  folders: FolderItem[];
}

export interface FileContent {
  group: string;
  file: string;
  name: string;
  content: string;
}

export class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  getToken() {
    return this.token;
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    this.setToken(data.token);
    return data;
  }

  async verifyToken(): Promise<boolean> {
    if (!this.token) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async getGroups(): Promise<{ groups: Group[] }> {
    const response = await fetch(`${API_BASE_URL}/api/groups`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch groups');
    }

    return response.json();
  }

  async getGroupStructure(groupName: string): Promise<GroupStructure> {
    const response = await fetch(`${API_BASE_URL}/api/group/${encodeURIComponent(groupName)}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch group structure');
    }

    return response.json();
  }

  async getFile(groupName: string, filePath: string): Promise<FileContent> {
    const response = await fetch(
      `${API_BASE_URL}/api/file/${encodeURIComponent(groupName)}/${encodeURIComponent(filePath)}`,
      {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch file');
    }

    return response.json();
  }

  getAssetUrl(filename: string): string {
    return `${API_BASE_URL}/api/assets/${encodeURIComponent(filename)}`;
  }
}

export const apiClient = new ApiClient();

