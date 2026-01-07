# Golden Tech Hub

A modern web application for buying and selling refurbished electronics, built with React, TypeScript, and Supabase.

## Live Demo

Visit the live application at [golden-tech-hub.vercel.app](https://golden-tech-hub.vercel.app)

## Overview

Golden Tech Hub is a marketplace platform that connects buyers and sellers of refurbished electronic devices. The application provides a seamless experience for browsing products, managing listings, and facilitating transactions in the secondary electronics market.

## Features

- Browse and search refurbished electronic devices
- User authentication and account management
- Product listing and management
- Responsive design for mobile and desktop
- Real-time database updates
- Secure payment processing integration

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Backend**: Supabase (PostgreSQL database, Authentication, Storage)
- **Deployment**: Vercel
- **Package Manager**: npm/bun

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or bun package manager
- A Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/derrickgitonga/golden-tech-hub.git
cd golden-tech-hub
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings under API.

### Development

Start the development server:
```bash
npm run dev
# or
bun run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

Create a production build:
```bash
npm run build
# or
bun run build
```

Preview the production build:
```bash
npm run preview
# or
bun run preview
```

## Project Structure

```
golden-tech-hub/
├── api/                 # API routes and serverless functions
├── public/              # Static assets
├── src/                 # Source code
│   ├── components/      # React components
│   ├── pages/           # Page components
│   ├── lib/             # Utility functions and configurations
│   └── types/           # TypeScript type definitions
├── supabase/            # Supabase migrations and configurations
└── server.js            # Server configuration
```

## Database Setup

This project uses Supabase for backend services. To set up your database:

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the migrations in the `supabase` directory
3. Configure your tables and authentication settings as needed

## Deployment

The application is configured for deployment on Vercel:

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add your environment variables in the Vercel project settings
4. Deploy

For custom domains, configure them in your Vercel project settings.

## Environment Variables

Required environment variables for production deployment:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

Make sure to add these to your deployment platform (Vercel, Netlify, etc.).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
