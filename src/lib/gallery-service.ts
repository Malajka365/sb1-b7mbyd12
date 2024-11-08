import { supabase } from './supabase';
import type { Gallery } from './supabase-types';

export async function getGalleries(): Promise<Gallery[]> {
  const { data, error } = await supabase
    .from('galleries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createGallery(
  name: string,
  description: string,
  category: string,
  isPublic: boolean
): Promise<Gallery> {
  // Validate category format
  if (!/^[a-z0-9-]+$/.test(category)) {
    throw new Error('Category can only contain lowercase letters, numbers, and hyphens');
  }

  // Check if category already exists
  const { data: existingGallery } = await supabase
    .from('galleries')
    .select('id')
    .eq('category', category)
    .single();

  if (existingGallery) {
    throw new Error('A gallery with this category already exists. Please choose a different category.');
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User must be logged in to create a gallery');

  try {
    const { data, error } = await supabase
      .from('galleries')
      .insert([{ 
        user_id: user.id,
        name, 
        description, 
        category,
        is_public: isPublic 
      }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('A gallery with this category already exists. Please choose a different category.');
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Gallery creation error:', error);
    throw error;
  }
}

export async function updateGallery(
  id: string, 
  updates: Partial<Gallery>
): Promise<Gallery> {
  const { data, error } = await supabase
    .from('galleries')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteGallery(id: string): Promise<void> {
  const { error } = await supabase
    .from('galleries')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getGalleryByCategory(category: string): Promise<Gallery | null> {
  const { data, error } = await supabase
    .from('galleries')
    .select('*')
    .eq('category', category)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows returned
    throw error;
  }
  return data;
}