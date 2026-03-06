# Planned Features & Expansion

## Social Ecosystem
- **Following Users**: Allow users to follow each other's profiles.
- **Activity Feed**: View a localized feed of what friends recently added to "Watched" or "To Watch".
- **Reaction System**: Emoji reactions on items in friends' lists.

## Media Enrichment
- **Trailers**: Integrate TMDB `/videos` endpoint to show YouTube trailers in the `MediaDetail` modal.
- **Where to Watch**: Integrate JustWatch API data (often provided by TMDB) so users can click a button to open Netflix/Hulu directly.
- **Custom Rating**: Replace the binary "Watched" state with a 1-10 Slider / Star system stored locally in `list_items.rating`.

## Platform Native Additions
- **Haptic Feedback**: Implement `@capacitor/haptics` to trigger light vibrations when users press the "Add to Queue" springs, reinforcing the Apple-style aesthetic.
- **Home Screen Widgets**: Explore Capacitor extensions for rendering iOS native Home Screen widgets showing the user's "Up Next" queue.
