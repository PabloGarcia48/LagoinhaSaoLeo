# AGENTS.md - Lagoinha São Leopoldo Site

## Project Context

This is a static linktree-style website for Igreja Lagoinha São Leopoldo.
The project is mobile first: the phone experience must be clear, lightweight, and easy to tap through.

Main files:

- `index.html`: page structure
- `styles/styles.css`: visual styling
- `scripts/script.js`: page interactions
- `data/gallery.json`: gallery album data
- `assets/fotos-cultos/`: worship photo folders grouped by date

## Style And UX

- Prioritize mobile-first layouts.
- Keep the dark, elegant visual style consistent with the existing CSS variables.
- Use compact cards with `border-radius: 8px`.
- Avoid large sections expanded by default, especially on mobile.
- Do not turn the page into a landing page; it should remain a practical page for links and church information.
- Visible website copy should stay in Brazilian Portuguese.
- Website text should be short, pastoral, and direct.
- Preserve the general section order unless Pablo explicitly asks to change it.

Preferred current section order:

1. Church profile
2. Main links
3. "Encontros em nossa Igreja"
4. "GCs - Grupos de Crescimento"
5. "Oração"
6. "Contribuição"
7. "Fotos dos cultos"
8. Footer/developer signature

## "Encontros em nossa Igreja"

The old "Agenda" section was changed into "Encontros em nossa Igreja".
This section should describe the gatherings that happen at the church building:

- "Culto de celebração": Sunday, 19h
- "GC Legacy": Henrique e Janaína

Correct church address:

`Av. Caxias do Sul, 1191 - São Leopoldo`

Do not use "Senador Salgado Filho" for the church or for GC Legacy.

## "GCs - Grupos de Crescimento"

The GCs section lists neighborhood/home groups, with:

- GC name
- leaders
- address
- WhatsApp button
- "Ver no mapa" button

GC Legacy was removed/commented out from the GCs section to avoid duplication, because it already appears in "Encontros em nossa Igreja".
Only add GC Legacy back to the GCs section if Pablo explicitly asks for it.

Before publishing WhatsApp changes, confirm any phone numbers that look incomplete or oddly punctuated.
`wa.me` links must use numbers only, including country code and area code. Example:

`https://wa.me/5551995888855`

## Photo Gallery

Worship photos are stored in date-based folders:

`assets/fotos-cultos/YYYY-MM-DD/`

Example:

`assets/fotos-cultos/2026-08-02/`

The gallery starts collapsed by default. Users choose a date to open the photos.
Keep this behavior because it was a mobile-first decision.

When adding or removing photos, update the JSON with:

`node scripts/build-gallery-data.mjs`

The script should:

- read all folders in `assets/fotos-cultos/`
- ignore files that are not images
- sort albums from newest to oldest
- use every photo found, with no fixed photo limit

After running it, validate the count with something equivalent to:

`node -e "const fs=require('fs'); const albums=JSON.parse(fs.readFileSync('data/gallery.json','utf8')); console.log(albums.map(a=>a.date+': '+a.photos.length).join('\n'));"`

## Developer Footer

The footer has a developer signature for Pablo Garcia, with contact and portfolio links.
Keep it discreet and below the church information.

Portfolio:

`https://pablogarcia48.github.io/CurriculoPortfolio/`

## Commands And Validation

Whenever JavaScript changes, validate with:

`node --check scripts/script.js`

Before finishing, check:

`git status --short`

When working on this machine, prefer shell commands through `rtk`, following Pablo's global instruction.

## Cautions

- Do not overwrite Pablo's manual changes.
- The current project folder was moved out of OneDrive:

`/Users/pablogarcia-dev/Trabalho/Lagoinha/A_Site`

- If an old OneDrive path appears in context, confirm and use the local folder above before editing.
