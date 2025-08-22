import type { NextApiRequest, NextApiResponse } from 'next';

// Simple WebSocket status endpoint for Vercel
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.json({
      success: true,
      message: 'WebSocket endpoint ready',
      status: 'active',
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
