# Data Viewer

A modern, beautiful data viewer application built with Next.js 15, shadcn/ui, and TypeScript. This application connects to a Markdown CMS backend API to browse and view markdown files organized in groups.

## Features

- 🔐 **JWT Authentication** - Secure login system
- 📚 **Group Management** - Browse markdown file collections organized by groups
- 📁 **Hierarchical File Structure** - Navigate through folders with accordion UI
- 📝 **Rich Markdown Rendering** - Full markdown support with syntax highlighting
- 🎨 **Modern UI** - Built with shadcn/ui components and Tailwind CSS
- 🌓 **Dark Mode Support** - Automatic theme detection
- 🖼️ **Image Support** - Display images from the CMS with automatic path resolution
- 📱 **Responsive Design** - Works on all screen sizes

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: shadcn/ui
- **Styling**: Tailwind CSS v4
- **Markdown Parsing**: react-markdown with remark-gfm, rehype-raw, rehype-sanitize
- **Icons**: Lucide React
- **Language**: TypeScript
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js 18+ (v20+ recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd data-viewer
```

2. Install dependencies:
```bash
npm install
```

3. Configure the backend API URL (if different from default):
   - Open `src/lib/api.ts`
   - Update the `API_BASE_URL` constant

### Running the Application

Development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Usage

### Login

1. Navigate to the application
2. Enter your credentials:
   - Username: Your CMS username
   - Password: Your CMS password
3. Click "Login"

### Browse Groups

After logging in, you'll see a table of all available markdown groups:
- Use the search bar to filter groups by name
- Click on any group row to view its contents

### Navigate Files

In the group view:
- Click on any file to view its markdown content
- Use the accordion to expand/collapse folders
- Click "Back to Groups" to return to the main view

### View Markdown

In the markdown viewer:
- Scroll through the formatted content
- Images and links are automatically resolved
- Click "Back to Files" to return to the file list

## Project Structure

```
data-viewer/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with AuthProvider
│   │   ├── page.tsx             # Main page with routing logic
│   │   └── globals.css          # Global styles
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── LoginForm.tsx        # Authentication form
│   │   ├── GroupsTable.tsx      # Group listing table
│   │   ├── GroupDetail.tsx      # File browser with accordion
│   │   └── MarkdownViewer.tsx   # Markdown renderer
│   ├── contexts/
│   │   └── AuthContext.tsx      # Authentication context
│   └── lib/
│       ├── api.ts               # API client and types
│       └── utils.ts             # Utility functions
├── public/                      # Static assets
└── package.json
```

## API Integration

The application connects to a Markdown CMS backend with the following endpoints:

- `POST /auth/login` - Authenticate and get JWT token
- `GET /api/groups` - List all available groups
- `GET /api/group/:groupName` - Get folder structure for a group
- `GET /api/file/:groupName/:filePath` - Get specific markdown file content
- `GET /api/assets/:filename` - Get image/asset files

## Configuration

### API Client

The API client is located in `src/lib/api.ts` and handles:
- JWT token management
- Automatic token injection in requests
- Local storage persistence
- Type-safe API calls

### Authentication

Authentication is managed through React Context (`src/contexts/AuthContext.tsx`):
- Automatic token verification on mount
- Persistent login state
- Logout functionality

## Customization

### Styling

- Modify `src/app/globals.css` for global styles
- Update color scheme in the CSS variables
- Customize shadcn/ui components in `src/components/ui/`

### Markdown Rendering

Customize markdown rendering in `src/components/MarkdownViewer.tsx`:
- Add custom components for specific markdown elements
- Modify image handling
- Add syntax highlighting for code blocks

## Troubleshooting

### Login Issues

- Verify the API URL is correct
- Check your credentials
- Ensure the backend API is running

### Images Not Loading

- Verify the asset URL in `src/lib/api.ts`
- Check that the backend API is serving assets correctly
- Ensure JWT token is being included in asset requests

### Build Errors

- Clear `.next` directory: `rm -rf .next`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
