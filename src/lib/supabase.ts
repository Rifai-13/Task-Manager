import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// 1. DEFINISIKAN TIPE DATABASE TERLEBIH DAHULU
// export interface Database {
//   public: {
//     Tables: {
//       tasks: {
//         Row: {
//           id: string;
//           title: string;
//           completed: boolean;
//           deadline: string | null;
//           created_at: string;
//           updated_at: string;
//         };
//         Insert: {
//           id?: string;
//           title: string;
//           completed?: boolean;
//           deadline?: string | null;
//           created_at?: string;
//           updated_at?: string;
//         };
//         Update: {
//           id?: string;
//           title?: string;
//           completed?: boolean;
//           deadline?: string | null;
//           updated_at?: string;
//         };
//       };
//     };
//   };
// }

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// 2. SETELAH TIPE DIKENAL, BARU GUNAKAN UNTUK MEMBUAT CLIENT
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);