import multer from  'multer';
import path from 'path';

export default {
  storage: multer.diskStorage({
    destination: path.join(__dirname, '..', '..', 'uploads'),
    filename(req: Express.Request, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) {
      const originalFilename = file.originalname.replace(/\s/g, '_');
      const fileName = `${Date.now()}-${originalFilename}`;

      callback(null, fileName);
    }
  })
}