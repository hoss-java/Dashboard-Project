# 🔧 Services Folder

Business logic and API calls used across **multiple components or pages**.

---

## **Current Services**

### **`ComponentRegistry.ts`**
Manages component registration and lookup.
```typescript
const component = componentRegistry.getComponent('box');
```

---

## **When to Add Here**

✅ **Used in 2+ components** → Add to `services/`  
❌ **Used in 1 component only** → Keep it in that component's folder

---

## **How to Create**

1. Create `src/services/myService.ts`
2. Export: `export const myService = { ... }` or `export class MyService { ... }`
3. Import: `import { myService } from '../services/myService'`

**Examples:**
- API calls (fetch data from backend)
- Data transformations
- Authentication logic
- Cache management

---

## 📖 Related

- **[../utils/README.md](../utils/README.md)**
- **[../components/config/README.md](../components/config/README.md)**
