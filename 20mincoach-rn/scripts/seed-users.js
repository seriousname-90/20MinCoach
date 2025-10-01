// scripts/seed-users.js
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE;

if (!url || !service) {
  console.error('Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE en .env.admin');
  process.exit(1);
}

const admin = createClient(url, service, {
  auth: { autoRefreshToken: false, persistSession: false },
});

/**
 * Crea usuario con password y rol en app_metadata.roles
 */
async function createUser({ email, password, roles }) {
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // lo dejamos confirmado para pruebas
    app_metadata: { roles },
  });
  if (error) throw error;
  return data.user;
}

(async () => {
  try {
    // Premium
    const u1 = await createUser({
      email: 'ian.porrasc1710@gmail.com',
      password: '123456', // solo para PoC
      roles: ['PremiumUser'], // ¡usa nombres EXACTOS que esperan tus guards!
    });
    console.log('Creado Premium:', u1.email, u1.id);

    // Basic
    const u2 = await createUser({
      email: 'ianpro222@gmail.com',
      password: '123456', // solo para PoC
      roles: ['BasicUser'],
    });
    console.log('Creado Basic:', u2.email, u2.id);

    console.log('OK: usuarios seed creados con roles y password.');
  } catch (e) {
    console.error('ERROR seed:', e);
    process.exit(1);
  }
})();
