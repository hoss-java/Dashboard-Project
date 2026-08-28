# Config Folder

Stores **metadata and configuration** for the component registry system.

## Files

### `componentRegistry.json`

Lists all available components and how to find them.

**Why?** The system needs to know:
- What component types exist (`text`, `box`, `card`)
- Where each component file is located
- A human-readable name and description

**Format**:
```json
{
  "components": [
    {
      "type": "text",                          // Used in dashboardItems.json
      "displayName": "Text Component",         // Human name
      "description": "Displays text",          // What it does
      "path": "Text",                          // Folder name
      "fileName": "TextComponent"              // File name (no .tsx)
    }
  ]
}
```

**When to update**: Add a line here when you create a new custom component.

---

## How It Works

1. `ComponentRegistry.ts` reads this JSON
2. Maps each `type` to its component file
3. `ItemRenderer.tsx` looks up the component by type
4. Component renders on dashboard

**Example**: `dashboardItems.json` says `"type": "text"` → Registry finds `TextComponent` → Text renders!

---

## Key Point

**This file bridges JSON configuration to React components.**

No this file = system doesn't know your components exist.
