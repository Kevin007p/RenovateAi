import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { RenovationType, InterestLevel } from '@/types/database';

interface SaveProjectRequest {
  renovation_type: RenovationType;
  initial_prompt: string;
  min_price?: number;
  max_price?: number;
  interest_level: InterestLevel;
  estimated_timeline?: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as SaveProjectRequest;

    // Insert the project data into Supabase
    const { data, error } = await supabase
      .from('renovation_projects')
      .insert([body])
      .select()
      .single();

    if (error) {
      console.error('Error saving project:', error);
      return NextResponse.json(
        { error: 'Failed to save project' },
        { status: 500 }
      );
    }

    return NextResponse.json({ project: data });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 