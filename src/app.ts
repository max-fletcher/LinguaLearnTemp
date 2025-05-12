
import cors from 'cors';
import express from 'express';
import expressListRoutes from 'express-list-routes';
import helmet from 'helmet';
import path from 'path';
import { corsOptions } from './config/cors.config';
import { globalLimiterOptions } from './config/globalRateLimiter.config';
import { JwtMiddleware } from './middleware/jwt.middleware';
import { adminUserRouter } from './routes/admin/user.routes';
import { appAuthRouter } from './routes/app/auth.routes';
import { testRouter } from './routes/test.routes';

// const numCPUs = os.cpus().length

const server = () => {
  try {
    const app = express();
    // const server = http.createServer(app);
    const PORT = process.env.PORT || 5000;

    // parse application/x-www-form-urlencoded
    app.use(express.urlencoded({ extended: true }));

    // parse application/json
    app.use(express.json());

    // CORS protection
    app.use(cors(corsOptions));

    // For security purposes
    app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

    // serve static files
    app.use('/', express.static(path.join(__dirname, '/public')));

    //rate limiter
    app.use(globalLimiterOptions);
    app.set('trust proxy', 1)

    const jwtMiddleware = new JwtMiddleware();
    // ROUTES
    // test router. for development purposes only
    app.use('/api/v1/test', testRouter);
    // admin routes
    app.use('/api/v1/admin', jwtMiddleware.verifyToken, adminUserRouter);
  // // app routes
  //   app.use('/api/v1/app/auth', appAuthRouter);

    app.all('*', (req, res) => {
      res.status(404);
      if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
      } else if (req.accepts('application/json')) {
        res.json({ error: 'Route Not Found' });
      } else {
        res.type('txt').send('Route Not Found.');
      }
    });

    // List down all routes in the terminal on startup
    expressListRoutes(app, { prefix: 'http://localhost:5000/' });

    app.listen(PORT, () => {
      console.log(`Worker ${process.pid} started on port ${PORT}`);
    });
  } catch (error) {
    console.log('Error', error);
  }
  // }
};

server();
