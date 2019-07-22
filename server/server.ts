import express, { Request, Response } from 'express';
import path from 'path';

const app = express();
const ROOT_FOLDER = path.join(__dirname, '../');
const PORT = process.env.PORT || '8080';

async function runServer(): Promise<void> {
  app.use(express.static(path.join(ROOT_FOLDER, '/dist')));
  app.use(express.static(path.join(ROOT_FOLDER, '/public')));

  app.get('/', (req: Request, res: Response): void => {
    res.sendFile(path.join(ROOT_FOLDER, 'index.html'));
  });

  app.listen(PORT, (): void => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${PORT}`);
  });
}

try {
  runServer();
} catch (err) {
  // eslint-disable-next-line no-console
  console.error(err);
}
