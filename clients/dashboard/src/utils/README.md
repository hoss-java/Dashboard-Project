# 🛠️ Utils Folder

Shared utility functions used across the app.

---

## **Current Utilities**

### **`resolveValue.ts`**
Resolves values with priority fallback chain.

**Purpose:** Choose the best value from multiple sources in order.

**Usage:**
```typescript
import { resolveValue } from './resolveValue';

const padding = resolveValue(item.padding, defaultStyle.padding, 2);
// Returns: item.padding → defaultStyle.padding → 2 (fallback)
```

**When to use:** Style properties, configuration values, optional fields

---

## **Add Your Utils Here**

When you create a reusable function used in **multiple components**, add it here.

**Examples:**
- `formatDate.ts` — Format dates for display
- `validateEmail.ts` — Check if email is valid
- `calculateSize.ts` — Convert sizes or calculate dimensions
- `parseJSON.ts` — Safe JSON parsing with fallback
- `debounce.ts` — Delay function calls

**Rule:** If 2+ components use it → **move to utils/**

---

## **How to Create a Util**

1. Create file: `src/utils/myFunction.ts`
2. Write your function
3. Export it: `export const myFunction = (...) => { ... }`
4. Import in components: `import { myFunction } from '../utils/myFunction'`
5. Update this README with your new utility

---

## **Example: Create `formatLabel.ts`**

```typescript
// src/utils/formatLabel.ts

export const formatLabel = (text: string, uppercase?: boolean): string => {
  return uppercase ? text.toUpperCase() : text;
};
```

**Use in component:**
```typescript
import { formatLabel } from '../utils/formatLabel';

const label = formatLabel('hello', true); // "HELLO"
```

---

## 📖 Related

- **[../components/README.md](../components/README.md)** — Component building
- **[../config/README.md](../config/README.md)** — Config files

