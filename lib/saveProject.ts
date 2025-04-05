import { RenovationType, InterestLevel } from '@/types/database';
import { supabase } from '@/lib/supabase';

interface SaveProjectParams {
  renovationType: RenovationType;
  initialPrompt: string;
  minPrice?: number;
  maxPrice?: number;
  interestLevel: InterestLevel;
  estimatedTimeline?: string;
  currentImages?: File[];
  desiredImages?: File[];
}

export async function saveProject({
  renovationType,
  initialPrompt,
  minPrice,
  maxPrice,
  interestLevel,
  estimatedTimeline,
  currentImages = [],
  desiredImages = [],
}: SaveProjectParams) {
  try {
    // First, save the project details
    const response = await fetch('/api/save-project', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        renovation_type: renovationType,
        initial_prompt: initialPrompt,
        min_price: minPrice,
        max_price: maxPrice,
        interest_level: interestLevel,
        estimated_timeline: estimatedTimeline,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save project');
    }

    const { project } = await response.json();

    // Then upload images if any
    const uploadImage = async (file: File, type: 'current' | 'desired') => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${project.id}/${type}_${Date.now()}.${fileExt}`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('renovation-images')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return null;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('renovation-images')
        .getPublicUrl(fileName);

      // Save image reference to project_images table
      const { error: saveError } = await supabase
        .from('project_images')
        .insert({
          project_id: project.id,
          image_url: publicUrl,
          image_type: type
        });

      if (saveError) {
        console.error('Error saving image reference:', saveError);
        return null;
      }

      return publicUrl;
    };

    // Upload current state images
    const currentImageUrls = await Promise.all(
      currentImages.map(file => uploadImage(file, 'current'))
    );

    // Upload desired state images
    const desiredImageUrls = await Promise.all(
      desiredImages.map(file => uploadImage(file, 'desired'))
    );

    return {
      ...project,
      currentImageUrls: currentImageUrls.filter(Boolean),
      desiredImageUrls: desiredImageUrls.filter(Boolean),
    };
  } catch (error) {
    console.error('Error saving project:', error);
    throw error;
  }
} 