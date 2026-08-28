# resolveValue Utility

**Location**: `src/components/utils/resolveValue.ts`

A **tiny but powerful** helper that solves a common problem: *"Which value should I use?"*

---

## What It Does

Takes a **list of candidates** and returns the **first one that's actually defined** (not `undefined` or `null`).

Think of it like asking friends for a recommendation in order of preference:
1. Ask Friend A (highest priority)
2. If they don't answer, ask Friend B
3. If they don't answer, ask Friend C
4. If no one answers, you get `undefined`

---

## Function Signature

```typescript
export function resolveValue<T>(...candidates: (T | undefined | null)[]): T | undefined
```

| Part | Meaning |
|------|---------|
| `<T>` | Generic type — works with any data type |
| `...candidates` | Variable number of arguments, each can be a value, `undefined`, or `null` |
| Returns | First defined value, or `undefined` if all are empty |

---

## Examples

### Example 1: Simple Number
```typescript
const fontSize = resolveValue(item.fontSize, defaultStyle?.fontSize, 16);
// If item.fontSize = 20, returns 20
// If item.fontSize = undefined but defaultStyle.fontSize = 18, returns 18
// If both undefined, returns 16
```

### Example 2: String
```typescript
const fontWeight = resolveValue(item.fontWeight, defaultStyle?.fontWeight, 'normal');
// Returns first non-null value: item value → default style → 'normal'
```

### Example 3: All Undefined
```typescript
const result = resolveValue(undefined, null, undefined);
// Returns undefined
```

### Example 4: Mixed Values
```typescript
resolveValue(null, 'second', 'third');
// Returns 'second' (first defined)

resolveValue(undefined, 0, 100);
// Returns 0 (zero is defined, not undefined)
```

---

## Why It Matters

### Without resolveValue (verbose):
```typescript
let fontSize = item.fontSize;
if (fontSize === undefined || fontSize === null) {
  fontSize = defaultStyle?.fontSize;
  if (fontSize === undefined || fontSize === null) {
    fontSize = 16;
  }
}
```

### With resolveValue (clean):
```typescript
const fontSize = resolveValue(item.fontSize, defaultStyle?.fontSize, 16);
```

---

## How Components Use It

Every component follows the same **value resolution pattern**:

```typescript
const fontSize = resolveValue(
  item.fontSize,              // 1st priority: item property
  defaultStyle?.fontSize,     // 2nd priority: global default
  16                          // 3rd priority: hardcoded fallback
);
```

**Priority Chain**:
1. **Item-level** (most specific, highest priority)
2. **Global default** (shared across all items)
3. **Hardcoded fallback** (built-in default, lowest priority)

---

## Use Cases in the App

| Component | What Gets Resolved | Priority Chain |
|-----------|-------------------|-----------------|
| **TextComponent** | `fontSize`, `fontWeight`, `content` | item → defaultStyle → hardcoded |
| **BoxComponent** | `padding`, `gap`, `align`, `showBorder`, `borderColor`, `backgroundColor` | item → defaultStyle → hardcoded |
| **CardComponent** | `padding`, `gap`, `title`, `footer`, `showBorder`, `borderColor`, `backgroundColor` | item → defaultStyle → hardcoded |

---

## Key Characteristics

✅ **Type-safe** — Works with any type via generics  
✅ **Null-safe** — Treats both `null` and `undefined` as "empty"  
✅ **Short-circuit** — Stops at first defined value (efficient)  
✅ **Flexible** — Works with numbers, strings, booleans, objects, etc.  
✅ **Simple** — No complex logic, just linear checking

---

## Edge Cases

| Input | Output | Reason |
|-------|--------|--------|
| `resolveValue(undefined, undefined, 'default')` | `'default'` | Both first and second are empty |
| `resolveValue(0, 100)` | `0` | Zero is defined (falsy ≠ undefined) |
| `resolveValue(false, true)` | `false` | False is defined |
| `resolveValue('')` | `''` | Empty string is defined |
| `resolveValue()` | `undefined` | No candidates provided |

---

## Real-World Example

**dashboardItems.json**:
```json
{
  "id": "title",
  "type": "text",
  "fontSize": 24
}
```

**defaultStyle.json**:
```json
{
  "fontSize": 14,
  "fontWeight": "bold"
}
```

**TextComponent Resolution**:
```typescript
const fontSize = resolveValue(24, 14, 16);           // → 24
const fontWeight = resolveValue(undefined, "bold", "normal"); // → "bold"
const content = resolveValue(undefined, undefined, ''); // → ''
```

**Result**: 24px bold text with empty content (shows nothing)

---

## When NOT to Use

- **Default parameters**: Use `function(x = 10)` instead
- **Optional chaining alone**: `item?.fontSize` if you don't need fallbacks
- **Ternary chains**: Only if priority order matters and you need clarity

When **priority order matters** and you have **multiple fallback levels** → this is the tool.

