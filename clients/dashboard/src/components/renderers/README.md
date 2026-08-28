# ComponentRegistry & ItemRenderer

**Locations**:
- `src/components/renderers/ComponentRegistry.ts`
- `src/components/renderers/ItemRenderer.tsx`

These two files form the **core routing and registration system** that makes the entire renderer architecture work.

---

## What They Do

| File | Purpose |
|------|---------|
| **ComponentRegistry** | Maps component types (like `'text'`, `'box'`) to actual React components |
| **ItemRenderer** | Looks up a component in the registry by `item.type` and renders it dynamically |

Think of it like a **restaurant menu** (registry) and a **waiter** (renderer):
- Registry = menu listing all dishes and their recipes
- ItemRenderer = waiter who reads your order and fetches the right dish from the kitchen

---

## ComponentRegistry

### What It Does

Maintains a **singleton Map** that connects type strings to React components.

```
'text'  → TextComponent
'box'   → BoxComponent
'card'  → CardComponent
```

### Constructor & Registration

On creation, `ComponentRegistry`:
1. Reads `componentRegistry.json` (the config file listing all available components)
2. Uses `componentMap` to match each config to the actual imported component
3. Stores the pairing in a `Map<string, ComponentConfig>`

### Key Methods

| Method | Returns | Purpose |
|--------|---------|---------|
| `getComponent(type: string)` | `ComponentConfig \| undefined` | Look up a component by type |
| `getAllComponents()` | `ComponentConfig[]` | Get all registered components |

### ComponentConfig Interface

```typescript
interface ComponentConfig {
  component: FC<any>;           // The actual React component
  displayName: string;          // User-friendly name (e.g., "Text")
  description?: string;         // What it does
  path: string;                 // File path (e.g., "src/components/renderers/components/Text")
  fileName: string;             // File name (e.g., "TextComponent.tsx")
}
```

### Singleton Pattern

```typescript
export const componentRegistry = new ComponentRegistry();
```

Only **one instance** exists per app. Every file imports this same instance.

---

## ItemRenderer

### What It Does

A **routing component** that:
1. Takes an `item` object with a `type` property
2. Asks the registry: "Do you have a component for this type?"
3. If yes → renders it with the item data
4. If no → shows an error message

### How It Works

```typescript
const config = componentRegistry.getComponent(item.type);

if (!config) {
  // Show error for unknown types
  return <div>Unknown component type: {item.type}</div>;
}

const Component = config.component;
return <Component item={item} onItemClick={onItemClick} />;
```

### Props

| Prop | Type | Purpose |
|------|------|---------|
| `item` | `Item` | The data object with `type`, `id`, and component-specific properties |
| `defaultStyle` | `DefaultStyle \| undefined` | Global defaults passed down (though note: not destructured in current code) |
| `onItemClick` | `(itemId: string, item: Item) => void \| undefined` | Callback when a component is clicked |

### Error Handling

If a component type is **not registered**, you get:
```
Unknown component type: my-custom-type
```

(Red text on red border for visibility)

---

## Data Flow

```
dashboardItems.json (JSON data)
        ↓
DashboardPanel (reads JSON)
        ↓
ItemRenderer (receives item with type: 'text')
        ↓
ComponentRegistry.getComponent('text')
        ↓
Returns TextComponent
        ↓
TextComponent renders with item data
```

---

## How to Add a New Component

### Step 1: Create the Component
```typescript
// src/components/renderers/components/Label/LabelComponent.tsx
export const LabelComponent: React.FC<ItemRendererProps> = ({ item, onItemClick }) => {
  return <div>{item.label}</div>;
};
export default LabelComponent;
```

### Step 2: Import in ComponentRegistry
```typescript
import LabelComponent from './components/Label/LabelComponent';

const componentMap: Record<string, FC<any>> = {
  text: TextComponent,
  box: BoxComponent,
  card: CardComponent,
  label: LabelComponent,  // ← Add here
};
```

### Step 3: Add to componentRegistry.json
```json
{
  "components": [
    { "type": "text", "displayName": "Text", ... },
    { "type": "label", "displayName": "Label", "path": "src/components/renderers/components/Label", "fileName": "LabelComponent.tsx" }
  ]
}
```

### Step 4: Use in dashboardItems.json
```json
{
  "id": "my-label",
  "type": "label",
  "label": "Click me!"
}
```

---

## Key Constraints

✅ **Each component receives `ItemRendererProps`** — standardized interface  
✅ **Registry is a singleton** — one source of truth  
✅ **No hard-coded type checking** — new types just need registration  
✅ **Error handling for unknown types** — graceful fallback  
✅ **Config-driven** — `componentRegistry.json` is the source of truth

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Unknown component type" error | Make sure component is imported in `ComponentRegistry` and added to `componentMap` |
| Component not rendering | Check `componentRegistry.json` — is the type listed there? |
| Props not reaching component | Verify component extends `ItemRendererProps` and accepts props correctly |
| Singleton not updating | Don't create new instances — import the exported `componentRegistry` singleton |

