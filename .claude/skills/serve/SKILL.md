---
name: serve
description: Run the ai1.place site locally with Python's built-in web server, to preview the homepage, Advisor, and Love Lock pages in a browser. Use when asked to run, serve, host, start, or preview the site, or to check a change in the real pages.
---

# Serve the site locally

The site is plain static HTML, CSS, and JS with no build step. Serve it from the repository root so absolute paths like `/advisor/style.css` resolve.

1. Start the server in the background (Bash with `run_in_background: true`), from the repo root:

   ```sh
   python3 -m http.server 8000 --bind 127.0.0.1
   ```

   If port 8000 is taken (`Address already in use`), use the next free port (8001, 8002, …) and say which one.

2. Tell the user the URLs:
   - Homepage: http://localhost:8000/
   - Advisor: http://localhost:8000/advisor/
   - Love Lock: http://localhost:8000/love-lock/

3. Leave it running until the user is done. Stop it with the background task's stop tool, or `pkill -f "http.server 8000"`.

Notes:
- The Advisor download button calls the GitHub Releases API from the browser, so it needs internet access. Offline, it falls back to linking the releases page.
- Files are read fresh on each request, so edits show up on reload. No restart is needed.
