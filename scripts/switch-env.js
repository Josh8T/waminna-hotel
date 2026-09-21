import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envTarget = process.argv[2];

if (!envTarget || !['staging', 'production'].includes(envTarget)) {
  console.error('Usage: npm run switch-env [staging|production]');
  process.exit(1);
}

const envFile = path.resolve(__dirname, `../.env.${envTarget}`);
const targetFile = path.resolve(__dirname, '../.env');
const targetLocalFile = path.resolve(__dirname, '../.env.local');

if (!fs.existsSync(envFile)) {
  console.error(`Environment file ${envFile} not found!`);
  process.exit(1);
}

// Read and log what we're switching to
const content = fs.readFileSync(envFile, 'utf8');
const supabaseUrlLine = content.split('\n').find(line => line.startsWith('VITE_SUPABASE_URL='));
const dbUrl = supabaseUrlLine ? supabaseUrlLine.split('=')[1] : 'Unknown URL';

fs.copyFileSync(envFile, targetFile);
fs.copyFileSync(envFile, targetLocalFile);

console.log(`\n✅ Switched to ${envTarget.toUpperCase()} environment!`);
console.log(`📡 Database Target: ${dbUrl}\n`);
