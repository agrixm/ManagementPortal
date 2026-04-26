const http = require('http');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io');

const { connectDb } = require('./config/db');
const env = require('./config/env');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const projectRoutes = require('./routes/project.routes');
const taskRoutes = require('./routes/task.routes');
const { notFound, errorHandler } = require('./utils/errorHandler');
const { registerChatHandlers } = require('./socket/chatHandler');

const app = express();
const server = http.createServer(app);

// Allow multiple origins (comma-separated). Normalize entries by trimming,
// removing trailing slashes, and lowercasing to avoid mismatches from env formatting.
function normalizeOriginString(s) {
  return String(s || '').trim().replace(/\/$/, '').toLowerCase();
}

const allowedOrigins = (process.env.ALLOWED_ORIGINS || env.CLIENT_URL)
  .split(',')
  .map(normalizeOriginString)
  .filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      // allow requests with no origin (mobile apps, curl)
      if (!origin) return callback(null, true);
      const normalized = normalizeOriginString(origin);
      if (allowedOrigins.includes(normalized)) return callback(null, true);
      console.warn('CORS origin denied:', origin, 'normalized->', normalized);
      return callback(new Error('CORS origin denied'));
    },
    credentials: true
  }
});

registerChatHandlers(io);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const normalized = normalizeOriginString(origin);
      if (allowedOrigins.includes(normalized)) return callback(null, true);
      console.warn('CORS origin denied:', origin, 'normalized->', normalized);
      return callback(new Error('CORS origin denied'));
    },
    credentials: true
  })
);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'blockx-server' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

app.use(notFound);
app.use(errorHandler);

async function start() {
  await connectDb(env.MONGO_URI);
  // log configured origins for easier debugging in production
  console.log('Configured CLIENT_URL:', env.CLIENT_URL);
  console.log('Configured ALLOWED_ORIGINS:', allowedOrigins);

  server.listen(env.PORT, () => {
    console.log(`API running on port ${env.PORT}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
