# Dashboard Project — Audit & Enhancement Report

> **Scope:** Full codebase review and implementation of UI/UX, performance, accessibility, and layout fixes applied to `clients/dashboard/src/`.
> **Build status after all changes:** ✅ Compiled successfully (zero errors, pre-existing warnings only in untouched files)

---

## Table of Contents

1. [Summary of Changes](#1-summary-of-changes)
2. [Files Modified](#2-files-modified)
3. [Finding & Fix Detail — Global / Theme](#3-finding--fix-detail--global--theme)
4. [Finding & Fix Detail — Layout](#4-finding--fix-detail--layout)
5. [Finding & Fix Detail — Components](#5-finding--fix-detail--components)
6. [Finding & Fix Detail — Config](#6-finding--fix-detail--config)
7. [Remaining Known Warnings](#7-remaining-known-warnings)
8. [How to Run](#8-how-to-run)

---

## 1. Summary of Changes

| Category | Findings | Fixes Applied |
|---|---|---|
| Theme & Design System | No dark mode, no design tokens, CRA boilerplate styles | Full dark MUI theme, CSS variables, Inter font |
| Error Handling | No error boundary — one crash takes down the whole app | `ErrorBoundary` class component wrapping the entire tree |
| Layout | Fixed `maxWidth: 800` single column, cards stacked vertically | Responsive flex-row layout, cards side-by-side with wrapping |
| Accessibility | No `aria-*` attributes, no keyboard support, no focus ring | `aria-label`, `role`, `tabIndex`, `focus-visible` ring throughout |
| Performance | Unstable `callbackId` regenerated every render causing subscription leaks | `useMemo` for all callback IDs |
| BinarySwitch | No live data subscription, no keyboard toggle | DataRegistry subscription, Space/Enter keyboard handler |
| NumericDisplay | Gauge/thermometer stacked vertically with large dead space | Horizontal row layout (visual left, label+value right) |
| HistoryDiagram | Hardcoded `width: 600` — broke on any screen size | `ResizeObserver` responsive canvas, human-readable time labels, area fill |
| ItemRenderer | Missing `React` import, plain red `div` error fallback | Import added, dark-themed styled error fallback |
| Loading State | Plain `"Loading..."` text | Skeleton card grid during data load |
| AppBar | Plain title only | Dashboard icon + "Live" status chip |
| Scrollbar | Default OS scrollbar | Slim custom dark scrollbar |

---

## 2. Files Modified

| File | Type of Change |
|---|---|
| `public/index.html` | Added Inter font, meta description, theme-color |
| `src/index.css` | Full rewrite — CSS variables, dark base, scrollbar, focus ring |
| `src/App.css` | Cleared unused CRA boilerplate |
| `src/App.tsx` | Dark MUI theme, ErrorBoundary, component overrides |
| `src/components/DashboardPanel.tsx` | Responsive layout, skeleton loading, AppBar chip, footer |
| `src/components/renderers/ItemRenderer.tsx` | Added React import, styled error fallback |
| `src/components/renderers/Box/BoxComponent.tsx` | Grid → flex-row wrap, responsive child sizing |
| `src/components/renderers/Card/CardComponent.tsx` | Removed vertical stretch, tightened padding, semantic footer |
| `src/components/renderers/BinarySwitch/BinarySwitchComponent.tsx` | Live data subscription, keyboard support, status dot, aria |
| `src/components/renderers/NumericDisplay/NumericDisplayComponent.tsx` | Stable callbackId, horizontal gauge/thermometer, aria roles |
| `src/components/renderers/HistoryDiagram/HistoryDiagramComponent.tsx` | Full rewrite — responsive canvas, time labels, gradient fill |
| `src/config/dashboardItems.json` | Removed hardcoded widths, reduced visual sizes |

---

## 3. Finding & Fix Detail — Global / Theme

### 3.1 No dark theme — harsh white background

**Finding:** The app used the default MUI light theme with a white background. For a real-time monitoring dashboard this causes eye strain and looks unprofessional.

**Fix — `src/App.tsx`:**
- Created a full dark MUI theme with `mode: 'dark'`
- Defined a consistent colour palette:
  - Background: `#0f1117` (page), `#1a1d27` (paper/cards)
  - Primary: `#4f8ef7`, Success: `#34d399`, Warning: `#fbbf24`, Error: `#f87171`, Info: `#38bdf8`
  - Text: `#e2e8f0` (primary), `#94a3b8` (secondary)
- Set `borderRadius: 10` globally
- Added component-level overrides for `MuiCard`, `MuiCardHeader`, `MuiAppBar`, `MuiLinearProgress`, `MuiSwitch`, `MuiSkeleton`
- Card hover effect: `translateY(-2px)` + deeper shadow at 250ms ease

```tsx
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary:   { main: '#4f8ef7' },
    background: { default: '#0f1117', paper: '#1a1d27' },
    ...
  },
  shape: { borderRadius: 10 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'box-shadow 250ms ease, transform 250ms ease',
          '&:hover': { boxShadow: '0 8px 32px rgba(0,0,0,0.5)', transform: 'translateY(-2px)' },
        },
      },
    },
  },
});
```

---

### 3.2 No error boundary

**Finding:** Any unhandled JavaScript error inside a component would crash the entire React tree, showing a blank white page with no feedback.

**Fix — `src/App.tsx`:**
Added an `ErrorBoundary` class component wrapping the full app. On error it renders a centred dark-themed fallback with the error message instead of a blank screen.

```tsx
class ErrorBoundary extends React.Component<...> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return <div>⚠️ Something went wrong — {this.state.error?.message}</div>;
    }
    return this.props.children;
  }
}
```

---

### 3.3 No design tokens or CSS variables

**Finding:** `index.css` contained only the default CRA font stack with no reusable design tokens. Colours and spacing were scattered as magic values across components.

**Fix — `src/index.css`:** Full rewrite introducing:
- CSS custom properties (`--color-bg`, `--color-primary`, `--radius-md`, `--transition-base`, etc.)
- `box-sizing: border-box` universal reset
- Dark background and text on `html, body`
- `#root` set to `height: 100%; display: flex; flex-direction: column`
- Slim custom scrollbar (6px, semi-transparent thumb)
- Global `focus-visible` ring using `--color-primary` for keyboard accessibility
- Smooth `scale(0.97)` press feedback on buttons and interactive elements

---

### 3.4 No web font — system font stack only

**Finding:** `public/index.html` had no font link. The app fell back to the OS default sans-serif, which varies across platforms.

**Fix — `public/index.html`:**
- Added Google Fonts preconnect and Inter font link (`weights: 400, 500, 600, 700`)
- Updated `<meta name="description">` to a meaningful value
- Added `<meta name="theme-color" content="#0f1117">` for mobile browser chrome

---

### 3.5 Unused CRA boilerplate in App.css

**Finding:** `App.css` contained the default Create React App styles (`.App-logo`, spinning animation, `.App-header`) — none of which were used anywhere in the project.

**Fix — `src/App.css`:** Cleared to a single comment. All styling is handled by MUI theme and `index.css`.

---

## 4. Finding & Fix Detail — Layout

### 4.1 Fixed single-column layout — maxWidth 800px

**Finding:** `DashboardPanel` wrapped all content in a `Box` with `maxWidth: 800` and rendered items in a single column. On wide screens this left large empty margins and forced all cards to stack vertically regardless of available space.

**Fix — `src/components/DashboardPanel.tsx`:**
- Removed the fixed-width content box
- Top-level items now render in a `flex column` with `gap: 2`, `maxWidth: 1400`, and responsive padding (`xs: 2, sm: 3, md: 4`)
- This lets each `BoxComponent` row control its own horizontal arrangement

```tsx
<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
  {items.map((item) => (
    <ItemRenderer key={item.id} item={item} ... />
  ))}
</Box>
```

---

### 4.2 BoxComponent stacked children vertically

**Finding:** `BoxComponent` used `display: grid` with `auto-fill minmax(260px, 1fr)`. Because the outer panel also used a grid, the two grids conflicted and cards ended up stacking vertically instead of sitting side-by-side.

**Fix — `src/components/renderers/Box/BoxComponent.tsx`:**
- Switched to `display: flex; flex-direction: row; flex-wrap: wrap`
- Each child wrapped in `Box` with `flex: '1 1 240px'; minWidth: 0` so cards share the row equally and wrap gracefully on narrow screens
- Removed unused `align` and `alignMap` variables

```tsx
<Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap, width: '100%' }}>
  {item.items.map((nestedItem) => (
    <Box key={nestedItem.id} sx={{ flex: '1 1 240px', minWidth: 0 }}>
      <ItemRenderer item={nestedItem} ... />
    </Box>
  ))}
</Box>
```

---

### 4.3 Cards stretched vertically to fill available height

**Finding:** `CardComponent` had `height: '100%'` on the card and `flex: 1` on `CardContent`. This caused cards to stretch to the tallest sibling in the row, creating large empty areas inside shorter cards.

**Fix — `src/components/renderers/Card/CardComponent.tsx`:**
- Removed `height: '100%'` from the card root
- Removed `flex: 1` from `CardContent`
- Cards now shrink to fit their content
- Tightened `CardHeader` padding (`pt: 1.5, pb: 0.5`) and reduced top padding on `CardContent` when a title is present
- Footer changed from `py: 1` to `pb: 1` only (no top padding — border provides visual separation)

---

### 4.4 No skeleton loading state

**Finding:** During the 600ms initialisation delay, the dashboard showed a plain `"Loading..."` text string with no visual structure.

**Fix — `src/components/DashboardPanel.tsx`:**
Added a `SkeletonGrid` component that renders 6 `Skeleton` cards in a responsive grid while data loads, giving users immediate visual feedback about the layout.

```tsx
function SkeletonGrid() {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', lg: 'repeat(3,1fr)' }, gap: 3 }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} variant="rounded" height={180} />
      ))}
    </Box>
  );
}
```

---

### 4.5 AppBar had no visual identity

**Finding:** The AppBar showed only the app name as plain text with no icon or status indicator.

**Fix — `src/components/DashboardPanel.tsx`:**
- Added `DashboardIcon` to the left of the title
- Added a "Live" `Chip` with a green `FiberManualRecordIcon` dot on the right, indicating the data stream is active
- AppBar set to `position="sticky"` so it stays visible while scrolling
- Added semantic `role="banner"` on the AppBar and `role="main"` on the content area

---

## 5. Finding & Fix Detail — Components

### 5.1 ItemRenderer — missing React import and unstyled error fallback

**Finding:** `ItemRenderer.tsx` had no `import React` statement (required for JSX in this project's TypeScript config). The unknown-component fallback was a plain red `div` with inline styles that clashed with the dark theme.

**Fix — `src/components/renderers/ItemRenderer.tsx`:**
- Added `import React from 'react'`
- Replaced the plain `div` with a dark-themed styled fallback using `role="alert"`, red border, and a subtle red background tint

```tsx
<div role="alert" style={{
  padding: '12px 16px', color: '#f87171',
  border: '1px solid #f87171', borderRadius: 8,
  background: 'rgba(248,113,113,0.08)',
}}>
  Unknown component type: <strong>{item.type}</strong>
</div>
```

---

### 5.2 BinarySwitch — no live data subscription

**Finding:** `BinarySwitchComponent` only read `item.isOn` from the static config at mount time. It never subscribed to `DataRegistry`, so it never reflected live data changes from the mock service.

**Fix — `src/components/renderers/BinarySwitch/BinarySwitchComponent.tsx`:**
- Added `useEffect` that subscribes to `dataRegistry.onChange` using `item.content` as the data key
- On toggle, writes the new value back to `dataRegistry.set` so other components listening to the same key update in sync
- Cleanup (`offChange`) runs on unmount

```tsx
useEffect(() => {
  const dataName = item.content;
  if (!dataName) return;
  if (!dataRegistry.get(dataName)) dataRegistry.register(dataName, false);
  setIsOn(Boolean(dataRegistry.get(dataName)));
  const handleChange = (newValue: any) => setIsOn(Boolean(newValue));
  dataRegistry.onChange(dataName, callbackId, handleChange);
  return () => dataRegistry.offChange(dataName, callbackId);
}, [item.content, callbackId]);
```

---

### 5.3 BinarySwitch — no keyboard support

**Finding:** The switch row had no `tabIndex` and no keyboard handler. Users navigating by keyboard could not toggle switches without a mouse.

**Fix — `src/components/renderers/BinarySwitch/BinarySwitchComponent.tsx`:**
- Added `tabIndex={0}` to the container `Box`
- Added `onKeyDown` handler that triggers toggle on `Space` or `Enter`
- Added `focus-visible` outline using `primary.main` colour
- Added `aria-label` describing the current state: `"Cabin Door switch, currently Closed"`

```tsx
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
    const next = !isOn;
    setIsOn(next);
    if (item.content) dataRegistry.set(item.content, next);
  }
};
```

---

### 5.4 BinarySwitch — no visual status indicator

**Finding:** The only visual feedback for ON/OFF state was the switch toggle itself and a text label colour change. There was no immediate at-a-glance indicator.

**Fix — `src/components/renderers/BinarySwitch/BinarySwitchComponent.tsx`:**
- Added an 8px status dot to the left of the label
- Dot colour matches `onStatusColor` / `offStatusColor` from config
- When ON, the dot has a `box-shadow` glow effect
- Container background tints green (`rgba(52,211,153,0.05)`) when ON
- Border colour transitions between `success.main` (ON) and `divider` (OFF)

---

### 5.5 NumericDisplay — unstable callbackId causing subscription leaks

**Finding:** The callback ID was generated with `Math.random()` inline in the component body:
```tsx
// BEFORE (broken)
const callbackId = `numericDisplay-${item.id}-${Math.random().toString(36).slice(2, 9)}`;
```
Because this ran on every render, a new random ID was created each time. The old subscription was never cleaned up (the `offChange` call used the new ID, not the old one), causing memory leaks where stale callbacks accumulated in the registry.

**Fix — `src/components/renderers/NumericDisplay/NumericDisplayComponent.tsx`:**
Wrapped in `useMemo` so the ID is stable for the lifetime of the component instance:
```tsx
const callbackId = useMemo(() => `numericDisplay-${item.id}`, [item.id]);
```
The same fix was applied to `BinarySwitchComponent` and `HistoryDiagramComponent`.

---

### 5.6 NumericDisplay — gauge and thermometer had excessive vertical dead space

**Finding:** Both the gauge (SVG arc) and thermometer variants were laid out as `flex-direction: column` with the visual centred above the value. This created large empty areas above and below the visual, making cards unnecessarily tall.

**Fix — `src/components/renderers/NumericDisplay/NumericDisplayComponent.tsx`:**
Both variants switched to `flex-direction: row` — the visual sits on the left, the label and value sit on the right. This eliminates all vertical dead space.

- Gauge: SVG rendered at `gaugeSize × (gaugeSize/2 + 10)` with `flexShrink: 0`; label and value in a `Box` to the right
- Thermometer: tube + bulb on the left with `pb: '20px'` to accommodate the bulb; label and value to the right

Default sizes also reduced:
- `fontSize`: 32 → 24
- `labelFontSize`: 13 → 12
- `padding`: 2 → 1
- `gap`: 1 → 0.5

---

### 5.7 NumericDisplay — no accessibility roles on meter variants

**Finding:** The gauge, thermometer, and bar variants displayed numeric ranges visually but had no ARIA attributes, making them invisible to screen readers.

**Fix — `src/components/renderers/NumericDisplay/NumericDisplayComponent.tsx`:**
- Bar: `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label` on `LinearProgress`
- Gauge and thermometer: `role="meter"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label` on the wrapper `Box`
- Text variant: `aria-label` combining label and formatted value on the `Typography`
- Container: `role="region"` with `aria-label`

---

### 5.8 HistoryDiagram — hardcoded width broke responsiveness

**Finding:** The canvas was created with a hardcoded `width={600}` prop and the config had `"width": 600`. On screens narrower than 600px the chart overflowed its container. On wider screens it left empty space.

**Fix — `src/components/renderers/HistoryDiagram/HistoryDiagramComponent.tsx`:**
Full rewrite of the component:
- Added `containerRef` on the wrapper `Box`
- `ResizeObserver` watches the container and updates `canvasWidth` state whenever the element resizes
- Canvas `width` and `height` attributes are set programmatically inside `draw()` to match the actual pixel dimensions
- The `width` config property is no longer used — the canvas always fills 100% of its container
- Removed `width` from `dashboardItems.json` for all `historyDiagram` items

```tsx
useEffect(() => {
  const el = containerRef.current;
  if (!el) return;
  const ro = new ResizeObserver(([entry]) => setCanvasWidth(entry.contentRect.width));
  ro.observe(el);
  setCanvasWidth(el.clientWidth);
  return () => ro.disconnect();
}, []);
```

---

### 5.9 HistoryDiagram — raw timestamp numbers on X-axis

**Finding:** The X-axis labels displayed raw Unix millisecond timestamps (e.g. `1718023456789`), which are unreadable to users.

**Fix — `src/components/renderers/HistoryDiagram/HistoryDiagramComponent.tsx`:**
X-axis labels now format timestamps as `HH:MM:SS` using `Date` object methods:

```tsx
const d = new Date(pt.timestamp);
const lbl = `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}:${d.getSeconds().toString().padStart(2,'0')}`;
```

---

### 5.10 HistoryDiagram — no area fill, plain line only

**Finding:** The chart drew only a plain stroke line with no fill, making it hard to read trends at a glance.

**Fix — `src/components/renderers/HistoryDiagram/HistoryDiagramComponent.tsx`:**
Added a vertical linear gradient fill beneath the line:
- Gradient from `lineColor + '55'` (33% opacity) at the top to `lineColor + '00'` (transparent) at the bottom
- Drawn as a closed path before the line stroke so the line renders on top

```tsx
const grad = ctx.createLinearGradient(0, pad.top, 0, h - pad.bottom);
grad.addColorStop(0, lineColor + '55');
grad.addColorStop(1, lineColor + '00');
ctx.beginPath();
ctx.moveTo(toX(historyData[0].timestamp), h - pad.bottom);
historyData.forEach((p) => ctx.lineTo(toX(p.timestamp), toY(p.value)));
ctx.lineTo(toX(historyData[historyData.length - 1].timestamp), h - pad.bottom);
ctx.closePath();
ctx.fillStyle = grad;
ctx.fill();
```

---

### 5.11 HistoryDiagram — dark theme colours not applied to canvas

**Finding:** The canvas used hardcoded light-theme colours (`#ffffff` background, `#333` axes, `#e0e0e0` grid lines) that clashed with the dark UI.

**Fix — `src/components/renderers/HistoryDiagram/HistoryDiagramComponent.tsx`:**
All canvas colours updated to dark-theme values:
- Background: `rgba(255,255,255,0.02)` (near-transparent, shows card background)
- Grid lines: `rgba(255,255,255,0.06)`
- Axes: `rgba(255,255,255,0.15)`
- Labels: `#64748b` (matches `text.secondary`)
- Font: `Inter, sans-serif` to match the rest of the UI

---

### 5.12 HistoryDiagram — no accessibility role

**Finding:** The canvas element had no ARIA attributes, making it completely invisible to assistive technologies.

**Fix — `src/components/renderers/HistoryDiagram/HistoryDiagramComponent.tsx`:**
Added `role="img"` and `aria-label={label}` to the container `Box` wrapping the canvas.

---

## 6. Finding & Fix Detail — Config

### 6.1 dashboardItems.json — hardcoded pixel widths on history diagrams

**Finding:** Both `historyDiagram` items had `"width": 600` hardcoded. This value was passed directly to the canvas, overriding any responsive sizing.

**Fix — `src/config/dashboardItems.json`:**
Removed all `width` properties from `historyDiagram` items. The `ResizeObserver` in the component now controls width automatically.

---

### 6.2 dashboardItems.json — oversized visual components

**Finding:** The thermometer height (120px) and gauge size (140px) were larger than necessary, contributing to excessive card height.

**Fix — `src/config/dashboardItems.json`:**

| Property | Before | After |
|---|---|---|
| `thermometerHeight` | 120 | 80 |
| `gaugeSize` | 140 | 100 |
| `gaugeThickness` | 10 | 8 |
| History chart `height` | 200 | 150 |

---

### 6.3 dashboardItems.json — redundant footer text item

**Finding:** Item `id: "4"` was a `text` component at the bottom of the dashboard reading `"Real-time monitoring — All data updates from DataRegistry"`. This duplicated information that belongs in a footer, not as a dashboard data item.

**Fix — `src/config/dashboardItems.json`:**
Removed item `id: "4"`. The same text was moved into the semantic `<footer>` element in `DashboardPanel.tsx`.

---

## 7. Remaining Known Warnings

These warnings exist in files that were **not modified** during this session and are pre-existing issues:

| File | Warning | Notes |
|---|---|---|
| `src/components/renderers/Text/TextComponent.tsx` | `useEffect` missing `callbackId` dependency | Same unstable callbackId pattern as fixed in other components. Apply the same `useMemo` fix when working on `TextComponent`. |
| `src/services/MockInitializer.ts` | `dataRegistry` imported but never used | Dead import in the service file. Safe to remove. |

---

## 8. How to Run

```bash
cd clients/dashboard
npm install       # only needed once
npm start         # starts dev server at http://localhost:3000
```

To produce a production build:
```bash
npm run build
```

### What to verify in the browser

| Feature | What to check |
|---|---|
| Dark theme | Entire UI is dark — no white flash on load |
| Inter font | Text uses Inter, not system default |
| Responsive layout | Resize browser — cards reflow from 4 columns → 2 → 1 |
| Horizontal cards | Sensor cards sit side-by-side, not stacked |
| Skeleton loading | Brief skeleton grid visible before data appears (~600ms) |
| Live data | Thermometer, gauge, bar, and history charts update in real time |
| BinarySwitch keyboard | Tab to a switch row, press Space or Enter to toggle |
| BinarySwitch live data | Toggle a switch — status dot and border colour change instantly |
| History chart responsive | Chart fills card width at any screen size |
| History chart time labels | X-axis shows `HH:MM:SS` format, not raw numbers |
| Error boundary | Temporarily break a component — app shows error screen, not blank page |
| Focus ring | Tab through the page — blue focus ring visible on all interactive elements |
| Card hover | Hover over any card — subtle upward lift animation |
| AppBar | Shows dashboard icon + green "Live" chip |
