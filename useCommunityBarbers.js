
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export function useCommunityBarbers() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [roleFilter, cityFilter, pageSize]);

  const fetchProfiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Removed barber_integrations join to fix PGRST200 error
      // Fetching google_business_* fields directly from the profiles table
      let query = supabase
        .from('profiles')
        .select(`
          id, email, full_name, avatar_url, bio, city, display_name, role, is_shared, created_at, updated_at,
          google_business_name, google_business_location, google_business_rating, google_business_reviews_count, 
          google_business_photo, google_business_link, google_business_description, google_business_phone, google_business_website
        `, { count: 'exact' })
        .eq('is_shared', true);

      if (debouncedSearch) {
        query = query.or(`full_name.ilike.%${debouncedSearch}%,display_name.ilike.%${debouncedSearch}%`);
      }
      
      if (roleFilter && roleFilter !== 'all') {
        query = query.eq('role', roleFilter);
      }
      
      if (cityFilter && cityFilter !== 'all') {
        query = query.ilike('city', `%${cityFilter}%`);
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      query = query.order('updated_at', { ascending: false }).range(from, to);

      const { data, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;

      // Map the direct profiles columns to the expected structure
      const enrichedProfiles = data?.map(profile => {
        const hasGoogleData = !!profile.google_business_link;
        
        return {
          ...profile,
          // Maintain compatibility with components that might still expect googleData object
          googleData: hasGoogleData ? {
            google_business_name: profile.google_business_name,
            google_business_location: profile.google_business_location,
            google_business_rating: profile.google_business_rating,
            google_business_reviews_count: profile.google_business_reviews_count,
            google_business_photo: profile.google_business_photo,
            google_business_link: profile.google_business_link
          } : null
        };
      });

      setProfiles(enrichedProfiles || []);
      setTotalCount(count || 0);
    } catch (err) {
      console.error('Error fetching community barbers:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, roleFilter, cityFilter, page, pageSize]);

  useEffect(() => {
    fetchProfiles();

    const channel = supabase
      .channel('public:profiles_community')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'profiles',
        filter: 'is_shared=eq.true'
      }, () => {
        fetchProfiles();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchProfiles]);

  return {
    profiles,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    cityFilter,
    setCityFilter,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize)
  };
}
