# Config Files: dashboardItems.json & defaultStyle.json

**Location**: `src/config/`

These **two static JSON files** drive the entire dashboard — one defines the item hierarchy and structure, the other defines global style defaults.

---

## Overview

| File | Purpose | Contains | Used By |
|------|---------|----------|---------|
| **dashboardItems.json** | Item hierarchy & structure | Array of nested items with types, IDs, properties | `DashboardPanel` → `ItemRenderer` |
| **defaultStyle.json** | Global style defaults | Font sizes, weights, spacing, colors | Every `ItemRenderer` child component |

---

## dashboardItems.json

**What it is**: The **content and structure** of your dashboard — a tree of items.

### Basic Structure

```json
{
  "items": [
    {
      "id": "unique-identifier",
      "type": "text",
      "content": "Hello, World!"
    },
    {
      "id": "another-item",
      "type": "box",
      "items": [
        { "id": "nested-1", "type": "text", "content": "Nested text" }
      ]
    }
  ]
}
```

### Complete Example

```json
{
  "items": [
    {
      "id": "title",
      "type": "text",
      "content": "Dashboard Title",
      "fontSize": 28,
      "fontWeight": "bold"
    },
    {
      "id": "intro-box",
      "type": "box",
      "padding": 3,
      "gap": 2,
      "backgroundColor": "#fffacd",
      "showBorder": true,
      "borderColor": "#daa520",
      "items": [
        {
          "id": "intro-text",
          "type": "text",
          "content": "Welcome! Edit dashboardItems.json to customize this content."
        }
      ]
    },
    {
      "id": "card-1",
      "type": "card",
      "title": "Getting Started",
      "gap": 2,
      "items": [
        {
          "id": "card-text-1",
          "type": "text",
          "content": "This is card content. Add more items inside!"
        },
        {
          "id": "card-box",
          "type": "box",
          "gap": 1,
          "items": [
            {
              "id": "nested-label",
              "type": "text",
              "content": "Nested inside a box inside a card!"
            }
          ]
        }
      ],
      "footer": "Card footer text"
    },
    {
      "id": "grid-box",
      "type": "box",
      "padding": 2,
      "gap": 1,
      "items": [
        {
          "id": "grid-item-1",
          "type": "text",
          "content": "Item 1"
        },
        {
          "id": "grid-item-2",
          "type": "text",
          "content": "Item 2"
        },
        {
          "id": "grid-item-3",
          "type": "text",
          "content": "Item 3"
        }
      ]
    }
  ]
}
```

---

## defaultStyle.json

**What it is**: The **global fallback styles** applied to all items when they don't specify their own values.

### Basic Structure

```json
{
  "align": "left",
  "padding": 2,
  "gap": 1,
  "showBorder": false,
  "borderColor": "#e0e0e0",
  "fontSize": 16,
  "fontWeight": "normal"
}
```

### What Each Property Does

| Property | Type | Default | Used By | Purpose |
|----------|------|---------|---------|---------|
| `align` | `string` | `"left"` | BoxComponent | Text alignment: `"left"`, `"center"`, `"right"` |
| `padding` | `number` | `2` | Box, Card | MUI spacing units (0–8) |
| `gap` | `number` | `1` | Box, Card | Space between child items |
| `showBorder` | `boolean` | `false` | Box, Card | Display border around component |
| `borderColor` | `string` | `"#e0e0e0"` | Box, Card | Border color (hex, named, rgb) |
| `fontSize` | `number` | `16` | TextComponent | Font size in pixels |
| `fontWeight` | `string` | `"normal"` | TextComponent | `"normal"`, `"bold"`, `"lighter"` |
| `backgroundColor` | `string` | varies | Box, Card | Background color (hex, named, rgb) |

### Complete Example

```json
{
  "align": "center",
  "padding": 3,
  "gap": 2,
  "showBorder": true,
  "borderColor": "#1976d2",
  "fontSize": 14,
  "fontWeight": "normal",
  "backgroundColor": "#f5f5f5"
}
```

---

## Value Resolution: How They Work Together

### Priority Chain (in each component)

When a component renders, it resolves values in this order:

```
1. Item-level property (dashboardItems.json)
   ↓ (if undefined)
2. Global default (defaultStyle.json)
   ↓ (if undefined)
3. Hardcoded fallback (in component code)
```

### Example: TextComponent Rendering

**dashboardItems.json item**:
```json
{
  "id": "my-text",
  "type": "text",
  "content": "Hello",
  "fontSize": 20
  // fontWeight is NOT specified
}
```

**defaultStyle.json**:
```json
{
  "fontSize": 16,
  "fontWeight": "bold"
}
```

**Resolution**:
```typescript
const fontSize = resolveValue(
  item.fontSize,           // 20 ✓
  defaultStyle.fontSize,   // (not checked, 20 found)
  16                       // (not checked)
);
// Result: 20

const fontWeight = resolveValue(
  item.fontWeight,           // undefined
  defaultStyle.fontWeight,   // "bold" ✓
  "normal"                   // (not checked)
);
// Result: "bold"

const content = resolveValue(
  item.content,           // "Hello" ✓
  defaultStyle.content,   // (not checked)
  ""                      // (not checked)
);
// Result: "Hello"
```

---

## Common Patterns

### Pattern 1: Override Specific Item

Set a value **only** in the item; use defaults for everything else.

**dashboardItems.json**:
```json
{
  "id": "big-title",
  "type": "text",
  "content": "Large Title",
  "fontSize": 32
}
```

**defaultStyle.json**:
```json
{
  "fontSize": 16,
  "fontWeight": "normal"
}
```

**Result**: 32px normal-weight text (fontSize overridden, fontWeight from default)

---

### Pattern 2: Use Defaults for Everything

Omit properties from items; let defaults apply globally.

**dashboardItems.json**:
```json
{
  "id": "text-1",
  "type": "text",
  "content": "Standard text"
},
{
  "id": "text-2",
  "type": "text",
  "content": "More standard text"
}
```

**defaultStyle.json**:
```json
{
  "fontSize": 18,
  "fontWeight": "bold"
}
```

**Result**: Both texts are 18px bold (all from defaults)

---

### Pattern 3: Nested Box with Custom Spacing

**dashboardItems.json**:
```json
{
  "id": "custom-box",
  "type": "box",
  "padding": 4,
  "gap": 3,
  "items": [
    { "id": "item-1", "type": "text", "content": "Item 1" },
    { "id": "item-2", "type": "text", "content": "Item 2" }
  ]
}
```

**defaultStyle.json**:
```json
{
  "padding": 2,
  "gap": 1
}
```

**Result**: Box uses `padding: 4` and `gap: 3` (from item), text inside uses defaults for fontSize/fontWeight

---

## Component-Specific Usage

### TextComponent Properties

```json
{
  "id": "text-item",
  "type": "text",
  "content": "Your text here",
  "fontSize": 16,
  "fontWeight": "bold"
}
```

**Defaults from defaultStyle.json**:
```json
{
  "fontSize": 16,
  "fontWeight": "normal",
  "content": ""
}
```

---

### BoxComponent Properties

```json
{
  "id": "box-item",
  "type": "box",
  "padding": 2,
  "gap": 1,
  "align": "center",
  "showBorder": true,
  "borderColor": "#ccc",
  "backgroundColor": "#fff",
  "items": [
    { "id": "child-1", "type": "text", "content": "Child" }
  ]
}
```

**Defaults from defaultStyle.json**:
```json
{
  "padding": 2,
  "gap": 1,
  "align": "left",
  "showBorder": false,
  "borderColor": "#e0e0e0",
  "backgroundColor": "#fafafa"
}
```

---

### CardComponent Properties

```json
{
  "id": "card-item",
  "type": "card",
  "title": "Card Title",
  "padding": 2,
  "gap": 1,
  "showBorder": true,
  "borderColor": "#ddd",
  "backgroundColor": "#fff",
  "items": [
    { "id": "card-child", "type": "text", "content": "Card content" }
  ],
  "footer": "Card footer"
}
```

**Defaults from defaultStyle.json**:
```json
{
  "padding": 2,
  "gap": 1,
  "showBorder": true,
  "borderColor": "#e0e0e0",
  "backgroundColor": "#ffffff"
}
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────┐
│     dashboardItems.json (static)        │
│  ┌─────────────────────────────────────┐│
│  │ items: [                            ││
│  │   { id: "title", type: "text", ... }││
│  │   { id: "box-1", type: "box", ... } ││
│  │ ]                                   ││
│  └─────────────────────────────────────┘│
└────────────────┬────────────────────────┘
                 │
        DashboardPanel imports
                 │
        setItems((dashboardItems.items || []) as Item[])
                 │
                 ↓
        ┌─────────────────────────────────┐
        │      items state: Item[]        │
        └────────┬──────────────────────┬─┘
                 │                      │
        map each item         import defaultStyle.json
                 │                      │
                 ↓                      ↓
        ┌──────────────────────────────────────┐
        │   <ItemRenderer                      │
        │     item={item}                      │
        │     defaultStyle={defaultStyle}      │
        │     onItemClick={handleItemClick}    │
        │   />                                 │
        └──────────────────────────────────────┘
                 │
                 ├─→ ItemRenderer routes by item.type
                 │
        ┌────────┴─────────┬──────────────┐
        │                  │              │
        ↓                  ↓              ↓
   TextComponent      BoxComponent    CardComponent
   resolveValue()     resolveValue()   resolveValue()
   (item → default    (item → default  (item → default
    → hardcoded)       → hardcoded)     → hardcoded)
```

---

## Editing Tips

### ✅ Do This

**Add a new text item**:
```json
{
  "id": "my-new-text",
  "type": "text",
  "content": "I created this!"
}
```

**Override just one style**:
```json
{
  "id": "big-text",
  "type": "text",
  "content": "Bigger",
  "fontSize": 32
}
```

**Create nested structure**:
```json
{
  "id": "parent-box",
  "type": "box",
  "items": [
    { "id": "child-1", "type": "text", "content": "Child" }
  ]
}
```

### ❌ Don't Do This

**Break the JSON syntax** (missing comma):
```json
{
  "id": "broken",
  "type": "text"
  "content": "Missing comma above!"
}
```

**Use invalid type**:
```json
{
  "id": "wrong",
  "type": "button"  // Only "text", "box", "card" exist
}
```

**Forget required properties**:
```json
{
  "type": "text"
  // Missing "id"! ItemRenderer needs it for keys
}
```

---

## Testing Your Changes

After editing either file:

1. **dashboardItems.json** changes → visible immediately (hot reload)
2. **defaultStyle.json** changes → visible immediately (hot reload)
3. Open browser DevTools → Console tab for click logs
4. Check Network tab to see files loaded
