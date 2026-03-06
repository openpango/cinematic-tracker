# Cinematic Tracker Roadmap

## Short-Term (v1.0 - Core Loop)
- [ ] **Media Details Screen**: Clicking a card opens a full native-feeling modal with a backdrop of the movie poster, synopsis, cast, and rating.
- [ ] **Advanced Filtering**: Allow users to filter their "To Watch" list by their custom applied `#Tags`.
- [ ] **Folder Deep Links**: Clicking a folder navigates to a specific `FolderDetail.tsx` view showing only media associated with that folder.
- [ ] **Profile Management**: Allow users to upload an avatar and manage their Supabase account specifics.

## Mid-Term (v1.5 - Social & Analytics)
- [ ] **Statistics**: A dashboard showing "Hours Watched", "Favorite Genres", to give users insight into their watching habits.
- [ ] **Sharing**: Generate a public link (via Supabase Public bucket or unauthenticated RLS read) for a specific Custom Folder so users can share "My Top 10 Scifi" lists.
- [ ] **Push Notifications**: Leverage Capacitor Push Notifications to remind users when a tracked TV show airs a new episode (requires backend Cron).

## Long-Term (v2.0 - Ecosystem)
- [ ] **Offline Mode**: Cache the user's lists locally so the app functions seamlessly in Airplane mode, syncing to Supabase when reconnected.
- [ ] **Data Export/Import**: Integration with Trakt.tv or Letterboxd CSVs to easily migrate users.
