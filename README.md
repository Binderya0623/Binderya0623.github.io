# Ц. Биндэрцэцэг — portfolio

Personal portfolio (Mongolian, anime-style theme). Plain HTML/CSS/JS with no build step, ready for GitHub Pages.

```
index.html                         Home ("Мэргэжил"): hero, about, experience, education, awards, skills, class, contact
art.html                           Drawings ("Хобби ба зураг"): gallery with full-size viewer, hobbies
courses/software-engineering.html  "Программ хангамжийн инженерчлэлийн үндэс" course page
assets/img/avatar.jpg              Profile picture
assets/img/art/                    Full-size drawings (thumb/ = small gallery versions)
assets/js/course-weeks.js          ← the 15-week plan (edit content here)
assets/js/course.js                Week list, filters, progress, glossary search
assets/js/art.js                   Gallery filter + viewer
assets/js/main.js                  Dark mode, menu, scroll animations, counters
assets/css/style.css               All styles (colors at the top)
```

## Common edits

- **Add the CV** (currently not published): copy the PDF to `assets/files/Bindertsetseg-Tseden-Ish-CV.pdf`, then in `index.html` add the download button shown in the comment inside `hero-actions`. Before publishing, remove your home address, date of birth and other private details from the PDF.
- **Change the profile picture**: replace `assets/img/avatar.jpg`, keeping the same name (a square image works best).
- **Add a drawing**:
  1. Put the full image in `assets/img/art/`.
  2. Make a smaller copy (about 760 px tall) in `assets/img/art/thumb/`. On a Mac:

     ```bash
     sips -s format jpeg -Z 760 NEW.jpg --out assets/img/art/thumb/NEW.jpg
     ```

  3. In `art.html`, copy one `<button class="art-card" …>` block and change `id`, `data-full`, `data-title`, `data-kind` (`digital` or `watercolor`), the image `src`/`alt`, and the caption.
- **Change a week's content**: edit `assets/js/course-weeks.js`. Wrap file names and commands in backticks to show them as code.
- **Add another class**: copy the `<article class="course-card">` block in `index.html`, and copy `courses/software-engineering.html` plus its weeks file.

## Publish on GitHub Pages

1. On github.com, create a **new public repository** named exactly `Binderya0623.github.io`. Do not add a README.
2. In Terminal:

   ```bash
   cd /Users/bindertsetseg/remote-doc/portfolio
   git init -b main
   git add .
   git commit -m "Initial portfolio site"
   git remote add origin https://github.com/Binderya0623/Binderya0623.github.io.git
   git push -u origin main
   ```

3. In the repo, open **Settings → Pages** and check that Source is *Deploy from a branch* → `main` / `(root)`.
4. After 1–2 minutes the site is live at **https://binderya0623.github.io**.

To update later: `git add . && git commit -m "..." && git push`.

> Everything in this folder becomes public, and every old version stays in git history.

## Preview locally

```bash
python3 -m http.server 8765 --directory /Users/bindertsetseg/remote-doc/portfolio
```

Then open http://localhost:8765.
