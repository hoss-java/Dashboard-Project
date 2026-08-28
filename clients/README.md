![Logo](clients/public/logo192.png)

# React app generic-material ui dashboard

## React Material UI Dashboard - Getting Started

**Welcome to the React Material UI Dashboard!** This dashboard provides a solid foundation for building React applications with organized folder structure, testing setup, and error handling utilities.

### **Quick Start for New Projects**

Follow these sections in order to customize the dashboard for your specific app:

---

## **1. Customize Public Folder Files**

Start here to personalize your app's metadata and branding.

### **Update `public/index.html`**

Replace the default title and meta information:

```html
<title>Your App Name</title>
<meta name="description" content="Your app description here">
<meta name="theme-color" content="#your-color">
```

### **Update `public/manifest.json`**

Customize the web app manifest for your application:

```json
{
  "short_name": "YourAppShort",
  "name": "Your App Full Name",
  "description": "Your app description",
  "start_url": ".",
  "display": "standalone",
  "scope": "/",
  "theme_color": "#your-color",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "logo192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "logo512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

#### Tools
* Krita (PNG)
* https://convertico.com/image-to-ico/ (ICO)

### **Replace App Icons**

- **`public/favicon.ico`** - Browser tab icon (16×16, 32×32)
- **`public/logo192.png`** - App icon for home screens (192×192 pixels)
- **`public/logo512.png`** - App icon for splash screens (512×512 pixels)

Generate icons using tools like [favicon.io](https://favicon.io/) or [Real Favicon Generator](https://realfavicongenerator.net/).

### **Update `public/robots.txt`** (optional)

Configure search engine crawling rules for your domain:

```
User-agent: *
Allow: /
```

---

## **2. Project Structure Overview**

After customizing public files, familiarize yourself with the src structure:

| Folder | Purpose |
|--------|---------|
| **`src/components`** | Reusable React components (WelcomeScreen, ErrorBanner, Sections, shared components) |
| **`src/pages`** | Page-level components (full page views) |
| **`src/contexts`** | React Context API setup (DashboardContext for app state) |
| **`src/hooks`** | Custom React hooks |
| **`src/services`** | API calls and external services (ApiClient) |
| **`src/config`** | App configuration files (API endpoints, constants) |
| **`src/types`** | TypeScript type definitions (ErrorTypes, custom interfaces) |
| **`src/utils`** | Helper functions (errorHandler, errorMessages) |
| **`src/__mocks__`** | Mock data and jest mocks for testing |
| **`src/__tests__`** | Test files (alongside or separate from source) |

---

## **3. Core Setup Steps**

### **Install Dependencies**

```bash
npm install
```

### **Start Development Server**

```bash
npm start
```

The app opens at `http://localhost:3000/` and the **WelcomeScreen** displays a README from `public/README.md` to help developers onboard.

### **Build for Production**

```bash
npm run build
```

Outputs optimized files to the `build/` folder.

---

## **4. Key Features Already Configured**

### **WelcomeScreen Component**

Displays setup instructions from `public/README.md` when the app first loads. Edit the README in the public folder to provide developer-specific guidance.

### **DashboardContext**

Global state management using React Context API. Customize in `src/contexts/DashboardContext.tsx` to add app-specific state.

### **Error Handling**

- **`errorHandler.ts`** - Centralized error handling logic
- **`errorMessages.ts`** - Error message constants
- **`ErrorBanner`** - Component to display errors to users

### **API Client**

`src/services/ApiClient.ts` includes a pre-configured HTTP client for API requests. Update `src/config/apiConfig.ts` with your API endpoints.

### **Testing Setup**

- **Jest configuration** in `jest.config.js`
- **Test files** in `__tests__` folders throughout the project
- **setupTests.ts** for test environment configuration

Run tests with:

```bash
npm test
```

---

## **5. Development Workflow**

### **Add a New Component**

1. Create folder in `src/components/YourComponent/`
2. Add `YourComponent.tsx` and `YourComponent.css`
3. Create `src/components/YourComponent/__tests__/` for tests
4. Add a `README.md` in the component folder documenting its usage

### **Add a New Page**

1. Create folder in `src/pages/YourPage/`
2. Add page component file
3. Import in your routing setup (update `App.tsx`)

### **Add Custom Hooks**

1. Create hook file in `src/hooks/` (e.g., `useCustomHook.ts`)
2. Add test file in `src/hooks/__tests__/`
3. Document the hook in `src/hooks/README.md`

### **Update API Configuration**

1. Edit `src/config/apiConfig.ts` with your API base URL and endpoints
2. Use `ApiClient` service to make requests in your components

---

## **6. TypeScript Configuration**

This dashboard uses **TypeScript** for type safety. Key type files:

- **`src/types/ErrorTypes.ts`** - Error type definitions
- **`react-app-env.d.ts`** - React and CSS module types

Define custom types in `src/types/` as your app grows.

---

## **7. Customize Dashboard Context**

The `DashboardContext` provides global state. Edit `src/contexts/DashboardContext.tsx` to:

1. **Define your app state** (theme, user data, preferences)
2. **Create provider functions** for state updates
3. **Export context hooks** for component use

Example usage in components:

```tsx
import { useDashboardContext } from '../contexts/DashboardContext';

function MyComponent() {
  const { state, updateState } = useDashboardContext();
  // Use state here
}
```

---

## **8. Available Scripts**

```bash
npm start          # Run dev server
npm test           # Run tests
npm run build      # Build for production
npm run eject      # Eject from Create React App (irreversible)
```

---

## **9. Next Steps**

1. ✅ Customize `public/` folder (favicon, manifest, index.html)
2. ✅ Update `src/config/apiConfig.ts` with your API endpoints
3. ✅ Customize `DashboardContext` for your app state
4. ✅ Create your first page in `src/pages/`
5. ✅ Build components in `src/components/`
6. ✅ Update `App.tsx` with your routing and layout

---

## **Support & Documentation**

Each folder contains a `README.md` file with detailed documentation:

- `src/components/README.md` - Component guidelines
- `src/services/README.md` - API service documentation
- `src/config/README.md` - Configuration details
- `src/contexts/README.md` - Context usage
- `src/types/README.md` - Type definitions guide

---

**Happy coding! Start customizing the public folder, then move through the dashboard structure to build your app.** 🚀

---

This README:

✅ **Starts with public folder customization** (favicon, manifest, index.html) as you requested  
✅ **Provides clear next steps** after initial setup  
✅ **Includes a helpful table** for folder structure overview  
✅ **Explains existing features** (WelcomeScreen, DashboardContext, error handling)  
✅ **Gives practical workflow examples** for adding components and pages  
✅ **References individual folder READMEs** for detailed guidance


