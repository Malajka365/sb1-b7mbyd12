import { supabase } from './supabase';
import type { VideoData, TagGroup } from './supabase-types';

export async function getVideos(category: string): Promise<VideoData[]> {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
}

export async function addVideo(
  category: string,
  title: string, 
  description: string,
  youtubeId: string, 
  tags: { [key: string]: string[] },
  isPublic: boolean = true
): Promise<VideoData> {
  const { data, error } = await supabase
    .from('videos')
    .insert([{ 
      title, 
      description,
      youtube_id: youtubeId, 
      tags,
      category,
      is_public: isPublic
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateVideo(id: string, updates: Partial<VideoData>): Promise<VideoData> {
  const { data, error } = await supabase
    .from('videos')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteVideo(id: string): Promise<void> {
  const { error } = await supabase
    .from('videos')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getTagGroups(category: string): Promise<TagGroup[]> {
  try {
    const { data, error } = await supabase
      .from('tag_groups')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching tag groups:', error);
    throw error;
  }
}

export async function addTagGroup(
  category: string,
  name: string, 
  tags: string[] = []
): Promise<TagGroup> {
  const { data, error } = await supabase
    .from('tag_groups')
    .insert([{ name, tags, category }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTagGroup(id: string, updates: Partial<TagGroup>): Promise<TagGroup> {
  const { data, error } = await supabase
    .from('tag_groups')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTagGroup(id: string): Promise<void> {
  const { error } = await supabase
    .from('tag_groups')
    .delete()
    .eq('id', id);

  if (error) throw error;
}