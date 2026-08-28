# 🆘 EMERGENCY SETUP (If Nothing Works)

## If `npm install` or `npm start` fails...

---

## **OPTION: Start Fresh & Copy Files**

### Step 1: Create a NEW Empty React Project

Open PowerShell and run:

```bash
npx create-react-app my-project
cd my-project
```

**Wait** — this takes 2-3 minutes.

---

### Step 2: Copy These Folders from GitHub

From your cloned repo, copy these 4 folders into your **new** `my-project`:

```
src/components/
src/config/
src/contexts/
src/hooks/
```

**Replace** the existing `src/components/` in your new project.

---

### Step 3: Copy These Files

Copy these files into the **root** of your new project:

```
src/App.tsx
src/index.tsx
src/index.css
public/manifest.json
tsconfig.json
```

---

### Step 4: Install Material-UI

```bash
npm install @mui/material @emotion/react @emotion/styled
```

---

### Step 5: Run It

```bash
npm start
```

**Done!** ✅ It should work.

---

## **Why This Works**

- `create-react-app` gives you a **clean environment**
- You copy only the **essential files**
- No version conflicts or corrupted `node_modules`

---

## **Then Work Normally**

Create your branch:
```bash
git checkout -b your-name-feature
```

Make changes, commit, push — same as before.

```

---

## **Big Font Version (for sending to team):**

```markdown
# 🆘 EMERGENCY SETUP

# IF NOTHING WORKS — DO THIS

---

## # STEP 1: CREATE NEW PROJECT

```bash
npx create-react-app my-project
cd my-project
```

**WAIT 2-3 MINUTES**

---

## # STEP 2: COPY 4 FOLDERS FROM GITHUB REPO

**Copy these into your new project's `src/` folder:**

- `components/`
- `config/`
- `contexts/`
- `hooks/`

---

## # STEP 3: COPY THESE FILES TO ROOT

- `src/App.tsx`
- `src/index.tsx`
- `src/index.css`
- `public/manifest.json`
- `tsconfig.json`

---

## # STEP 4: INSTALL MATERIAL-UI

```bash
npm install @mui/material @emotion/react @emotion/styled
```

---

## # STEP 5: RUN IT

```bash
npm start
```

# ✅ DONE!

---

## # NOW WORK NORMALLY

```bash
git checkout -b your-name-feature
```

Edit → Commit → Push → Create PR
