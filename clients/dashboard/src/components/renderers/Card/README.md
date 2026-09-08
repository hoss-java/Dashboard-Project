# Card Component

**Location**: `src/components/renderers/components/Card/CardComponent.tsx`

## What It Does

A **polished container** with optional title and footer that displays nested items inside.

Think of it like a card UI element — the kind you'd see on a dashboard with a header, content area, and optional footer.

---

## Key Features

| Feature | What It Does |
|---------|------------|
| **Title** | Optional header text at the top |
| **Content** | Renders `item.items` array inside |
| **Footer** | Optional text at the bottom |
| **Styling** | Border, background, shadow, rounded corners |
| **Click Handler** | Logs when clicked, triggers `onItemClick` |

---

## How to Use

In `dashboardItems.json`:

```json
{
  "id": "user-card",
  "type": "card",
  "title": "User Profile",
  "padding": 16,
  "gap": 12,
  "showBorder": true,
  "borderColor": "#2196F3",
  "backgroundColor": "#ffffff",
  "footer": "Last updated: 2024-01-15",
  "items": [
    {
      "id": "name-text",
      "type": "text",
      "content": "John Doe"
    },
    {
      "id": "email-text",
      "type": "text",
      "content": "john@example.com"
    }
  ]
}
```

**Result**: A nice card with a title bar, content area with two text items, and a footer.

---

## Properties

### From Item

| Property | Type | Default | Purpose |
|----------|------|---------|---------|
| `title` | string | '' | Header text (empty = no header) |
| `footer` | string | '' | Footer text (empty = no footer) |
| `padding` | number | 2 | Space inside content area |
| `gap` | number | 1 | Space between nested items |
| `showBorder` | boolean | true | Show border? |
| `borderColor` | string | '#e0e0e0' | Border color |
| `backgroundColor` | string | '#ffffff' | Background color |
| `items` | array | - | **Nested components** to render |

### Value Resolution

Values come from (in order):
1. Item property (e.g., `item.title`)
2. Default style (only for `padding`, `gap`, `showBorder`, `borderColor`, `backgroundColor`)
3. Hardcoded fallback

---

## Structure

The card has **three sections**:

```
┌─────────────────────────────┐
│ CardHeader (title)          │  ← Shows if title exists
├─────────────────────────────┤
│ CardContent                 │  ← Your nested items go here
│  • item 1                   │
│  • item 2                   │
│  • item N                   │
├─────────────────────────────┤
│ Footer Box                  │  ← Shows if footer exists
└─────────────────────────────┘
```

---

## Example: Card with Nested Box and Text

```json
{
  "type": "card",
  "title": "Dashboard Stats",
  "items": [
    {
      "type": "box",
      "gap": 8,
      "items": [
        {
          "type": "text",
          "content": "Active Users: 1,234"
        },
        {
          "type": "text",
          "content": "Revenue: $45,678"
        }
      ]
    }
  ],
  "footer": "Updated 5 minutes ago"
}
```

**Result**: A card with a title, a box containing two text items, and a footer.

---

## Console Output

When clicked:
```
[CardComponent] Card clicked: user-card
```

---

## Visual Styling

- **Shadow**: `boxShadow: 2` (MUI elevation)
- **Rounded corners**: `borderRadius: 1`
- **Border** (optional): `1px solid {borderColor}`
- **Footer border**: Top border separator line

---

## Key Differences from Box

| Feature | Box | Card |
|---------|-----|------|
| **Purpose** | Generic container | Polished card UI |
| **Header** | No | Optional title |
| **Footer** | No | Optional footer |
| **Shadow** | No | Yes |
| **Default border** | false | true |
| **Use case** | Layout structure | Grouped content display |

---

## Key Point

**Cards are for presenting self-contained information.** Use them when you want a visually distinct, bordered section with a title and/or footer. Use Box when you just need to arrange items.
