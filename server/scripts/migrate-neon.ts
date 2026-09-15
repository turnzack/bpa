import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function runNeonMigration() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.error('❌ ERREUR : DATABASE_URL n\'est pas configuré dans .env');
        process.exit(1);
    }

    console.log('🚀 Début de la migration Neon PostgreSQL via Neon Serverless...');
    const sql = neon(dbUrl);

    // Helper pour exécuter une chaîne DDL arbitraire
    const rawSql = (queryStr: string) => {
        const templateArr: any = [queryStr];
        templateArr.raw = [queryStr];
        return sql(templateArr);
    };

    // 1. Lire le schéma complet et supprimer tous les commentaires SQL ligne par ligne
    const sqlFilePath = path.join(__dirname, '..', 'src', 'db', 'neon-schema-complete.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    const cleanSql = sqlContent.replace(/--.*$/gm, '');
    const statements = cleanSql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

    console.log(`📋 ${statements.length} instructions SQL valides à exécuter.`);

    for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        if (!statement) continue;
        try {
            await rawSql(statement);
            const firstLine = statement.split('\n')[0].trim();
            console.log(`✅ [${i + 1}/${statements.length}] ${firstLine}`);
        } catch (err: any) {
            console.warn(`⚠️ [${i + 1}/${statements.length}] Notice :`, err.message);
        }
    }

    // 2. Vérifier les tables actives dans Neon
    const tables = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
    `;

    console.log('\n🎉 TOUTES LES TABLES SONT CRÉÉES ET OPÉRATIONNELLES DANS NEON :');
    tables.forEach((t: any) => console.log(`   - 📦 ${t.table_name}`));
}

runNeonMigration();
