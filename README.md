# NIMO 🧠

**NIMO** is an elderly-accessible cognitive gaming and memory-assistance app — gentle brain games, daily reminders, and a caregiver view, built with love for our elders across the North East. It's built with **Expo + React Native + Expo Router**, so the same code runs on Web, Android, and iOS.

Supported by the Ministry of Development of North Eastern Region (MDoNER).

---

## What's inside

- 🔐 **Private accounts** — 4-digit PIN sign-up/sign-in/sign-out, stored only on your own device (nothing goes to any server)
- 🎮 **6 brain games** — Memory Garden, Pattern Path, Picture Recall, Word Trek, Math Rain, Family Play (2-player)
- 📈 Real progress tracking (Memory / Attention / Language / Problem Solving scores)
- ⏰ Reminders (medication, appointments, hydration, etc.)
- 🌐 8 languages — English, Hindi, Assamese, Bengali, Manipuri, Khasi, Mizo, Nagamese
- ♿ Large text mode for accessibility

This is easy enough to run on your laptop in **5-10 minutes**, even if you've never used Expo before. Just follow the steps below one by one.

---

## 1. Install the tools you need (one-time setup)

You only need to do this once on your computer.

### a) Install Node.js

NIMO needs **Node.js version 20 or newer**.

1. Go to [nodejs.org](https://nodejs.org/)
2. Download the **LTS** version and install it (just keep clicking "Next")
3. Check it worked — open a terminal (Command Prompt / PowerShell / Terminal) and run:

```bash
node -v
```

You should see something like `v20.x.x` or higher. If you see an error like "node is not recognized", restart your computer after installing and try again.

### b) Get a code editor (optional but recommended)

[VS Code](https://code.visualstudio.com/) is free and works great with this project.

### c) Get Git (to download the project)

- Windows: [git-scm.com](https://git-scm.com/downloads) → install with default options
- Mac: usually already installed (check with `git --version` in Terminal)

---

## 2. Download the project

Open a terminal, go to a folder where you want the project (like your Desktop), and run:

```bash
git clone https://github.com/dipanjanroy2/nimo.git
cd nimo
```

If you already have the folder (someone gave you a zip, etc.), just open a terminal **inside that `nimo` folder** and skip to the next step.

> ⚠️ **Important:** Make sure you're on the `rebuild-source` branch — that's the one with the actual app code. `main` only has a pre-built export.
>
> ```bash
> git checkout rebuild-source
> ```

---

## 3. Install the project's dependencies

Still inside the `nimo` folder, run:

```bash
npm install
```

This downloads all the libraries the app needs (React, Expo, etc.). It will take a minute or two and create a `node_modules` folder — that's normal, don't touch it.

If you ever see red errors here, just run `npm install` again — sometimes the first try just needs a retry.

---

## 4. Run the app in your browser (easiest way)

This is the fastest way to see NIMO working — no phone needed.

```bash
npx expo start --web
```

Wait for it to finish bundling (you'll see `Web Bundled` in the terminal), and it will automatically open **http://localhost:8081** (or a similar port) in your browser.

That's it — you should see the NIMO welcome screen! 🎉

**Try the full flow:**
1. Tap "Let's Begin" → pick a language → tap Continue
2. Create a private account — enter a name and choose a 4-digit PIN (e.g. `1234`)
3. Confirm the PIN, complete the 3-step onboarding
4. Play any of the 6 games from the Home or Games tab
5. Go to Profile → Sign Out, then sign back in with your PIN to see your progress is saved

To stop the server, go back to the terminal and press `Ctrl + C`.

---

## 5. Run it on your phone (optional)

Want to see it on an actual Android/iPhone?

1. Install the **Expo Go** app from the Play Store / App Store on your phone
2. Run this in the project folder instead:

   ```bash
   npx expo start
   ```

3. A QR code will appear in the terminal
4. Open the **Expo Go** app on your phone and scan that QR code
5. Make sure your phone and laptop are on the **same Wi-Fi network**

---

## 6. Building a shareable web version (optional)

If you want a static, shareable build (like the `dist/` folder already in this repo):

```bash
npx expo export --platform web
```

This creates/updates a `dist` folder with plain HTML/JS/CSS files. You can then serve it with any static file server, for example:

```bash
npx serve dist
```

---

## Project structure (for the curious)

```
app/              → every screen/route (Expo Router — file name = URL path)
  (tabs)/         → the 5 main tabs: home, games, progress, reminders, profile
  games/          → the 6 games
  sign-up.tsx     → create account (PIN)
  sign-in.tsx     → sign in with PIN
src/
  components/     → shared UI (buttons, cards, pin pad, etc.)
  store/          → app-wide state (account, progress, settings) — src/store/AppProvider.tsx
  lib/            → game data, scoring logic, storage helpers
  i18n/           → translations for all 8 languages
  theme.ts        → colors, spacing, fonts — one place to restyle the whole app
```

---

## Common problems & fixes

| Problem | Fix |
|---|---|
| `node: command not found` | Node.js isn't installed properly — reinstall from nodejs.org and restart your terminal |
| `npm install` fails with red errors | Delete the `node_modules` folder and `package-lock.json`, then run `npm install` again |
| Browser shows a blank white page | Check the terminal for red error text — usually a typo in a file. Press `Ctrl+C` and run `npx expo start --web` again |
| Port 8081 already in use | Close other running `expo start` terminals, or just let Expo pick a different port when it asks |
| Changes to code aren't showing up | Save the file, then refresh the browser tab (Expo usually auto-refreshes, but a manual refresh always works) |

---

## Notes

- No backend/server is used — everything (accounts, progress, reminders) is stored locally on the device using `AsyncStorage`. Nothing is uploaded anywhere.
- The account PIN is never stored in plain text — it's hashed (SHA-256 + random salt) before saving.
- "Reset App Data" on the Profile screen wipes everything on that device and cannot be undone.

Built for NER 🌿
