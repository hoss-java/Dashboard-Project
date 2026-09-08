# DashboardPanel Component

**Location**: `src/components/DashboardPanel.tsx`

The **main layout container** — orchestrates the top bar, content area, and renders the item hierarchy from JSON.

---

## Overview

| Aspect | Details |
|--------|---------|
| **Purpose** | Main page layout: app bar + scrollable content area |
| **Data Source** | Static import of `dashboardItems.json` |
| **Global Styles** | Static import of `defaultStyle.json` |
| **Renders** | `ItemRenderer` for each top-level item |
| **Layout** | Flex column, 100vh height, top-aligned content, scrollable |

---

## Component Structure

```
┌─────────────────────────────────────────┐
│         AppBar (title from manifest)    │  ← renderAppBar()
├─────────────────────────────────────────┤
│  Content Wrapper (gray bg, flex column) │  ← getContentWrapperSx()
│  ┌─────────────────────────────────────┐│
│  │  Content Box (white card, max-w)    ││  ← getContentBoxSx()
│  │  ┌───────────────────────────────┐  ││
│  │  │ ItemRenderer (item 1)         │  ││
│  │  ├───────────────────────────────┤  ││
│  │  │ ItemRenderer (item 2)         │  ││
│  │  ├───────────────────────────────┤  ││
│  │  │ ItemRenderer (item N)         │  ││
│  │  └───────────────────────────────┘  ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

---

## Props

```typescript
interface DashboardPanelProps {
  onClose?: () => void;
}
```

| Prop | Type | Purpose |
|------|------|---------|
| `onClose?` | `() => void` | Optional callback when panel closes (currently unused) |

---

## Key Features

### 1. **App Bar with Manifest Title**

```typescript
const renderAppBar = () => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        {manifest.name}
      </Typography>
    </Toolbar>
  </AppBar>
);
```

- **Fetches app title** from `useManifest()` hook
- Static positioning (stays at top, doesn't scroll)
- Uses Material-UI `AppBar` + `Toolbar` + `Typography`

---

### 2. **Content Wrapper (Gray Background)**

```typescript
const getContentWrapperSx = () => ({
  flex: 1,                    // Takes remaining vertical space
  display: 'flex',
  flexDirection: 'column',    // Stack children vertically
  alignItems: 'center',       // Center children horizontally
  bgcolor: '#f5f5f5',         // Light gray background
  p: 2,                       // Padding
  overflowY: 'auto',          // Scrollable if content exceeds
});
```

**Purpose**: Creates scrollable outer container with centered alignment

---

### 3. **Content Box (White Card)**

```typescript
const getContentBoxSx = () => ({
  bgcolor: 'white',           // White background
  p: 4,                       // Padding inside card
  borderRadius: 1,            // Subtle rounded corners
  boxShadow: 1,               // Subtle shadow
  maxWidth: 800,              // Max width constraint
  width: '100%',              // Full wrapper width (up to max)
});
```

**Purpose**: Creates visually distinct white card that contains items

---

### 4. **Data Loading & State**

```typescript
const [items, setItems] = useState<Item[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  setItems((dashboardItems.items || []) as Item[]);
  setLoading(false);
}, []);
```

- Loads items from **static JSON import** (not dynamic fetch)
- Type-casts to `Item[]` (resolves TypeScript literal type mismatch)
- Sets `loading` to `false` immediately after assignment
- **Note**: Static import means data is bundled at build time

---

### 5. **Item Click Handler**

```typescript
const handleItemClick = (itemId: string, item: Item) => {
  console.info('[DashboardPanel] clicked:', item.id);
};
```

- Receives `itemId` (string) and full `item` object
- Currently logs to console
- Passed to **every** `ItemRenderer` via props
- Bubbles up from nested components

---

## Data Flow

```
dashboardItems.json (static import)
          ↓
    setItems()
          ↓
    items state
          ↓
    map over items
          ↓
    <ItemRenderer key={item.id} item={item} defaultStyle={...} onItemClick={...} />
          ↓
    ItemRenderer routes by type to BoxComponent, TextComponent, or CardComponent
          ↓
    Nested items rendered recursively
```

---

## Styling Strategy

### Layout Hierarchy

| Element | Flex Direction | Alignment | Purpose |
|---------|----------------|-----------|---------|
| **Root Box** | `column` | N/A | Main vertical container |
| **Content Wrapper** | `column` | `center` | Scrollable container, centers content |
| **Content Box** | N/A | N/A | White card, max-width 800px |

### Spacing

- `AppBar`: No padding (full-width bar)
- `Content Wrapper`: `p: 2` (padding around edges)
- `Content Box`: `p: 4` (padding inside white card)
- `Items`: Spacing managed by individual components (Box/Text/Card)

---

## Type Safety

```typescript
import type { 
  DefaultStyle,
  Item,
} from './types';
```

- **Item**: Individual dashboard item (has `id`, `type`, properties)
- **DefaultStyle**: Global style defaults (has `fontSize`, `fontWeight`, `padding`, etc.)

Both imported from centralized `types.ts`

---

## Integration Points

| Component/Hook | Used For | Location |
|----------------|----------|----------|
| `useManifest()` | App title in AppBar | `src/hooks/useManifest.ts` |
| `dashboardItems.json` | Item hierarchy | `src/config/dashboardItems.json` |
| `defaultStyle.json` | Global defaults | `src/config/defaultStyle.json` |
| `ItemRenderer` | Rendering each item | `src/components/renderers/ItemRenderer.tsx` |

---

## Key Decisions

✅ **Static data loading** — Simplifies code, no async complexity  
✅ **Centered, scrollable layout** — Top-aligned with gray background  
✅ **White content card** — Visual separation and polish  
✅ **Type casting `as Item[]`** — Resolves literal type mismatch from JSON import  
✅ **Helper functions for SX** — Keeps render method clean, enables reuse  
✅ **Click handler bubbling** — Parent can track clicks from deeply nested items  

---

## Potential Extensions

### Add a Close Button
```typescript
const renderAppBar = () => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        {manifest.name}
      </Typography>
      {onClose && (
        <IconButton color="inherit" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      )}
    </Toolbar>
  </AppBar>
);
```

### Track Item Clicks
```typescript
const handleItemClick = (itemId: string, item: Item) => {
  console.info('[DashboardPanel] clicked:', item.id);
  // Example: send analytics, open modal, navigate, etc.
};
```

### Dynamic Item Loading
```typescript
useEffect(() => {
  const loadItems = async () => {
    const response = await fetch('/api/dashboard-items');
    const data = await response.json();
    setItems(data.items as Item[]);
    setLoading(false);
  };
  loadItems();
}, []);
```

---

## Summary

**DashboardPanel** is the **orchestrator** — it:
1. Loads data from `dashboardItems.json`
2. Passes global `defaultStyle.json` to all renderers
3. Renders each top-level item via `ItemRenderer`
4. Provides a clean, scrollable, card-based layout
5. Bubbles click events up for potential parent handling

