# Archived sections

The al-Qūhī (Trisection by Conic Sections) and Abū al-Wafāʾ (Trigonometric
identities) sections were removed from the live project on 2026-05-10.

Files saved here so the work can be restored later:

- `geometry-original.js` — full original `js/geometry.js` (contained both
  al-Qūhī trisection and the Pythagorean theorem). The live `js/geometry.js`
  now keeps only the Pythagorean theorem section.
- `wafa.js` — full original `js/wafa.js` (Abū al-Wafāʾ identities).
- `index-html-snippets.html` — the HTML pieces removed from `index.html`
  (home card, panels, tab buttons, scholar cards, script include).
- `i18n-snippets.js` — the Arabic/English i18n keys removed from `js/i18n.js`.
- `home-facts-snippet.js` — the al-Qūhī home-facts entry removed from
  `js/home-facts.js`.

To restore: copy the snippets back into the corresponding files, restore
`js/wafa.js`, restore the al-Qūhī half of `js/geometry.js` from
`geometry-original.js`, and re-add the `<script src="js/wafa.js?v=102">` tag
to `index.html`.
