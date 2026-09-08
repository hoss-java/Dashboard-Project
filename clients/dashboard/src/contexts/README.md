# DashboardContext

**Location**: `src/contexts/DashboardContext.tsx`

Global React Context for managing dashboard-level UI state. Provides a centralized way to share state (like guide visibility) across all components without prop drilling.

---

## Overview

| Aspect | Details |
|--------|---------|
| **Purpose** | Hold and share global UI state (e.g., guide visibility) |
| **Type** | React Context + Provider + Hook |
| **Default State** | `showGuide: true` |
| **Extensible** | Yes — add new state properties as needed |

---

## What It Contains

### DashboardContextType Interface

Defines the shape of the context:

```typescript
interface DashboardContextType {
  showGuide: boolean;                    // Is the guide panel visible?
  setShowGuide: (show: boolean) => void; // Toggle guide visibility
}
```

### DashboardProvider Component

Wraps your app and initializes state:

```typescript
export function DashboardProvider({ children }: { children: React.ReactNode })
```

- Initializes `showGuide` to `true`
- Provides context value to all descendants
- Must wrap the root of your component tree

### useDashboard Hook

Access context state in any component:

```typescript
export function useDashboard()
```

- Returns `{ showGuide, setShowGuide }`
- Throws error if used outside `DashboardProvider`

---

## How to Use

### Step 1: Wrap Your App

In `src/index.tsx` or your root component:

```typescript
import { DashboardProvider } from './contexts/DashboardContext';

ReactDOM.render(
  <DashboardProvider>
    <App />
  </DashboardProvider>,
  document.getElementById('root')
);
```

### Step 2: Use in Components

Any component inside `DashboardProvider` can access the context:

```typescript
import { useDashboard } from '../contexts/DashboardContext';

function GuideToggleButton() {
  const { showGuide, setShowGuide } = useDashboard();

  return (
    <button onClick={() => setShowGuide(!showGuide)}>
      {showGuide ? 'Hide' : 'Show'} Guide
    </button>
  );
}

function GuidePanel() {
  const { showGuide } = useDashboard();

  if (!showGuide) return null;

  return <div>Guide content here...</div>;
}
```

---

## Data Flow

```
DashboardProvider (root)
    ↓
    └─→ value = { showGuide: true, setShowGuide }
           ↓
           └─→ <App />
                 ↓
                 ├─→ <GuideToggleButton /> calls setShowGuide()
                 ├─→ <GuidePanel /> reads showGuide
                 └─→ <Dashboard /> (any nested component)
```

---

## Common Patterns

### Pattern 1: Conditional Rendering

```typescript
function Dashboard() {
  const { showGuide } = useDashboard();

  return (
    <Box>
      {showGuide && <GuidePanel />}
      <MainContent />
    </Box>
  );
}
```

### Pattern 2: Toggle Button

```typescript
function ToggleButton() {
  const { showGuide, setShowGuide } = useDashboard();

  return (
    <Button onClick={() => setShowGuide(!showGuide)}>
      {showGuide ? '✓ Guide On' : '✗ Guide Off'}
    </Button>
  );
}
```

### Pattern 3: Multiple Consumers

```typescript
function Header() {
  const { showGuide, setShowGuide } = useDashboard();
  return <button onClick={() => setShowGuide(!showGuide)}>Toggle</button>;
}

function Content() {
  const { showGuide } = useDashboard();
  return showGuide ? <Guide /> : <MainContent />;
}

function Footer() {
  const { showGuide } = useDashboard();
  return <p>Guide is {showGuide ? 'on' : 'off'}</p>;
}

// All three components read/write the same state without prop drilling
```

---

## Extending for Future Features

The context is designed to grow. Add new state properties:

```typescript
interface DashboardContextType {
  showGuide: boolean;
  setShowGuide: (show: boolean) => void;
  
  // Add new features:
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [showGuide, setShowGuide] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <DashboardContext.Provider 
      value={{ 
        showGuide, 
        setShowGuide, 
        sidebarCollapsed, 
        setSidebarCollapsed,
        theme,
        setTheme 
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
```

Then access everywhere:

```typescript
const { showGuide, sidebarCollapsed, theme } = useDashboard();
```

---

## Error Handling

### ❌ Using Outside Provider

```typescript
function MyComponent() {
  const { showGuide } = useDashboard();
  // ❌ Error: useDashboard must be used within DashboardProvider
}

// Rendered outside provider:
ReactDOM.render(<MyComponent />, root);
```

### ✅ Fix: Wrap in Provider

```typescript
ReactDOM.render(
  <DashboardProvider>
    <MyComponent />
  </DashboardProvider>,
  root
);
```

---

## API Summary

| Item | Type | Description |
|------|------|-------------|
| `DashboardContextType` | Interface | Shape of context (showGuide, setShowGuide) |
| `DashboardProvider` | Component | Wrapper that initializes and provides state |
| `useDashboard()` | Hook | Access context in any child component |

---

## Integration Checklist

- [ ] Import `DashboardProvider` in root file
- [ ] Wrap app with `<DashboardProvider>`
- [ ] Import `useDashboard` in components that need state
- [ ] Call `useDashboard()` to read/update state
- [ ] Test that toggling works across components

---

## Summary

**DashboardContext** eliminates prop drilling by centralizing UI state. Start with `showGuide`, extend with new features as needed. Any component inside `DashboardProvider` can read or update state via the `useDashboard()` hook.
