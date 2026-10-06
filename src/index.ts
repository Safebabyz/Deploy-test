import express from 'express';
// import { Utils } from './Utils'; // ของเดิมจาก unit test (เปิดใช้ถ้ามีไฟล์ Utils.ts)
import mongoose from 'mongoose';
import userRoutes from './UserRoutes';
import cors from 'cors'; // npm install --save-dev @types/cors
import fs from 'fs';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

// อ่าน connection string จาก config.json (ไม่ต้องใส่รหัสผ่านในโค้ด / ขึ้น GitHub)
const data: string = fs.readFileSync(path.join(__dirname, 'config.json'), {
  encoding: 'utf8',
  flag: 'r',
});
const config = JSON.parse(data);
const mongoUri: string = config.connection;

// หรือใส่ตรง ๆ แบบนี้ (ไม่แนะนำ):
// const mongoUri = 'mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Middleware
app.use(express.json());
app.use(cors());

// โฟลเดอร์ public html
app.use(express.static(path.join(__dirname, 'public')));

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
