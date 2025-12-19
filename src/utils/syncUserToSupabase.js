import { supabase } from '../supabase';

/**
 * Syncs a Clerk user to Supabase users table
 * @param {Object} user - Clerk user object
 * @returns {Promise} - Supabase upsert response
 */
export async function syncUserToSupabase(user) {
    if (!user) return;

    try {
        const userData = {
            id: user.id,
            email: user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress || '',
            full_name: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || null,
            image_url: user.imageUrl || null,
            last_sign_in_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from('users')
            .upsert(userData, {
                onConflict: 'id',
                ignoreDuplicates: false
            });

        if (error) {
            console.error('Error syncing user to Supabase:', error);
            return { error };
        }

        console.log('User synced to Supabase:', userData.email);
        return { data };
    } catch (err) {
        console.error('Failed to sync user:', err);
        return { error: err };
    }
}
