import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.json({
    environment: process.env.NODE_ENV,
    nodeEnv: process.env.NODE_ENV,
    buildMode: process.env.BUILD_MODE,
    skipEnvValidation: process.env.SKIP_ENV_VALIDATION,
    databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT_SET',
    directUrl: process.env.DIRECT_URL ? 'SET' : 'NOT_SET',
    timestamp: new Date().toISOString(),
    headers: {
      host: req.headers.host,
      origin: req.headers.origin,
      referer: req.headers.referer,
      'user-agent': req.headers['user-agent']
    }
  });
}
