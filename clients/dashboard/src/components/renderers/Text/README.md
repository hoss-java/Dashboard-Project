# Text Component

**Location**: `src/components/renderers/components/Text/TextComponent.tsx`

## What It Does

Displays **text content** with customizable font size and weight.

Think of it like a `<p>` or `<span>` — the simplest component for showing text on your dashboard.

---

## Key Features

| Feature | What It Does |
|---------|------------|
| **Content** | The text to display |
| **Font Size** | Customize text size in pixels |
| **Font Weight** | `normal`, `bold`, or `lighter` |
| **Click Handler** | Logs when clicked, triggers `onItemClick` |
| **Cursor** | Shows pointer on hover (clickable) |

---

## How to Use

In `dashboardItems.json`:

```json
{
  "id": "title-text",
  "type": "text",
  "content": "Welcome to My Dashboard",
  "fontSize": 24,
  "fontWeight": "bold"
}
```

**Result**: Bold, 24px text saying "Welcome to My Dashboard".

---

## Properties

### From Item

| Property | Type | Default | Purpose |
|----------|------|---------|---------|
| `content` | string | '' | The text to display |
| `fontSize` | number | 16 | Text size in pixels |
| `fontWeight` | string | 'normal' | Weight: `normal`, `bold`, `lighter` |

### Value Resolution

Values come from (in order):
1. Item property (e.g., `item.content`)
2. Default style (e.g., `defaultStyle.fontSize`)
3. Hardcoded fallback

---

## Examples

### Simple Text
```json
{
  "id": "simple",
  "type": "text",
  "content": "Hello, World!"
}
```

### Large Bold Title
```json
{
  "id": "title",
  "type": "text",
  "content": "Dashboard Title",
  "fontSize": 32,
  "fontWeight": "bold"
}
```

### Light Subtitle
```json
{
  "id": "subtitle",
  "type": "text",
  "content": "Last updated: 5 minutes ago",
  "fontSize": 12,
  "fontWeight": "lighter"
}
```

---

## Console Output

When clicked:
```
[TextComponent] Text clicked: simple
```

---

## Styling Details

- **Font**: MUI Typography defaults (system font)
- **Cursor**: `pointer` (shows hand icon on hover)
- **Margin**: `mb: 2` (bottom margin for spacing)
- **No border** or background by default

---

## Key Point

**Text is the simplest building block.** Use it for titles, labels, descriptions, or any content that's just text. Pair it with Box or Card to create more complex layouts.

---

## Common Patterns

### Heading + Description
```json
{
  "type": "box",
  "items": [
    {
      "type": "text",
      "content": "User Stats",
      "fontSize": 20,
      "fontWeight": "bold"
    },
    {
      "type": "text",
      "content": "Active users in the last 24 hours",
      "fontSize": 12,
      "fontWeight": "lighter"
    }
  ]
}
```

### Card with Title + Text + Footer
```json
{
  "type": "card",
  "title": "Welcome",
  "items": [
    {
      "type": "text",
      "content": "This is your dashboard"
    }
  ],
  "footer": "v1.0"
}
```
