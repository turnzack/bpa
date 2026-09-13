import { masterSupabase } from '../config/supabase';

export interface UserPermissions {
    user_id: string;
    email: string | undefined;
    plan: string;
    modules: Record<string, boolean>;
    ape: string | null;    subscription?: {
        status: string;
        plan: string;
    };    artisan: {
        id: string;
        supabase_url: string;
        supabase_anon_key: string;
        supabase_service_key?: string; // Only for backend use
    } | null;
}

export async function getUserPermissions(jwt: string): Promise<UserPermissions> {
    // 1. Verify JWT via Master Auth
    const { data: { user }, error: authError } = await masterSupabase.auth.getUser(jwt);

    if (authError || !user) {
        throw new Error('Invalid Token');
    }

    // 2. Fetch Artisan Profile
    const { data: artisan, error: artisanError } = await masterSupabase
        .from('artisans')
        .select(`
      id, 
      plan_id, 
      ape_code, 
      supabase_url, 
      supabase_anon_key, 
      supabase_service_key,
      plans ( code )
    `)
        .eq('user_id', user.id)
        .single();

    if (artisanError || !artisan) {
        console.error('Artisan not found for user:', user.id, artisanError);
        // Return minimal permissions or throw
        throw new Error('Artisan profile not found');
    }

    // 4. Fetch Subscription Status
    const { data: subscription, error: subError } = await masterSupabase
        .from('user_subscriptions')
        .select('status, plan')
        .eq('user_email', user.email)
        .eq('status', 'active')
        .single();

    const subscriptionInfo = subscription ? { status: subscription.status, plan: subscription.plan } : null;
    const { data: modulesData, error: modulesError } = await masterSupabase
        .from('artisan_modules')
        .select('module_code, enabled')
        .eq('artisan_id', artisan.id)
        .eq('enabled', true);

    const modules: Record<string, boolean> = {};
    if (modulesData) {
        modulesData.forEach((m: any) => {
            modules[m.module_code] = true;
        });
    }

    // Default modules based on Plan (This logic can be refined)
    // For now, we trust the DB or add defaults
    const planCode = (artisan.plans as any)?.code || 'standard';

    // Example hardcoded defaults if DB is empty
    if (planCode === 'premium') {
        modules['compta_ocr'] = true;
    }

    return {
        user_id: user.id,
        email: user.email,
        plan: planCode,
        modules: modules,
        ape: artisan.ape_code,
        subscription: subscriptionInfo,
        artisan: {
            id: artisan.id,
            supabase_url: artisan.supabase_url,
            supabase_anon_key: artisan.supabase_anon_key,
            supabase_service_key: artisan.supabase_service_key
        }
    };
}
