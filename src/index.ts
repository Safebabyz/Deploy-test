import express from 'express';
// import { Utils } from './Utils'; // ของเดิมจาก unit test (เปิดใช้ถ้ามีไฟล์ Utils.ts)
import mongoose from 'mongoose';
import userRoutes from './UserRoutes';
import cors from 'cors'; // npm install --save-dev @types/cors
import fs from 'fs';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

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

if (!mongoUri) {
  console.error('ERROR: MONGO_URI environment variable or config.json is required!');
  process.exit(1);
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

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
