import { SupabaseClient } from '@supabase/supabase-js';
import { getUserPermissions } from './masterAuthService';
import { createArtisanClient } from '../config/supabase';

export interface TenantContext {
    userId: string;
    artisanId: string;
    artisanClient: SupabaseClient;
    permissions: any;
}

export async function resolveTenant(authorizationHeader: string): Promise<TenantContext> {
    const jwt = authorizationHeader.replace('Bearer ', '').trim();

    // 1. Get Permissions & Artisan Config from Master
    const permissions = await getUserPermissions(jwt);

    if (!permissions.artisan) {
        throw new Error('No artisan linked to this user');
    }

    // 2. Instantiate Artisan Client
    // On backend, we might use Service Key if available for admin tasks, 
    // or construction a client using the User's JWT if we want RLS to apply automatically.
    // HOWEVER, the logic described in the prompt says: 
    // "Instancie et retourne client Bolt Database artisan avec service_role key" (for backend heavy tasks)

    // We prefer Service Key for Backend processing (OCR, etc) to bypass RLS restrictions if needed,
    // OR we use the user's JWT to respect RLS. 
    // The Prompt says "RLS: auth.uid() = user_id".
    // If we use Service Key, we are admin. We should filter manually by user_id.

    const { supabase_url, supabase_service_key } = permissions.artisan;

    if (!supabase_url || !supabase_service_key) {
        throw new Error('Missing Supabase configuration for this artisan');
    }

    const artisanClient = createArtisanClient(supabase_url, supabase_service_key);

    return {
        userId: permissions.user_id,
        artisanId: permissions.artisan.id,
        artisanClient,
        permissions
    };
}
