import { NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

interface Lead {
  conversationId: string;
  interestLevel: 'interested' | 'waiting' | 'not_interested';
  timestamp: string;
  chatHistory: any[];
}

export async function POST(request: Request) {
  try {
    const lead: Lead = await request.json();
    
    // Get the path to the leads.json file
    const filePath = join(process.cwd(), 'data', 'leads.json');
    
    // Read existing leads
    let leads: Lead[] = [];
    try {
      const fileContent = await readFile(filePath, 'utf-8');
      leads = JSON.parse(fileContent);
    } catch (error) {
      // File doesn't exist yet, that's okay
    }
    
    // Add new lead
    leads.push(lead);
    
    // Write updated leads back to file
    await writeFile(filePath, JSON.stringify(leads, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error storing lead:', error);
    return NextResponse.json(
      { error: 'Failed to store lead information' },
      { status: 500 }
    );
  }
} 