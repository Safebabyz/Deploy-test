import express from 'express';
// import { Utils } from './Utils';
import mongoose from 'mongoose';
import userRoutes from './UserRoutes';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// อ่าน connection string จาก Environment variable, config.json หรือค่าเริ่มต้น
let mongoUri = process.env.MONGO_URI || process.env.CONNECTION || '';

if (!mongoUri) {
  try {
    const configPath = path.join(__dirname, 'config.json');
    if (fs.existsSync(configPath)) {
      const data: string = fs.readFileSync(configPath, {
        encoding: 'utf8',
        flag: 'r',
      });
      const config = JSON.parse(data);
      mongoUri = config.connection;
    }
  } catch (err) {
    console.warn('Could not read config.json:', err);
  }
}

// Middleware
app.use(express.json());
app.use(cors());

// โฟลเดอร์ public html
app.use(express.static(path.join(__dirname, 'public')));

// กำหนด handler ให้เปิดหน้า test.html
const handler = (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, 'public', 'test.html'));
};

app.get('/', handler);
app.get('/test', handler);

// Routes
app.use('/api', userRoutes);

// 1. สั่งเปิดพอร์ตรอรับ Request และ Health Check จาก Azure ทันที
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on 0.0.0.0:${PORT}`);
});

// 2. เชื่อมต่อ MongoDB
if (mongoUri) {
  mongoose
    .connect(mongoUri)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.error('Error connecting to MongoDB:', err);
    });
} else {
  console.warn('WARNING: No MONGO_URI provided, running without database connection.');
}