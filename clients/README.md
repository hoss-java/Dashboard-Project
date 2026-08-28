# Dynamic Component Renderer - Architecture Guide

## 🚀 Quick Start - Let's Play with Code

**Before diving into architecture, let's make some changes to see the system in action!**

This section shows you how to modify the app without touching complex code. You're just editing JSON files and seeing instant results.

---

### 🎨 1: Change the App Title

**What you'll do**: Change the title that appears in the top bar of your app.

**File to edit**: `public/manifest.json`

**Step 1**: Open `public/manifest.json`

```json
{
  "short_name": "Dashboard App",
  "name": "My Awesome Dashboard",
  "icons": [...],
  ...
}
```

**Step 2**: Change the `"name"` field to something you like:

```json
{
  "short_name": "Dashboard App",
  "name": "🎓 My Learning Dashboard",
  ...
}
```

**Step 3**: Save the file and refresh your browser (or restart the dev server)

✨ **Result**: The title in your AppBar changes instantly!

**Why this works**: `DashboardPanel.tsx` reads the manifest and displays the title. See `src/components/DashboardPanel.tsx` to learn how.

---

### 📝 2: Add a New Text Card to Your Dashboard

**What you'll do**: Add a new card with some text below the existing content.

**File to edit**: `src/config/dashboardItems.json`

**Step 1**: Open `src/config/dashboardItems.json`

You'll see something like:

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
      }
    ]
  }
]
```

**Step 2**: Add a new card inside the `items` array. Copy this and paste it after the existing card:

```json
{
  "id": "card-2",
  "type": "card",
  "title": "My New Card",
  "footer": "Created by me! 🎉",
  "items": [
    {
      "id": "card-2-text-1",
      "type": "text",
      "content": "This is my first custom card!"
    },
    {
      "id": "card-2-text-2",
      "type": "text",
      "content": "I added this without touching any React code!"
    }
  ]
}
```

**Step 3**: Save the file and refresh your browser

✨ **Result**: A new card appears on your dashboard with your custom text!

**Your JSON should now look like**:

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
        "id": "card-2",
        "type": "card",
        "title": "My New Card",
        "footer": "Created by me! 🎉",
        "items": [
          {
            "id": "card-2-text-1",
            "type": "text",
            "content": "This is my first custom card!"
          },
          {
            "id": "card-2-text-2",
            "type": "text",
            "content": "I added this without touching any React code!"
          }
        ]
      }
    ]
  }
]
```

**Why this works**: `ItemRenderer.tsx` reads the JSON and dynamically renders components based on the `type` field. The system doesn't care if you have 1 card or 100 cards — it just loops and renders!

---

### 🎯 3: Change Global Styling

**What you'll do**: Change the default padding, gap, and font size for all components.

**File to edit**: `src/config/defaultStyle.json`

**Step 1**: Open `src/config/defaultStyle.json`

```json
{
  "align": "center",
  "padding": 12,
  "gap": 8,
  "showBorder": false,
  "borderColor": "#ccc",
  "fontSize": 14,
  "fontWeight": "normal",
  "backgroundColor": "#fff"
}
```

**Step 2**: Try changing these values:

```json
{
  "align": "center",
  "padding": 24,           // ← Increased from 12
  "gap": 16,               // ← Increased from 8
  "showBorder": true,      // ← Changed from false
  "borderColor": "#2196F3", // ← Changed to blue
  "fontSize": 16,          // ← Increased from 14
  "fontWeight": "bold",    // ← Changed from normal
  "backgroundColor": "#f5f5f5"  // ← Changed to light gray
}
```

**Step 3**: Save and refresh your browser

✨ **Result**: Everything looks different! More space between items, larger text, borders around boxes, etc.

**Why this works**: Every component uses `resolveValue()` to pick styling. It checks: *"Does the item have this property? If not, use the default style."* See `src/components/utils/resolveValue.ts` to understand the priority chain.

---

### 🏪 4: Customize a Single Item

**What you'll do**: Override the global style for just one card.

**File to edit**: `src/config/dashboardItems.json`

**Step 1**: Find the card you want to customize (let's use `card-2`)

**Step 2**: Add custom properties directly to it:

```json
{
  "id": "card-2",
  "type": "card",
  "title": "My Special Card",
  "footer": "I have custom styling!",
  "padding": 32,              // ← Override global padding
  "gap": 20,                  // ← Override global gap
  "backgroundColor": "#ffe0b2", // ← Override global background
  "items": [
    {
      "id": "card-2-text-1",
      "type": "text",
      "content": "This card has special styling!",
      "fontSize": 20,         // ← Override global font size
      "fontWeight": "bold"    // ← Override font weight
    }
  ]
}
```

**Step 3**: Save and refresh

✨ **Result**: Only that one card has the custom styling. Everything else stays the same!

**Why this works**: The value resolution priority is:
1. **Item property** (if it exists, use it) ✅
2. **Default style** (if item doesn't have it, use this)
3. **Hardcoded fallback** (if default style doesn't have it, use this)

---

### 💡 What You Just Learned

By playing with these JSON files, you've discovered:

| What You Did | What You Learned |
|---|---|
| Changed `manifest.json` | The app reads external configuration files |
| Added a card in JSON | You can control the UI structure without touching React |
| Changed `defaultStyle.json` | Global styles apply to all components |
| Customized a single item | Item-level properties override global defaults |

**This is the core idea of this system**: *Data (JSON) drives the UI, not hardcoded React components.*

---

### 🔍 Next Steps

- Experiment! Try adding more cards, changing colors, adjusting spacing
- When you're comfortable with JSON changes, read the **Architecture** section below to understand how it all works
- Then try **creating your own component** using the guide at the bottom

Ready to go deeper? Continue reading below... 👇

---

## 🎯 Overview

This is a **learning-friendly React application** that demonstrates how to build a **dynamic, registry-based component rendering system**. Instead of hardcoding components, this system loads components from a registry and renders them based on configuration files.

### Core Concept

```
JSON Data → Registry Lookup → Component Render → UI Display
```

## 🎯 Overview

This is a **learning-friendly React application** that demonstrates how to build a **dynamic, registry-based component rendering system**. Instead of hardcoding components, this system loads components from a registry and renders them based on configuration files.

### Core Concept

```
JSON Data → Registry Lookup → Component Render → UI Display
```

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Startup                      │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────┐
        │  App.tsx (Entry Point)      │
        └──────────┬──────────────────┘
                   │
                   ▼
        ┌─────────────────────────────┐
        │  HomePage.tsx               │
        │  (Routes to DashboardPanel) │
        └──────────┬──────────────────┘
                   │
                   ▼
        ┌──────────────────────────────────────┐
        │  DashboardPanel.tsx                  │
        │  • Loads dashboardItems.json         │
        │  • Loads defaultStyle.json           │
        │  • Renders AppBar + Content Area     │
        └──────────┬───────────────────────────┘
                   │
                   ▼
        ┌──────────────────────────────────────┐
        │  ItemRenderer.tsx (Router)           │
        │  • Reads item.type                   │
        │  • Looks up in ComponentRegistry     │
        │  • Renders matching component        │
        └──────────┬───────────────────────────┘
                   │
         ┌─────────┼─────────┐
         ▼         ▼         ▼
    ┌─────────┐ ┌─────────┐ ┌───────────┐
    │ Text    │ │ Box     │ │ Card      │
    │Component│ │Component│ │Component  │
    └─────────┘ └─────────┘ └───────────┘
         │         │         │
         └─────────┼─────────┘
                   ▼
            ┌─────────────────┐
            │   UI Display    │
            └─────────────────┘
```

---

## 📦 File-by-File Breakdown

### **Entry Point**

| File | Purpose |
|------|---------|
| `src/index.tsx` | Application bootstrap; renders `App.tsx` into the DOM |
| `src/App.tsx` | Root component; sets up routing and global layout |

---

### **Page Layer**

| File | Purpose |
|------|---------|
| `src/pages/HomePage.tsx` | Main page that renders `DashboardPanel` |

---

### **Component System** (`src/components/`)

| File | Purpose |
|------|---------|
| `src/components/DashboardPanel.tsx` | **Main UI Layout**: Renders AppBar with title + content area; loads `dashboardItems.json` and `defaultStyle.json`; passes items to `ItemRenderer` |
| `src/components/WelcomeScreen.tsx` | Welcome/empty state component (optional) |

---

### **Registry System** (`src/components/renderers/`)

| File | Purpose |
|------|---------|
| `src/components/config/componentRegistry.json` | **Component Metadata**: Defines all available components (`type`, `displayName`, `description`, `path`, `fileName`) |
| `src/components/renderers/ComponentRegistry.ts` | **Registry Class**: Singleton that loads component metadata from JSON; maps types to imported React components; provides `getComponent(type)` method |
| `src/components/renderers/ItemRenderer.tsx` | **Router Component**: Receives an `item` object; looks up the component in registry by `item.type`; renders it dynamically; handles unknown types with fallback UI |

---

### **Built-in Components** (`src/components/renderers/`)

| File | Purpose |
|------|---------|
| `src/components/renderers/Text/TextComponent.tsx` | Renders text with typography styling; supports `fontSize`, `fontWeight`, `content` from item or `defaultStyle` |
| `src/components/renderers/Box/BoxComponent.tsx` | Container component; renders nested items; supports `padding`, `gap`, `align`, `showBorder`, `borderColor`, `backgroundColor` |
| `src/components/renderers/Card/CardComponent.tsx` | Material UI Card; supports title (CardHeader), nested items (CardContent), footer (Box); styling via `defaultStyle` or item props |

---

### **Type Definitions** (`src/components/`)

| File | Purpose |
|------|---------|
| `src/components/types.ts` | **Central Type Hub**: Defines `Item`, `ItemType`, `ItemRendererProps`, `DefaultStyle`, and component-specific types (`TextItemStyle`, `BoxItemStyle`, `CardItemStyle`) |

---

### **Utilities** (`src/components/utils/`)

| File | Purpose |
|------|---------|
| `src/components/utils/resolveValue.ts` | **Value Resolution**: Priority-based fallback system; resolves values from item → defaultStyle → hardcoded defaults |

---

### **Configuration Files** (`src/config/`)

| File | Purpose | Example |
|------|---------|---------|
| `src/config/dashboardItems.json` | **Item Hierarchy**: Defines the structure and content to render (nested tree of items with type, properties) | See Data Structure section below |
| `src/config/defaultStyle.json` | **Global Defaults**: Fallback styling applied to all items (padding, gap, fontSize, borderColor, etc.) | See Data Structure section below |

---

### **Context & Hooks** (`src/contexts/`, `src/hooks/`)

| File | Purpose |
|------|---------|
| `src/contexts/DashboardContext.tsx` | Global state management for dashboard (optional; can store selected items, user preferences) |
| `src/hooks/useManifest.ts` | Hook to access application manifest or metadata |

---

## 🔌 How the Registry Works

### **Step 1: Registry Initialization**

When the app starts, `ComponentRegistry` (singleton) does this:

1. Reads `src/components/config/componentRegistry.json`
2. For each component in the JSON:
   - Looks up the component class in `componentMap` (e.g., `TextComponent`, `BoxComponent`)
   - Stores it in an internal `Map<string, ComponentConfig>`

**Location**: `src/components/renderers/ComponentRegistry.ts`

---

### **Step 2: Component Lookup**

When `ItemRenderer` needs to render an item:

1. Calls `componentRegistry.getComponent(item.type)`
2. Returns the `ComponentConfig` (component class + metadata)
3. Renders the component if found; otherwise, shows fallback UI

**Location**: `src/components/renderers/ItemRenderer.tsx`

---

### **Step 3: Component Rendering**

The matched component (Text, Box, or Card) receives:

- `item`: The data object (contains type, custom properties)
- `defaultStyle`: Global fallback styles
- `onItemClick`: Callback for click events

The component uses `resolveValue()` to determine final property values:

```
Final Value = item.property ?? defaultStyle.property ?? hardcoded default
```

**Locations**: 
- Text: `src/components/renderers/Text/TextComponent.tsx`
- Box: `src/components/renderers/Box/BoxComponent.tsx`
- Card: `src/components/renderers/Card/CardComponent.tsx`

---

## 📋 Data Structures

### **dashboardItems.json Format**

```json
[
  {
    "id": "main-container",
    "type": "box",
    "padding": 16,
    "gap": 12,
    "items": [
      {
        "id": "title",
        "type": "text",
        "content": "Welcome to Dashboard",
        "fontSize": 24,
        "fontWeight": "bold"
      },
      {
        "id": "card-1",
        "type": "card",
        "title": "Card Title",
        "footer": "Card Footer",
        "items": [
          {
            "id": "card-text",
            "type": "text",
            "content": "Card content goes here"
          }
        ]
      }
    ]
  }
]
```

**Key Points**:
- Every item must have `id` and `type`
- `type` must match a registered component (e.g., "text", "box", "card")
- Custom properties (e.g., `padding`, `fontSize`, `content`) are read directly from the item
- Nested items go in the `items` array (supported by Box and Card)

---

### **defaultStyle.json Format**

```json
{
  "align": "center",
  "padding": 12,
  "gap": 8,
  "showBorder": false,
  "borderColor": "#ccc",
  "fontSize": 14,
  "fontWeight": "normal",
  "backgroundColor": "#fff"
}
```

**Applied To**: All items that don't explicitly define these properties.

---

### **componentRegistry.json Format**

```json
{
  "components": [
    {
      "type": "text",
      "displayName": "Text Component",
      "description": "Displays text with typography styling",
      "path": "Text",
      "fileName": "TextComponent"
    },
    {
      "type": "box",
      "displayName": "Box Component",
      "description": "A container that accepts nested items",
      "path": "Box",
      "fileName": "BoxComponent"
    },
    {
      "type": "card",
      "displayName": "Card Component",
      "description": "A Material UI card with optional title, footer, and nested items",
      "path": "Card",
      "fileName": "CardComponent"
    }
  ]
}
```

---

## 🎓 How to Add Your Own Component

### **Step 1: Create Component File**

Create `src/components/renderers/YourComponent/YourComponent.tsx`:

```typescript
import React from 'react';
import { Box } from '@mui/material';
import { ItemRendererProps } from '../../types';

const YourComponent: React.FC<ItemRendererProps> = ({ item, defaultStyle }) => {
  return (
    <Box sx={{ padding: item.padding ?? defaultStyle?.padding ?? 8 }}>
      {item.customProperty || 'Default content'}
    </Box>
  );
};

export default YourComponent;
```

---

### **Step 2: Register in componentRegistry.json**

Add to `src/components/config/componentRegistry.json`:

```json
{
  "type": "yourComponent",
  "displayName": "Your Component",
  "description": "What your component does",
  "path": "YourComponent",
  "fileName": "YourComponent"
}
```

---

### **Step 3: Import in ComponentRegistry.ts**

Add to `src/components/renderers/ComponentRegistry.ts`:

```typescript
import YourComponent from './YourComponent/YourComponent';

// In componentMap:
const componentMap: Record<string, FC<any>> = {
  // ... existing components
  yourComponent: YourComponent,
};
```

---

### **Step 4: Use in dashboardItems.json**

```json
{
  "id": "my-custom-item",
  "type": "yourComponent",
  "customProperty": "Hello World"
}
```

---

## 🎯 Key Design Principles

| Principle | Benefit |
|-----------|---------|
| **Registry Pattern** | Components are discovered dynamically; easy to add new ones without changing core logic |
| **JSON-Driven** | UI structure lives in data, not code; perfect for learning how data shapes UI |
| **Value Resolution** | Item property → defaultStyle → hardcoded default; predictable fallback chain |
| **Type Safety** | Centralized types in `src/components/types.ts` prevent runtime errors |
| **Component Isolation** | Each component (Text, Box, Card) is independent; easy to understand and modify |

---

## 📚 Quick Navigation

- **Want to change UI layout?** → Edit `src/components/DashboardPanel.tsx`
- **Want to add global styles?** → Edit `src/config/defaultStyle.json`
- **Want to change content?** → Edit `src/config/dashboardItems.json`
- **Want to add a component?** → Follow "How to Add Your Own Component" above
- **Want to understand types?** → See `src/components/types.ts`
- **Want to see how rendering works?** → Check `src/components/renderers/ItemRenderer.tsx`

---

## 🔗 Component Flow Checklist

- [ ] `dashboardItems.json` defines items with `type` field
- [ ] `DashboardPanel.tsx` loads items and passes to `ItemRenderer`
- [ ] `ItemRenderer.tsx` reads `item.type` and calls `componentRegistry.getComponent()`
- [ ] `ComponentRegistry.ts` looks up component in `Map` and returns it
- [ ] Component renders using `item` properties + `defaultStyle` fallbacks
- [ ] `resolveValue()` handles priority-based value selection
- [ ] Click handlers log to console and call optional `onItemClick` callback

---

# Component System

## Architecture

```
Item (JSON) 
  ↓
ItemRenderer.tsx (Router)
  ├─ Reads item.type
  ├─ Calls ComponentRegistry.getComponent(type)
  └─ Renders matching component
     ├─ TextComponent
     ├─ BoxComponent
     └─ CardComponent
```

## Value Resolution Priority

```
┌──────────────────────┐
│   item.property      │  ← First (item-specific)
└──────────┬───────────┘
           │ (if undefined)
           ▼
┌──────────────────────┐
│ defaultStyle.prop    │  ← Second (global fallback)
└──────────┬───────────┘
           │ (if undefined)
           ▼
┌──────────────────────┐
│ Hardcoded Default    │  ← Third (component default)
└──────────────────────┘
```

See `src/components/utils/resolveValue.ts` for implementation.
```

---

### **`src/config/README.md`** – Configuration Guide

```markdown
# Configuration Files

## dashboardItems.json

**Purpose**: Defines the tree of items to render

**Structure**:
- Array of `Item` objects
- Each item has `id`, `type`, and optional custom properties
- Nested items via `items` array (Box and Card support this)

**Example**: See `src/config/dashboardItems.json`

---

## defaultStyle.json

**Purpose**: Global fallback styles for all items

**Applied**: When item doesn't specify a property, `defaultStyle` is used

**Properties**:
- `padding`, `gap`, `align`
- `fontSize`, `fontWeight`
- `showBorder`, `borderColor`, `backgroundColor`

**Example**: See `src/config/defaultStyle.json`
```

---

## 🛠️ Ready to Create Your Own Component

Once you're comfortable with the basics above, you're ready to build your own custom renderer!

**Read the detailed guide**: [`src/components/README.md`](./src/components/README.md)

That guide walks you through:
- How the component registry works
- Step-by-step instructions to add a new component type
- Real code examples you can follow

