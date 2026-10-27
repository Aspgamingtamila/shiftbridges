# ShiftBridge lightweight MVP

A compact workforce-coordination website with manager and staff screens, seeded records, and a tiny local API. It uses plain HTML, CSS, browser JavaScript, and Node's built-in modules. No framework, package install, or build step is needed.

## Start the website

Install Node.js if it is not already available, then open a terminal in this folder and run:

```text
node server.js
```

Open `http://127.0.0.1:4173`. `npm start` is also available. The server listens on this computer only. Changes save to `app-data.json` in the project folder and load again the next time you start it. To reset the demo, stop the server, delete `app-data.json`, and reload the page. Opening `index.html` directly still works as a browser-only demo, using that browser's local storage instead.

## Demo accounts

Choose **Switch** in the lower left to switch demo roles. No password is collected.

- Maya Chen — Administrator (`maya@shiftbridge.demo`)
- Noor Patel — Staff, Colleges & Schools (`noor@shiftbridge.demo`)
- Ravi Kumar — Staff, Hospitals (`ravi@shiftbridge.demo`)
- Amara Okafor — Staff, both modes (`amara@shiftbridge.demo`)

## Files

```text
shiftbridge/
├── index.html       page entry point
├── styles.css       responsive styling
├── app.js           screens, demo workflows, and API sync
├── server.js        static website server and JSON API
├── package.json     start script; no packages required
└── README.md
```

These six source files total about 47 KB. The 10 MB figure refers to the source project, which excludes the installed Node.js runtime and any `node_modules` directory; this project has no `node_modules` or build output. When run, the server creates `app-data.json` for demo records.

## What works in the demo

- Switch between Colleges & Schools and Hospitals; records stay associated with their selected mode.
- Add or deactivate staff and work areas.
- Create, review, and cancel shifts; get an overlap warning for staff assignments.
- Switch to a staff account to check in/out and update assigned tasks. Blocked tasks require a reason.
- Create and resolve handovers; review dashboard counts calculated from the saved records.
- Use the responsive layout on desktop and mobile browsers.

## Security and production boundary

This remains a **local hackathon demo**, not a production workforce system. Demo account selection is not authentication. The local JSON API has no login, server-side role checks, organization boundaries, audit log, or row-level security; anyone who can access the local server can read and change its demo records. Do not put real staff or sensitive information into it. Hospital examples are non-clinical; do not add patient details.

For production, replace this local API and JSON file with Supabase Auth, PostgreSQL migrations, and tested row-level security policies. Use trusted server/database functions for privileged changes such as attendance corrections and audit events. Keep service credentials out of browser code. The current demo does **not** satisfy the PRD's secure-authentication or RLS requirements.
