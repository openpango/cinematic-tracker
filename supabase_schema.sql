-- Run this in the Supabase SQL Editor

-- 1. Create Media Cache Table (Data derived from TMDB)
CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tmdb_id INT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    media_type TEXT CHECK (media_type IN ('movie', 'tv')),
    poster_path TEXT,
    release_year TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create User List Items (To Watch / Watched)
CREATE TABLE list_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    media_id UUID REFERENCES media(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('to_watch', 'watched')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, media_id) -- A user can only have a media item in their list once
);

-- 3. Create Custom Folders
CREATE TABLE folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Map List Items to Folders
CREATE TABLE folder_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    folder_id UUID REFERENCES folders(id) ON DELETE CASCADE,
    list_item_id UUID REFERENCES list_items(id) ON DELETE CASCADE,
    UNIQUE(folder_id, list_item_id)
);

-- 5. Create Custom Tags
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT NOT NULL, -- Hex code
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Map List Items to Tags
CREATE TABLE item_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    list_item_id UUID REFERENCES list_items(id) ON DELETE CASCADE,
    UNIQUE(tag_id, list_item_id)
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) Configuration
-- ==========================================

ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE folder_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_tags ENABLE ROW LEVEL SECURITY;

-- Media is public read-only (it's just a cache)
CREATE POLICY "Media is readable by everyone" ON media FOR SELECT USING (true);
CREATE POLICY "Media is insertable by authenticated users" ON media FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- List Items are strictly tied to the owner
CREATE POLICY "Users can manage their own list items" ON list_items FOR ALL USING (auth.uid() = user_id);

-- Folders are strictly tied to the owner
CREATE POLICY "Users can manage their own folders" ON folders FOR ALL USING (auth.uid() = user_id);

-- Tags are strictly tied to the owner
CREATE POLICY "Users can manage their own tags" ON tags FOR ALL USING (auth.uid() = user_id);

-- Pivot tables (Folder Items & Item Tags) inherit security via their parent list_items/folders implicitly, 
-- but we make it explicit based on the linked list_item ownership:
CREATE POLICY "Users can manage folder items for their lists" ON folder_items 
FOR ALL USING (
    EXISTS (SELECT 1 FROM list_items WHERE id = folder_items.list_item_id AND user_id = auth.uid())
);

CREATE POLICY "Users can manage item tags for their lists" ON item_tags 
FOR ALL USING (
    EXISTS (SELECT 1 FROM list_items WHERE id = item_tags.list_item_id AND user_id = auth.uid())
);

-- ==========================================
-- STORAGE BUCKETS
-- ==========================================

-- Create the avatars bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Avatar Bucket Storage Policies (Allow public read, authenticated insert, and owner update/delete)
CREATE POLICY "Avatar images are publicly accessible." ON storage.objects
FOR SELECT USING ( bucket_id = 'avatars' );

CREATE POLICY "Users can upload an avatar." ON storage.objects
FOR INSERT WITH CHECK ( bucket_id = 'avatars' AND auth.uid() = owner );

CREATE POLICY "Users can update their own avatar." ON storage.objects
FOR UPDATE USING ( bucket_id = 'avatars' AND auth.uid() = owner );

CREATE POLICY "Users can delete their own avatar." ON storage.objects
FOR DELETE USING ( bucket_id = 'avatars' AND auth.uid() = owner );
