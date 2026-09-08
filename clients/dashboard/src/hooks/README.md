# useManifest Hook

**Location**: `src/hooks/useManifest.ts`

Custom React hook that loads and manages app metadata from a `manifest.json` file. Provides centralized access to app name, description, and other manifest properties throughout your app.

---

## Overview

| Aspect | Details |
|--------|---------|
| **Purpose** | Fetch and provide app metadata (name, description, etc.) |
| **Return Type** | `Manifest` object |
| **Default Value** | `{ name: 'React Template' }` |
| **Fetch Source** | `/manifest.json` (public folder) |
| **Error Handling** | Logs error to console; returns default value |

---

## What It Does

### The Hook Signature

```typescript
function useManifest(): Manifest
```

- Runs once on component mount (via `useEffect` with empty dependency array)
- Fetches `/manifest.json` from the public folder
- Updates state when data arrives
- Returns manifest object immediately (with fallback default)

### Manifest Interface

```typescript
interface Manifest {
  name: string;                // Required: app name
  short_name?: string;         // Optional: short version of name
  description?: string;        // Optional: app description
  [key: string]: any;          // Any other manifest properties
}
```

---

## How to Use

### Step 1: Create `/public/manifest.json`

In your `public/` folder, create a manifest file:

```json
{
  "name": "My Dashboard App",
  "short_name": "Dashboard",
  "description": "A test template for building dynamic dashboards",
  "theme_color": "#1976d2",
  "background_color": "#ffffff",
  "icons": []
}
```

### Step 2: Use in Components

Import and call the hook in any component:

```typescript
import useManifest from '../hooks/useManifest';

function AppHeader() {
  const manifest = useManifest();

  return (
    <header>
      <h1>{manifest.name}</h1>
      {manifest.description && (
        <p>{manifest.description}</p>
      )}
    </header>
  );
}
```

### Step 3: Access Properties

```typescript
function DashboardPanel() {
  const manifest = useManifest();

  return (
    <Box>
      <Typography variant="h4">
        {manifest.name}
      </Typography>
      <Typography variant="body2">
        {manifest.short_name || manifest.name}
      </Typography>
    </Box>
  );
}
```

---

## Data Flow

```
Component mounts
    ↓
useManifest() called
    ↓
Initial state: { name: 'React Template' }
    ↓
useEffect runs (once)
    ↓
fetch('/manifest.json')
    ↓
Response OK?
    ├─ YES → Parse JSON → setManifest(data)
    └─ NO  → console.error() → use default
    ↓
Component re-renders with actual manifest
    ↓
Return: { name: 'My Dashboard App', ... }
```

---

## Common Patterns

### Pattern 1: Display App Title

```typescript
function AppBar() {
  const manifest = useManifest();

  return (
    <MuiAppBar position="static">
      <Toolbar>
        <Typography variant="h6">
          {manifest.name}
        </Typography>
      </Toolbar>
    </MuiAppBar>
  );
}
```

### Pattern 2: Conditional Rendering Based on Manifest

```typescript
function Setup() {
  const manifest = useManifest();

  if (!manifest.description) {
    return <Alert severity="warning">No description provided</Alert>;
  }

  return <Typography>{manifest.description}</Typography>;
}
```

### Pattern 3: Use in Multiple Components

```typescript
// Header.tsx
function Header() {
  const { name } = useManifest();
  return <h1>{name}</h1>;
}

// Footer.tsx
function Footer() {
  const { short_name } = useManifest();
  return <footer>© {short_name}</footer>;
}

// Meta.tsx
function Meta() {
  const manifest = useManifest();
  return <meta name="description" content={manifest.description} />;
}
```

### Pattern 4: Fallback Behavior

```typescript
function AppName() {
  const manifest = useManifest();

  // Use short_name if available, otherwise full name
  const displayName = manifest.short_name || manifest.name;

  return <span>{displayName}</span>;
}
```

---

## API Reference

### useManifest()

```typescript
const manifest = useManifest();
```

**Returns**: `Manifest` object with the following properties:

| Property | Type | Required | Example |
|----------|------|----------|---------|
| `name` | string | Yes | `"My Dashboard App"` |
| `short_name` | string | No | `"Dashboard"` |
| `description` | string | No | `"A test template..."` |
| `[key: string]` | any | No | Custom properties |

---

## Error Handling

### Fetch Fails

If `/manifest.json` is missing or the fetch fails:

```
Error loading manifest: TypeError: Failed to fetch
(logged to console)
```

**Fallback**: Returns default value `{ name: 'React Template' }`

### Handling Missing Properties

Always check optional properties before use:

```typescript
function SafeDescription() {
  const manifest = useManifest();

  // ❌ Not safe: might be undefined
  return <p>{manifest.description}</p>;

  // ✅ Safe: check first
  return manifest.description ? (
    <p>{manifest.description}</p>
  ) : null;
}
```

---

## manifest.json Structure

Recommended minimal manifest:

```json
{
  "name": "My App",
  "short_name": "App",
  "description": "What this app does",
  "theme_color": "#1976d2",
  "background_color": "#ffffff"
}
```

Full PWA manifest (optional):

```json
{
  "name": "My Dashboard App",
  "short_name": "Dashboard",
  "description": "A test template for dynamic dashboards",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1976d2",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## Performance & Caching

### Load Once Per App

The hook fetches `/manifest.json` **only once** when the component mounts (empty dependency array `[]`).

```typescript
useEffect(() => {
  fetch('/manifest.json')
    .then(...)
    .catch(...);
}, []); // Only runs once
```

**Benefit**: No repeated network requests, even if component re-renders.

### Reuse Across Components

Call the hook in multiple components — each gets the cached manifest:

```typescript
// Header.tsx
const manifest1 = useManifest(); // Fetches once globally (on first use)

// Footer.tsx
const manifest2 = useManifest(); // Returns same data (no new fetch)
```

---

## Best Practices

| Practice | Reason |
|----------|--------|
| Check optional properties before use | Prevents `undefined` errors |
| Use `short_name` or fallback in UI | Cleaner display in compact spaces |
| Load manifest early in app | Ensures data available for all components |
| Don't call hook in callbacks/loops | Call at component top level |

---

## Troubleshooting

### manifest.json Not Found

**Error**: `404 Not Found` or network error

**Solution**: 
- Ensure `/public/manifest.json` exists in your project
- Verify file name and path (case-sensitive)

### Manifest Not Updating

**Expected**: Data loads once on first mount

**If you need fresh data**:
- Refresh the page
- Or extend the hook with a refresh function

```typescript
const [manifest, setManifest] = useState<Manifest>({
  name: 'React Template',
});

const refreshManifest = () => {
  fetch('/manifest.json')
    .then((r) => r.json())
    .then((data) => setManifest(data));
};

return { manifest, refreshManifest };
```

### Type Errors with Custom Properties

**Issue**: TypeScript doesn't know about custom manifest fields

**Solution**: Extend the `Manifest` interface:

```typescript
interface Manifest {
  name: string;
  short_name?: string;
  description?: string;
  version?: string;              // Add custom fields
  author?: string;
  [key: string]: any;            // Catch-all for unknowns
}
```

---

## Integration Checklist

- [ ] Create `/public/manifest.json`
- [ ] Import `useManifest` in components
- [ ] Call hook at component top level
- [ ] Access `manifest.name` or other properties
- [ ] Handle missing optional properties safely
- [ ] Test in browser DevTools (Network tab)

---

## Summary

**useManifest** is a simple hook that loads app metadata once and provides it throughout your app. Use it to display the app name, description, and other metadata in headers, footers, and anywhere else metadata is needed. Always check optional properties before use to avoid errors.
