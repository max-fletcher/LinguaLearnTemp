const allowedOrigins = [
  'http://ec2-16-171-142-79.eu-north-1.compute.amazonaws.com',
  'https://homerun.ontiktech.xyz',
  'https://admin.homerun.estate',
  'https://homerun.estate',
  'http://127.0.0.1:5500',
  'http://localhost:3500',
  'http://127.0.0.1:3000',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://localhost:5173',
  'http://ec2-16-171-142-79.eu-north-1.compute.amazonaws.com',
];

export const corsOptions = {
  origin: (origin: any, callback: any) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};
