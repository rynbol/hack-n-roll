/**
 * Seed student profiles with sample data and upload images to Supabase Storage
 * Run: node scripts/seed-student-data.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase config - local development
const supabaseUrl = process.env.SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Sample student profiles data
const studentProfiles = [
  {
    name: 'Emma',
    age: 21,
    university: 'UW Madison',
    major: 'Computer Science',
    bio: 'CS major who loves late-night coding sessions and early morning coffee. Looking for someone to debug life with! 💻☕',
    city: 'Madison',
    country: 'USA',
    classes: ['CS 506', 'CS 577', 'MATH 340'],
    interests: ['Coding', 'Coffee', 'Hiking', 'Photography'],
    image: 'GIRL.jpg'
  },
  {
    name: 'Sofia',
    age: 20,
    university: 'UW Madison',
    major: 'Psychology',
    bio: 'Psych major analyzing why you swiped right 🧠✨ Dog lover, sunset chaser, and professional overthinker.',
    city: 'Madison',
    country: 'USA',
    classes: ['PSYCH 202', 'PSYCH 414', 'SOC 120'],
    interests: ['Psychology', 'Dogs', 'Yoga', 'Reading'],
    image: 'GIRL2.png.webp'
  },
  {
    name: 'Mia',
    age: 22,
    university: 'UW Madison',
    major: 'Business Administration',
    bio: 'Future CEO in the making 📈 Looking for a study buddy who can keep up with my caffeine addiction and ambition.',
    city: 'Madison',
    country: 'USA',
    classes: ['BUS 301', 'ACCT 211', 'ECON 101'],
    interests: ['Entrepreneurship', 'Networking', 'Travel', 'Fitness'],
    image: 'GIRL3.webp'
  }
];

async function uploadImage(imageName) {
  const imagePath = path.join(__dirname, '../../frontend/assets/images', imageName);
  
  if (!fs.existsSync(imagePath)) {
    console.log(`Image not found: ${imagePath}`);
    return null;
  }

  const fileBuffer = fs.readFileSync(imagePath);
  const fileName = `student-${Date.now()}-${imageName.replace(/[^a-zA-Z0-9.]/g, '_')}`;
  
  const { data, error } = await supabase.storage
    .from('profiles')
    .upload(fileName, fileBuffer, {
      contentType: imageName.endsWith('.webp') ? 'image/webp' : 'image/jpeg',
      upsert: true
    });

  if (error) {
    console.error('Upload error:', error);
    return null;
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('profiles')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

async function seedData() {
  console.log('🌱 Starting seed process...\n');

  // First, create test users in auth.users (for local dev)
  const testUsers = [];
  
  for (let i = 0; i < studentProfiles.length; i++) {
    const profile = studentProfiles[i];
    const email = `${profile.name.toLowerCase()}@wisc.edu`;
    
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: 'testpassword123',
      email_confirm: true
    });

    if (authError && !authError.message.includes('already been registered')) {
      console.error(`Error creating auth user for ${profile.name}:`, authError);
      continue;
    }

    const userId = authData?.user?.id || null;
    if (!userId) {
      // Try to get existing user
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existing = existingUsers?.users?.find(u => u.email === email);
      if (existing) {
        testUsers.push({ ...profile, userId: existing.id, email });
        continue;
      }
      console.error(`Could not get user ID for ${profile.name}`);
      continue;
    }
    
    testUsers.push({ ...profile, userId, email });
    console.log(`✓ Created auth user: ${email} (${userId})`);
  }

  // Upload images and create profiles
  for (const profile of testUsers) {
    console.log(`\n📸 Processing ${profile.name}...`);
    
    // Upload image
    const photoUrl = await uploadImage(profile.image);
    if (!photoUrl) {
      console.log(`  ⚠ No image uploaded, using placeholder`);
    } else {
      console.log(`  ✓ Image uploaded: ${photoUrl}`);
    }

    // Create student_profile
    const { data: studentProfile, error: spError } = await supabase
      .from('student_profiles')
      .upsert({
        user_id: profile.userId,
        university: profile.university,
        email: profile.email,
        major: profile.major,
        graduation_year: 2026,
        classes: profile.classes,
        study_interests: profile.interests,
        verified: true
      }, { onConflict: 'user_id' })
      .select()
      .single();

    if (spError) {
      console.error(`  ✗ Error creating student_profile:`, spError);
      continue;
    }
    console.log(`  ✓ Student profile created`);

    // Create ai_profile
    const { data: aiProfile, error: aiError } = await supabase
      .from('ai_profiles')
      .insert({
        user_id: profile.userId,
        photo_url: photoUrl || 'https://via.placeholder.com/400',
        generated_bio: profile.bio,
        personality_traits: ['Friendly', 'Ambitious', 'Creative'],
        interests: profile.interests,
        conversation_starters: ['What are you studying?', 'Any fun plans this weekend?'],
        ai_provider: 'claude',
        is_active: true
      })
      .select()
      .single();

    if (aiError) {
      console.error(`  ✗ Error creating ai_profile:`, aiError);
      continue;
    }
    console.log(`  ✓ AI profile created`);

    // Create or update main profile
    const { data: mainProfile, error: mpError } = await supabase
      .from('profiles')
      .upsert({
        id: profile.userId,
        first_name: profile.name,
        dob: new Date(2026 - profile.age, 0, 1).toISOString().split('T')[0],
        height_cm: 165,
        neighbourhood: profile.city,
        latitude: 43.0731,  // Madison, WI
        longitude: -89.4012,
        gender_id: 2, // Woman
        zodiac_sign_id: 1, // Aries
        sexuality_id: 1, // Straight
        max_distance_km: 160,
        min_age: 18,
        max_age: 30,
        student_profile_id: studentProfile.id,
        active_ai_profile_id: aiProfile.id
      }, { onConflict: 'id' })
      .select()
      .single();

    if (mpError) {
      console.error(`  ✗ Error creating main profile:`, mpError);
      continue;
    }
    console.log(`  ✓ Main profile linked`);

    // Add profile photo to profile_photos table
    const { error: ppError } = await supabase
      .from('profile_photos')
      .insert({
        profile_id: profile.userId,
        photo_url: photoUrl || 'https://via.placeholder.com/400',
        photo_order: 0,
        is_active: true
      });

    if (ppError && !ppError.message.includes('duplicate')) {
      console.error(`  ✗ Error adding profile photo:`, ppError);
    } else {
      console.log(`  ✓ Profile photo added`);
    }
  }

  console.log('\n✅ Seed complete!');
  console.log('\n📝 Test accounts created:');
  testUsers.forEach(u => {
    console.log(`   - ${u.email} / testpassword123`);
  });
}

seedData().catch(console.error);
