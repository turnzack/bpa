import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const ARTISAN_URL = process.argv[2];
const ARTISAN_KEY = process.argv[3];

if (!ARTISAN_URL || !ARTISAN_KEY) {
    console.error("Usage: ts-node src/scripts/setup_storage.ts <ARTISAN_URL> <ARTISAN_SERVICE_KEY>");
    process.exit(1);
}

const supabase = createClient(ARTISAN_URL, ARTISAN_KEY);

async function setupStorage() {
    console.log(`🔌 Connecting to ${ARTISAN_URL}...`);

    const BUCKET_NAME = 'invoice-scans';

    // 1. Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
        console.error("❌ Error listing buckets:", listError);
        return;
    }

    const exists = buckets?.find(b => b.name === BUCKET_NAME);

    if (exists) {
        console.log(`✅ Bucket '${BUCKET_NAME}' already exists.`);
    } else {
        console.log(`Construction bucket '${BUCKET_NAME}'...`);
        const { data, error } = await supabase.storage.createBucket(BUCKET_NAME, {
            public: true, // Make it public for easier access in MVP
            fileSizeLimit: 10485760, // 10MB
            allowedMimeTypes: ['image/png', 'image/jpeg', 'application/pdf']
        });

        if (error) {
            console.error("❌ Error creating bucket:", error);
        } else {
            console.log(`✅ Bucket '${BUCKET_NAME}' created successfully.`);
        }
    }

    // 2. Setup Policies (Optional via API, usually SQL is better, but here we can try)
    // Policies are often set via SQL (see db_schema_artisan.sql)
    console.log("ℹ️ Don't forget to run the SQL schema to set up Row Level Security policies for Storage objects if needed.");
}

setupStorage();
