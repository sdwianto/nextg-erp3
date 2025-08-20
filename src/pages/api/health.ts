import { type NextApiRequest, type NextApiResponse } from 'next';
import { prisma } from '@/server/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check database connection
    let dbStatus = 'unknown';
    let dbLatency = 0;
    
    try {
      const startTime = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      dbLatency = Date.now() - startTime;
      dbStatus = 'connected';
    } catch (error) {
      dbStatus = 'disconnected';
      console.error('Database health check failed:', error);
    }

    // System health status
    const healthStatus = {
      status: dbStatus === 'connected' ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: dbStatus,
          latency: dbLatency,
          message: dbStatus === 'connected' ? 'Database is operational' : 'Database connection failed'
        },
        api: {
          status: 'operational',
          message: 'API is running'
        }
      },
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };

    const statusCode = healthStatus.status === 'healthy' ? 200 : 503;
    
    res.status(statusCode).json(healthStatus);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      timestamp: new Date().toISOString()
    });
  }
}
