# Box Component

**Location**: `src/components/renderers/components/Box/BoxComponent.tsx`

## What It Does

A **container** that holds and arranges other components inside it.

Think of it like a `<div>` that renders nested items and applies styling.

---

## Key Features

| Feature | What It Does |
|---------|------------|
| **Nesting** | Renders `item.items` array inside itself |
| **Spacing** | `padding` (internal), `gap` (between children) |
| **Alignment** | `align`: `left`, `center`, or `right` |
| **Styling** | Border, background color, rounded corners |
| **Click Handler** | Logs when clicked, triggers `onItemClick` |

---

## How to Use

In `dashboardItems.json`:

```json
{
  "id": "main-box",
  "type": "box",
  "padding": 16,
  "gap": 12,
  "align": "center",
  "showBorder": true,
  "borderColor": "#2196F3",
  "backgroundColor": "#f5f5f5",
  "items": [
    {
      "id": "text-1",
      "type": "text",
      "content": "I'm inside a box!"
    },
    {
      "id": "text-2",
      "type": "text",
      "content": "Me too!"
    }
  ]
}
```

---

## Properties

### From Item

| Property | Type | Default | Purpose |
|----------|------|---------|---------|
| `padding` | number | 2 | Space inside the box |
| `gap` | number | 1 | Space between children |
| `align` | string | 'left' | Child alignment: `left`, `center`, `right` |
| `showBorder` | boolean | false | Show border? |
| `borderColor` | string | '#e0e0e0' | Border color |
| `backgroundColor` | string | '#fafafa' | Background color |
| `items` | array | - | **Nested components** to render |

### Value Resolution

Values come from (in order):
1. Item property (e.g., `item.padding`)
2. Default style (e.g., `defaultStyle.padding`)
3. Hardcoded fallback (e.g., `2`)

---

## How It Works

1. **Receives** `item` with `items` array
2. **Resolves** styling values (padding, gap, border, etc.)
3. **Maps** over `item.items` array
4. **Renders** each nested item using `ItemRenderer`
5. **Displays** everything in a flexbox column

---

## Example: Nesting

```json
{
  "type": "box",
  "items": [
    {
      "type": "box",
      "padding": 8,
      "items": [
        {
          "type": "text",
          "content": "Nested inside a box inside a box!"
        }
      ]
    }
  ]
}
```

**Result**: Boxes can contain boxes can contain boxes!

---

## Console Output

When clicked:
```
[BoxComponent] Box clicked: main-box
```

---

## Under the Hood

Uses MUI `Box` with:
- `display: 'flex'` + `flexDirection: 'column'` (stack vertically)
- `gap` for spacing between children
- `padding` for internal space
- `border` (conditional)
- `borderRadius` for rounded corners
- `justifyContent` for alignment

---

## Key Point

**Box is the workhorse container.** Use it to structure and organize other components on your dashboard.
