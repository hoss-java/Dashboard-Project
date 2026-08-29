
# 📚 Quick Start Guides (Read in Order)

1. **[WINDOWS_SETUP.md](./WINDOWS_SETUP.md)** ⚡ — **START HERE** if you're on Windows
   - Node.js installation, Git, IntelliJ IDEA setup
   
2. **[GITHUB_KANBAN_GUIDE.md](./GITHUB_KANBAN_GUIDE.md)** 📋 — **READ SECOND** before coding
   - How to use the Kanban board, create cards, assign work

3. **[Quick Start - Let's Play with Code](./clients/README.md)** 🎮 — **Code exercises** (in this README)
   - 4 hands-on simple steps to know more the system

4. **[src/config/README.md](./src/config/README.md)** ⚙️ — Config files explained
   - `dashboardItems.json`, `defaultStyle.json`, `componentRegistry.json`

5. **[clients/dashboard/src/components/README.md](./clients/dashboard/src/components/README.md)** 🏗️ — Build your first component
   - Step-by-step Label component tutorial

6. **[WINDOWS_EMERGENCY_SETUP.md](./WINDOWS_EMERGENCY_SETUP.md)** 🆘 — **Only if stuck**
   - Nuclear option: start fresh & copy files

---

# 🖥️ Windows Setup Guide

This guide walks Windows users through cloning the repository, installing dependencies, running the development server, and working with branches in **IntelliJ IDEA**.

---

## 1️⃣ Prerequisites

### Install Node.js (Windows)

**Why?** Node.js includes npm (Node Package Manager), which manages all project dependencies.

1. Go to **[nodejs.org](https://nodejs.org)**
2. Download the **LTS (Long Term Support)** version — **v20.x** or **v22.x** (whichever is recommended)
3. Run the installer (`.msi` file)
   - Accept the default settings
   - **Important:** Ensure "Add to PATH" is checked
4. **Verify installation** — Open PowerShell or Command Prompt and run:
   ```bash
   node --version
   npm --version
   ```
   You should see version numbers (e.g., `v20.11.0` and `10.2.4`).

### Install Git (Windows)

**Why?** Git is needed to clone the repository and manage branches.

1. Go to **[git-scm.com](https://git-scm.com)**
2. Download the **Windows** installer
3. Run it and accept default settings
4. **Verify installation** — Open PowerShell or Command Prompt:
   ```bash
   git --version
   ```
   You should see a version number.

---

## 2️⃣ Clone the Repository

### Step 1: Open PowerShell or Command Prompt

On Windows 10/11:
- **Right-click** on the desktop or a folder
- Select **"Open in Terminal"** (or **"Open PowerShell here"**)

Or press **Windows + R**, type `powershell`, and hit Enter.

### Step 2: Navigate to Your Work Directory

```bash
cd Desktop
```

(or any folder where you want to store the project)

### Step 3: Clone the Repository

Replace `YOUR_REPO_URL` with the actual Git repository URL:

```bash
git clone YOUR_REPO_URL
```

Example:
```bash
git clone git@github.com:hoss-java/Dashboard-Project.git
```

This creates a folder called `react-template` (or whatever your repo name is).

### Step 4: Enter the Project Directory

```bash
cd Dashboard-Project
```

---

## 3️⃣ Install Dependencies

Run this command to download all required packages:

```bash
npm install
```

**What does this do?**
- Reads `package.json` and `package-lock.json`
- Downloads all dependencies into a `node_modules/` folder
- This may take 1–2 minutes the first time

**⚠️ Common Issue — Node/npm version mismatch:**

If you get errors, check your versions match the team's setup:

```bash
node --version
npm --version
```

Ask your team lead for their exact versions. If yours differ:
- Update Node.js from [nodejs.org](https://nodejs.org)
- Update npm:
  ```bash
  npm install -g npm@latest
  ```

---

## 4️⃣ Run the Development Server

### Start the Server

```bash
npm start
```

**What happens:**
- React builds and starts a local server on `http://localhost:3000`
- A browser window should automatically open
- You'll see the app running

**To stop the server:** Press **Ctrl + C** in the terminal.

---

## 5️⃣ Open in IntelliJ IDEA

### Method 1: Open from IntelliJ

1. Open IntelliJ IDEA
2. Click **File → Open**
3. Navigate to your `react-template` folder
4. Click **Open** (IntelliJ recognizes it as a React project)

### Method 2: Open from Command Line

In your project folder:
```bash
idea .
```

(This opens IntelliJ from the current directory)

### First Run in IntelliJ

- IntelliJ may ask to configure the project — click **"Trust Project"**
- It will index files (takes 30 seconds to 1 minute)
- You can now edit files directly in the IDE

---

## 6️⃣ Create Your Own Branch (Critical for Team Collaboration)

### Why Branches?

When 22 people work on the same project, branches prevent **merge conflicts**. Each person works on their own isolated branch, then merges changes back to the main branch.

### Step 1: Create a New Branch

Before making any changes, create a branch with **YOUR NAME**:

```bash
git checkout -b your-name-feature
```

**Examples:**
```bash
git checkout -b glory
git checkout -b hala
git checkout -b andreas
```

### Step 2: Verify You're on the New Branch

```bash
git branch
```

You should see your branch listed with an asterisk (`*`) next to it.

### Step 3: Make Your Changes

- Edit files in IntelliJ IDEA
- Test locally with `npm start`
- Make commits as you work

### Step 4: Commit Your Changes

After each meaningful change:

```bash
git add .
git commit -m "Description of what you changed"
```

**Examples:**
```bash
git commit -m "Add new Label component"
git commit -m "Fix spacing in Card component"
git commit -m "Update dashboard items JSON"
```

### Step 5: Push Your Branch to GitHub

```bash
git push origin your-name-feature
```

**First time?** Git will prompt you to set the upstream branch — just follow the instructions or use:
```bash
git push -u origin your-name-feature
```

### Step 6: Create a Pull Request (PR) on GitHub

1. Go to your GitHub repository
2. You'll see a prompt: **"Your branch [your-name-feature] had recent pushes"**
3. Click **"Compare & pull request"**
4. Add a description of your changes
5. Click **"Create Pull Request"**
6. Your team lead or project manager reviews and merges it

---

## 7️⃣ Switching Between Branches

If you need to switch to another branch or back to `main`:

```bash
git checkout main
git pull origin main
```

(Get the latest version from GitHub)

Then switch to your branch:
```bash
git checkout your-name-feature
```

---

## 8️⃣ Useful Commands Cheat Sheet

| **What You Want** | **Command** |
|---|---|
| Start development server | `npm start` |
| Install dependencies | `npm install` |
| Create a new branch | `git checkout -b your-name-feature` |
| Check current branch | `git branch` |
| Make a commit | `git commit -m "Your message"` |
| Push to GitHub | `git push origin your-name-feature` |
| Pull latest from main | `git checkout main && git pull origin main` |
| See git status | `git status` |
| View recent commits | `git log --oneline` |

---

## ❓ Troubleshooting

### **"npm: command not found"**
- Node.js wasn't installed correctly or not added to PATH
- Restart PowerShell/Command Prompt after installing Node.js
- Verify: `node --version` and `npm --version`

### **"Permission denied" or "cannot access node_modules"**
- Delete `node_modules/` folder
- Delete `package-lock.json`
- Run `npm install` again

### **"Port 3000 already in use"**
```bash
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# Or just use a different port
npm start -- --port 3001
```

### **Git conflicts when pulling**
- Don't worry — ask your team lead or check [Git conflict resolution guide](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts/resolving-a-merge-conflict-using-the-command-line)

### **"Your branch is ahead of origin"**
- Push your changes: `git push origin your-name-feature`

---

## ✅ Success Checklist

- ✅ Node.js and npm installed and verified
- ✅ Repository cloned
- ✅ `npm install` completed
- ✅ `npm start` runs without errors
- ✅ App opens in browser at `http://localhost:3000`
- ✅ Created a personal branch (e.g., `john-feature`)
- ✅ IntelliJ IDEA configured and project opened

---

## 📚 Next Steps

- Read the main **[README.md](./README.md)** for architecture overview
- Check **[src/config/README.md](./src/config/README.md)** to understand JSON data files
- Explore **[src/components/README.md](./src/components/README.md)** for component tutorials
- Start with the "Quick Start - Let's Play with Code" stepss in the main README

---

## 🆘 Stuck? Emergency Setup

If `npm install` or `npm start` fails and you're stuck, we have a **quick recovery guide**:

📖 **[WINDOWS_EMERGENCY_SETUP.md](./WINDOWS_EMERGENCY_SETUP.md)** — Start Fresh & Copy Files


