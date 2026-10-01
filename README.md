# HydroRegen website

Static marketing site for HydroRegen, served by GitHub Pages at https://hydroregen.github.io.
Plain HTML, CSS and JavaScript. No build step, no dependencies.

## Pages

| File | Page |
|---|---|
| `index.html` | Home |
| `hydrobuddy.html` | HydroBuddy (impact auditing app) |
| `products.html` | Products: Mini, HydroRegen, Pro, HydroCell + comparison |
| `technology.html` | Technology: barrier, breakthrough, reaction |
| `schools.html` | Schools & Community |
| `industry.html` | Industry & Gulf |
| `partner.html` | Partner with us (form) |
| `404.html` | Not found page |

## Edit common things

- **Colours and fonts:** tokens at the top of `assets/css/style.css` (`--accent`, `--accent-2`, `--deep`, `--font`, `--mono`).
- **Partner form destination:** top of `assets/js/main.js`. Set `CONTACT_EMAIL` to your inbox, or set `FORM_ENDPOINT` to a Formspree / Getform URL to receive submissions without the visitor's email app.
- **Patent wording:** Technology page says "Patent filing planned". Change to "Patent pending in Singapore and Malaysia" only after filing.
- **Images:** `assets/img/`. Logo is `logo.png`, shown unchanged on a white chip.

## Content rules

- Describe what HydroRegen does, never how (no reactor geometry, recovery chemistry or control logic).
- Keep labels honest: "Illustrative data", "Target", "In development".
- Keep numbers identical to the pitch deck.
