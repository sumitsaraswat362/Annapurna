const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data, error } = await supabase.from('cargos').select('id, asking_price_per_kg, status');
  console.log("CARGOS IN DB:", data);
  if (error) console.error("ERROR:", error);
}

check();
