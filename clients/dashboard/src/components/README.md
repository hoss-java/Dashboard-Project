# Creating Your Own Component - Step-by-Step Guide

## 🎓 Tutorial: Build a "Label" Component from Scratch

In this tutorial, you'll **copy the TextComponent, rename it, and create a brand new "Label" component**.

This is the fastest way to get hands on because you're not starting from zero — you're extending something that already works.

---

## Step 1: Add the New Type to `types.ts`

**File**: `src/components/types.ts`

**What to do**: Find the `ItemType` union and add `'label'`:

```typescript
// BEFORE
export type ItemType = 'text' | 'box' | 'card';

// AFTER
export type ItemType = 'text' | 'box' | 'card' | 'label';
```

**That's it!** You've told TypeScript that `'label'` is now a valid component type.

---

## Step 2: Create the Label Folder and Component File

**What to do**: Create a new folder and file:

```
src/components/renderers/components/
├── Box/
├── Card/
├── Text/
└── Label/                          ← NEW FOLDER
    └── LabelComponent.tsx          ← NEW FILE
```

**Copy this code into `LabelComponent.tsx`**:

```typescript
// src/components/renderers/components/Label/LabelComponent.tsx
import React from 'react';
import { Typography } from '@mui/material';
import { resolveValue } from '../../utils/resolveValue';
import type { ItemRendererProps } from '../../types';

export const LabelComponent: React.FC<ItemRendererProps> = ({
  item,
  defaultStyle,
  onItemClick,
}) => {
  const fontSize = resolveValue(item.fontSize, defaultStyle?.fontSize, 14);
  const fontWeight = resolveValue(item.fontWeight, defaultStyle?.fontWeight, 'bold') as 'normal' | 'bold' | 'lighter';
  const content = resolveValue(item.content, defaultStyle?.content, '');

  const onItemClickHandler = () => {
    console.info('[LabelComponent] Label clicked:', item.id);
    if (onItemClick) onItemClick(item.id, item);
  };

  const getLabelSx = () => ({
    fontSize,
    fontWeight,
    cursor: 'pointer',
    mb: 2,
    textTransform: 'uppercase',    // ← NEW: Labels are uppercase
    letterSpacing: '0.5px',        // ← NEW: Extra letter spacing
    color: '#555',                 // ← NEW: Slightly darker text
  });

  return (
    <Typography
      sx={getLabelSx()}
      onClick={onItemClickHandler}
    >
      {content}
    </Typography>
  );
};

export default LabelComponent;
```

**What changed from TextComponent?**
- Renamed to `LabelComponent`
- Added `textTransform: 'uppercase'` (labels are typically uppercase)
- Added `letterSpacing` (more visual distinction)
- Changed default `fontWeight` from `'normal'` to `'bold'`
- Updated the console log to say `'[LabelComponent]'`

---

## Step 3: Import the Component in the Registry

**File**: `src/components/renderers/ComponentRegistry.ts`

**What to do**: Add an import for your new component at the top:

```typescript
// EXISTING IMPORTS
import { TextComponent } from './components/Text/TextComponent';
import { BoxComponent } from './components/Box/BoxComponent';
import { CardComponent } from './components/Card/CardComponent';

// ADD THIS
import { LabelComponent } from './components/Label/LabelComponent';
```

---

## Step 4: Add Your Component to the Registry JSON

**File**: `src/components/config/componentRegistry.json`

**What to do**: Add a new entry to the array:

```json
{
  "type": "text",
  "displayName": "Text",
  "description": "Simple text display",
  "path": "Text",
  "fileName": "TextComponent.tsx"
},
{
  "type": "box",
  "displayName": "Box",
  "description": "Container for multiple items",
  "path": "Box",
  "fileName": "BoxComponent.tsx"
},
{
  "type": "card",
  "displayName": "Card",
  "description": "Card with title, content, and footer",
  "path": "Card",
  "fileName": "CardComponent.tsx"
},
{
  "type": "label",
  "displayName": "Label",
  "description": "Uppercase text label with styling",
  "path": "Label",
  "fileName": "LabelComponent.tsx"
}
```

---

## Step 5: Register the Component in the Singleton

**File**: `src/components/renderers/ComponentRegistry.ts`

**What to do**: Find the `componentMap` in the `ComponentRegistry` class and add your component:

```typescript
private componentMap: Record<string, React.FC<ItemRendererProps>> = {
  text: TextComponent,
  box: BoxComponent,
  card: CardComponent,
  label: LabelComponent,  // ← ADD THIS LINE
};
```

---

## Step 6: Test Your Component in the Dashboard

**File**: `src/config/dashboardItems.json`

**What to do**: Add a label item to your dashboard to see it in action:

```json
[
  {
    "id": "main-container",
    "type": "box",
    "padding": 16,
    "gap": 12,
    "items": [
      {
        "id": "card-1",
        "type": "card",
        "title": "Welcome Card",
        "items": [
          {
            "id": "card-1-text",
            "type": "text",
            "content": "Hello! This is my dashboard."
          }
        ]
      },
      {
        "id": "my-label",
        "type": "label",
        "content": "This is my custom label component!"
      }
    ]
  }
]
```

**Step 7**: Save all files and refresh your browser

✨ **Result**: Your new Label component appears on the dashboard with uppercase text and custom styling!

---

## 🎉 What You Just Built

You've successfully:

| Step | Action | What It Does |
|------|--------|-------------|
| 1 | Added `'label'` to `ItemType` | TypeScript knows about your new type |
| 2 | Created `LabelComponent.tsx` | Built the actual React component |
| 3 | Imported in `ComponentRegistry.ts` | Made it available to the system |
| 4 | Added to `componentRegistry.json` | Documented your component |
| 5 | Added to `componentMap` | Registered it in the singleton |
| 6 | Used in `dashboardItems.json` | Tested it in the UI |

**That's a complete component creation workflow!** 🚀

---

## 🔍 How It Works (Behind the Scenes)

When you add `{ "type": "label", ... }` to your JSON:

1. `DashboardPanel` loads `dashboardItems.json`
2. `ItemRenderer` gets the item with `type: 'label'`
3. `ItemRenderer` calls `componentRegistry.getComponent('label')`
4. The registry looks up `'label'` in `componentMap` and finds `LabelComponent`
5. `ItemRenderer` renders `<LabelComponent item={...} />`
6. Your custom Label appears on screen! ✨

---

## 💡 Next Level: Customize Your Component

Now that you have a working Label component, try these experiments:

### Add a Color Property

**In `LabelComponent.tsx`**, add:

```typescript
const color = resolveValue(item.color, defaultStyle?.color, '#555');

const getLabelSx = () => ({
  // ... existing properties ...
  color,  // ← USE THE COLOR
});
```

**Then in `dashboardItems.json`**, test it:

```json
{
  "id": "my-label",
  "type": "label",
  "content": "This label is red!",
  "color": "#d32f2f"  // ← CUSTOM COLOR
}
```

### Add a Variant Property (e.g., "small", "large")

```typescript
const variant = resolveValue(item.variant, defaultStyle?.variant, 'normal');
const baseFontSize = resolveValue(item.fontSize, defaultStyle?.fontSize, 14);

const fontSize = variant === 'large' ? baseFontSize * 1.5 : 
                 variant === 'small' ? baseFontSize * 0.75 : 
                 baseFontSize;
```

**Then use it in JSON**:

```json
{
  "id": "my-label",
  "type": "label",
  "content": "Big Label!",
  "variant": "large"
}
```

---

## ✅ Checklist: Did You Complete Everything?

- [ ] Added `'label'` to `ItemType` in `src/components/types.ts`
- [ ] Created `src/components/renderers/components/Label/LabelComponent.tsx`
- [ ] Imported `LabelComponent` in `src/components/renderers/ComponentRegistry.ts`
- [ ] Added label entry to `src/components/config/componentRegistry.json`
- [ ] Added `label: LabelComponent` to the `componentMap`
- [ ] Added a test label to `src/config/dashboardItems.json`
- [ ] Refreshed the browser and saw it work!

**If you checked all of these, you've mastered the component creation system!** 🎓

---

## 🚀 Ready for More?

Once you're comfortable with this pattern, you can create:
- **Button Component** (add `onClick` handling)  Difficulty: ⭐ Easy
- **Icon Button Component** (add `onClick` handling) Difficulty: ⭐ Easy
- **Image Component** (display images from URLs) Difficulty: Difficulty: ⭐⭐ Medium
- **List Component** (render arrays of items) Difficulty: ⭐⭐ Medium
- **Badge Component** (small notification badges) Difficulty: ⭐⭐ Medium
- Any custom component you can imagine!

And then is time to start with components needed for this Dashboard project
- **NumericDisplay Component** (NumericDisplay component that shows sensor values with units and color-coded status indicators.)
  - Step 1: [NumericDisplay component - Task description on the board](https://github.com/hoss-java/Dashboard-Project/issues/2), Difficulty: ⭐⭐ Medium
    - Step 2: [Update NumericDisplay to Listen for Live Data Changes](https://github.com/hoss-java/Dashboard-Project/issues/7) , Difficulty: ⭐⭐ Medium

- **BinarySwitch Component** (BinarySwitch component for toggle functionality with ON/OFF states.)
  - Step 1: [BinarySwitch component - Task description on the board](https://github.com/hoss-java/Dashboard-Project/issues/3) , Difficulty: ⭐⭐ Medium
    - Step 2: [Update BinarySwitch to Listen for Live Data Changes](https://github.com/hoss-java/Dashboard-Project/issues/8), Difficulty: ⭐⭐ Medium

- **HistoryDiagram Component** (HistoryDiagram component that displays historical data as a line chart with axes and grid lines.)
  - Step 1: [HistoryDiagram component - Task description on the board](https://github.com/hoss-java/Dashboard-Project/issues/4), Difficulty: ⭐⭐⭐ Hard
    - Step 2: [Update HistoryDiagram to Listen for Live Data Changes](https://github.com/hoss-java/Dashboard-Project/issues/9),  Difficulty: ⭐⭐ Medium

The process is always the same:
1. Add type to `types.ts`
2. Create component file
3. Import in registry
4. Add to JSON configs
5. Test in dashboard
