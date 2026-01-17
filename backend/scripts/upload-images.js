/**
 * Upload images to Supabase Storage and update ai_profiles
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use anon key for storage operations (bucket is public)
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const imageMapping = [
  { userId: '11111111-1111-1111-1111-111111111111', aiProfileId: 'aaaa1111-1111-1111-1111-111111111111', image: 'GIRL.jpg' },
  { userId: '22222222-2222-2222-2222-222222222222', aiProfileId: 'aaaa2222-2222-2222-2222-222222222222', image: 'GIRL2.png.webp' },
  { userId: '33333333-3333-3333-3333-333333333333', aiProfileId: 'aaaa3333-3333-3333-3333-333333333333', image: 'GIRL3.webp' },
];

async function uploadImages() {
  console.log('📸 Uploading images to Supabase Storage...\n');

  for (const item of imageMapping) {
    const imagePath = path.join(__dirname, '../../frontend/assets/images', item.image);
    
    if (!fs.existsSync(imagePath)) {
      console.log(`❌ Image not found: ${item.image}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(imagePath);
    const ext = item.image.split('.').pop();
    const fileName = `profile-${item.userId}.${ext}`;
    
    // Determine content type
    let contentType = 'image/jpeg';
    if (ext === 'webp') contentType = 'image/webp';
    else if (ext === 'png') contentType = 'image/png';

    console.log(`Uploading ${item.image} as ${fileName}...`);

    const { data, error } = await supabase.storage
      .from('profiles')
      .upload(fileName, fileBuffer, {
        contentType,
        upsert: true
      });

    if (error) {
      console.error(`  ❌ Upload error:`, error.message);
      continue;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('profiles')
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;
    console.log(`  ✅ Uploaded: ${publicUrl}`);

    // Store URL for later SQL update
    item.photoUrl = publicUrl;
  }

  // Print SQL to update the database
  console.log('\n📝 Run this SQL to update photo URLs:\n');
  
  for (const item of imageMapping) {
    if (item.photoUrl) {
      console.log(`UPDATE ai_profiles SET photo_url = '${item.photoUrl}' WHERE id = '${item.aiProfileId}';`);
    }
  }

  console.log('\n✅ Done!');
}

uploadImages().catch(console.error);
