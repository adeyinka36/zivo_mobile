# Memory Optimization for Explore Page

## Overview
The explore page has been optimized to minimize memory usage, especially for videos playing in the background when not in view.

## Key Optimizations Implemented

### 1. Viewport Detection
- **Problem**: All videos were playing simultaneously regardless of visibility
- **Solution**: Implemented `onViewableItemsChanged` callback to track which media item is currently visible
- **Benefit**: Only the visible video plays, others are paused

### 2. Optimized Video Player Hook
- **Created**: `useOptimizedVideoPlayer` hook in `/hooks/useOptimizedVideoPlayer.ts`
- **Features**:
  - Automatic play/pause based on visibility
  - Proper cleanup on unmount
  - Memory-efficient end detection
  - Configurable loop and mute settings

### 3. FlatList Performance Optimizations
- **`removeClippedSubviews={true}`**: Removes off-screen items from memory
- **`maxToRenderPerBatch={3}`**: Limits items rendered per batch
- **`windowSize={5}`**: Keeps only 5 items in memory at once
- **`initialNumToRender={1}`**: Starts with just 1 item to reduce initial load

### 4. Enhanced Cleanup
- **Video Player Cleanup**: Properly pause and unload videos when components unmount
- **Interval Cleanup**: Clear all timers and intervals on unmount
- **Memory Leak Prevention**: Nullify references after cleanup

### 5. Lazy Loading
- **Image Loading**: Only load images when they become visible
- **Video Loading**: Videos are initialized but paused until visible
- **Progressive Loading**: Load content as user scrolls

## Technical Implementation

### Viewport Detection
```typescript
const handleViewableItemsChanged = useCallback(({ viewableItems }: any) => {
  if (viewableItems.length > 0) {
    const newVisibleIndex = viewableItems[0].index;
    setVisibleIndex(newVisibleIndex);
  }
}, []);

const viewabilityConfig = {
  itemVisiblePercentThreshold: 50, // Item is considered visible when 50% is shown
  minimumViewTime: 100, // Minimum time item must be visible
};
```

### Optimized Video Player Hook
```typescript
const { player, isReady } = useOptimizedVideoPlayer({
  url: media.url,
  shouldPlay: isVisible && isLoaded,
  loop: true,
  muted: true,
  onReady: () => setIsLoaded(true),
});
```

### FlatList Configuration
```typescript
<FlatList
  // ... other props
  onViewableItemsChanged={handleViewableItemsChanged}
  viewabilityConfig={viewabilityConfig}
  removeClippedSubviews={true}
  maxToRenderPerBatch={3}
  windowSize={5}
  initialNumToRender={1}
/>
```

## Memory Usage Benefits

### Before Optimization
- All videos loaded and played simultaneously
- No cleanup of off-screen components
- Memory usage grew linearly with content
- Potential memory leaks from uncleaned resources

### After Optimization
- Only visible video plays at a time
- Off-screen components are removed from memory
- Proper cleanup prevents memory leaks
- Reduced initial load time
- Better battery life due to fewer active video players

## Performance Monitoring

To monitor the effectiveness of these optimizations:

1. **Memory Usage**: Check device memory usage in developer tools
2. **Battery Life**: Monitor battery consumption during app usage
3. **Smooth Scrolling**: Ensure scrolling remains smooth with optimizations
4. **Video Playback**: Verify videos play/pause correctly based on visibility

## Future Enhancements

1. **Video Preloading**: Implement smart preloading for next/previous items
2. **Quality Adaptation**: Adjust video quality based on device performance
3. **Background App State**: Handle video cleanup when app goes to background
4. **Network Optimization**: Implement adaptive bitrate streaming for videos

## Testing Recommendations

1. Test on low-memory devices
2. Monitor memory usage during extended scrolling
3. Verify video playback behavior when switching between items
4. Test app performance when going to background/foreground
5. Check for memory leaks during long usage sessions 