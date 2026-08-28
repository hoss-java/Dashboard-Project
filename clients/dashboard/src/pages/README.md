# HomePage

**Location**: `src/pages/HomePage.tsx`

Simple page wrapper that renders the main dashboard layout.

---

## What It Does

Serves as the main application page by rendering `DashboardPanel`, which handles the app bar, content layout, and item rendering.

---

## Usage

```typescript
import HomePage from '../pages/HomePage';

// In your router or App.tsx
<Route path="/" element={<HomePage />} />
```

---

## Structure

```typescript
function HomePage() {
  return <DashboardPanel />;
}
```

That's it — wraps the dashboard panel for routing purposes.

---

## Integration

Typically used in `App.tsx` with React Router:

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## Summary

**HomePage** is a lightweight page component that wraps `DashboardPanel`. Extend it to add page-level logic, guards, or additional context in the future.
