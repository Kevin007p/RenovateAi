# Renovate - Home Improvement Project Management

A modern web application for managing home improvement projects, built with Next.js and Supabase. This app serves two key user groups:

- **Homeowners**: Track and manage your renovation projects, from planning to completion
- **Contractors & Companies**: Access and manage your leads through the Supabase dashboard, streamline client communication, and track project progress

The platform facilitates seamless collaboration between homeowners and contractors, making home improvement projects more efficient and transparent.

## Features

- Project Management: Create and track multiple home improvement projects
- Task Organization: Break down projects into manageable tasks
- Progress Tracking: Monitor the status of each project and task
- Real-time Updates: Powered by Supabase for instant data synchronization
- Modern UI: Built with Next.js and styled with Tailwind CSS
- AI Integration: Powered by GPT-4V for image recognition and intelligent project assistance
- Lead Management: Contractors can view and manage potential clients through Supabase

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Backend**: Supabase for database and authentication
- **AI**: OpenAI GPT-4V for image analysis and project assistance
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Setup

Create a `.env.local` file in the root directory with your Supabase and OpenAI credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

The OpenAI API key is required for:
- Image recognition and analysis of project photos
- AI-powered project assistance and recommendations
- Intelligent task categorization and suggestions

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [OpenAI GPT-4V Documentation](https://platform.openai.com/docs/guides/vision)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
