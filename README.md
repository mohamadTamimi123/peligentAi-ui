# Agent UI - Modern Next.js Application

A modern, responsive web application built with Next.js 15, React 19, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Next.js 15** - Latest version with App Router
- **React 19** - Latest React features and performance improvements
- **TypeScript** - Full type safety and better developer experience
- **Tailwind CSS 4** - Modern utility-first CSS framework
- **Responsive Design** - Mobile-first approach
- **Component Library** - Reusable UI components
- **Modern Icons** - Lucide React icons
- **Performance Optimized** - Built-in optimizations and best practices

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **UI Components**: Custom component library
- **Fonts**: Geist Sans & Geist Mono
- **Package Manager**: npm

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with header/footer
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/             # Reusable components
│   ├── ui/                # Basic UI components
│   │   ├── Button.tsx     # Button component
│   │   └── Card.tsx       # Card component
│   └── layout/            # Layout components
│       ├── Header.tsx     # Navigation header
│       └── Footer.tsx     # Site footer
├── lib/                   # Utility functions
│   └── utils.ts           # Common utilities
├── types/                 # TypeScript type definitions
└── hooks/                 # Custom React hooks
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd agent-ui
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Component Usage

### Button Component

```tsx
import { Button } from '@/components/ui/Button'

// Different variants
<Button variant="primary">Primary Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

### Card Component

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

## 🌟 Key Features

### Responsive Design
- Mobile-first approach
- Responsive grid layouts
- Adaptive typography
- Touch-friendly interactions

### Performance
- Next.js Image optimization
- Automatic code splitting
- Static generation where possible
- Optimized bundle sizes

### Developer Experience
- TypeScript for type safety
- ESLint configuration
- Prettier formatting
- Hot reloading
- Component documentation

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Other Platforms
- Netlify
- AWS Amplify
- Docker deployment
- Custom server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you have any questions or need help, please open an issue on GitHub.

---

Built with ❤️ using Next.js and modern web technologies.
