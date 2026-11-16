# Terminal Portfolio

---
A portfolio that emulates a linux-esque terminal in the browser, built with React. Poke around with real commands, or just click — everything printed in the terminal is clickable, and there's a quick bar at the bottom for anyone who'd rather not type.

### Commands

~~~
help                 List available commands (alias: --help)
ls [-a] [path]       List files in a folder
cd [path]            Change folder. "cd .." goes up, "cd" goes home
open [file]          Open a file in the viewer
cat [file]           Print a file right in the terminal
tree                 Show every file at once
projects             Jump to my projects
resume               Open my resume (PDF)
contact              How to reach me (alias: --contact)
neofetch             System info. Well, me info.
whoami               Who am I?
sudo hire-me         You know you want to.
clear                Clear the screen (or Ctrl+L)
exit                 Power off
~~~

Tab autocompletes commands and paths, ↑/↓ scroll through history. There are a few hidden commands too.

### Editing content

- `src/content/profile.ts` — name, tagline, neofetch rows, email and links
- `src/content/projects.ts` — every document (about, experience, projects)
- `src/features/FileSystem.ts` — where each file lives in the virtual folder tree
- `src/documents/` — the resume PDF

Documents can be linked directly, e.g. `/view/projects/nisd_hacks.txt`. If you host on a static host, add an SPA fallback (rewrite all routes to `index.html`) so those links work on refresh.

"Who doesn't love a little linux?" - Me
