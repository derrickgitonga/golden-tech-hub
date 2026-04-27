import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set. Add it in your Vercel project settings.');
}

export const sql = neon(process.env.DATABASE_URL);
