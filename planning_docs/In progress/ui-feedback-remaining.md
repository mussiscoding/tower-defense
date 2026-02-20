# UI Feedback Improvements - Remaining Items

## Overview

Outstanding UI feedback improvements not yet implemented.

## Medium Priority

### 1. Screen Flash Effect
- **Trigger**: Major level-ups (every 5 levels)
- **Effect**: Brief screen flash with element color
- **Duration**: 200-300ms
- **Intensity**: Subtle, not jarring

### 2. Element-Themed Particle Burst
- **Style**: Element-themed particles (fire embers, ice crystals, earth dust, air wisps)
- **Direction**: Burst outward from mage position
- **Quantity**: 10-20 particles per level up

### 3. Purchase Confirmation Highlights
- **Visual**: Brief highlight of the purchased upgrade in shop
- **Style**: Green glow or checkmark animation
- **Duration**: 1-2 seconds

## Future Enhancements

### Audio Feedback
1. **Level Up Sound**: Satisfying chime, different sounds per element
2. **Purchase Sound**: Coin clink or success sound
3. **Ability Sounds**:
   - Fire: Crackling for burn
   - Ice: Crystalline for slow
   - Earth: Impact for splash
   - Air: Whoosh for burst

### Mobile
1. **Haptic Feedback**: Vibration on level-ups and purchases

### Advanced Effects
1. **Elemental Skills Animations**: Center-of-field text with elemental burst
2. **Achievement Animations**: Special effects for achievements
3. **Animation Pooling**: Reuse animation objects for performance
4. **Reduced Motion Option**: Accessibility setting to disable animations

## Design Guidelines

### Color Scheme
- Fire: Red/orange (#ff4444)
- Ice: Blue/cyan (#4444ff)
- Earth: Brown (#8b4513)
- Air: Gray/white (#cccccc)
- Gold: Yellow (#ffd700)

### Animation Principles
- Duration: 1-4 seconds max
- Easing: Smooth, natural motion
- Performance: 60fps, hardware acceleration
