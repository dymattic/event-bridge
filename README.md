# event-bridge

Browser extension (Chrome/Firefox) to create, manage, and migrate VRChat scene
events across [vrc.tl](https://vrc.tl), [vrcpop.com](https://vrcpop.com) and
[rave.page](https://rave.page).

event-bridge doesn't scrape or crawl - it acts as **you**, in **your** browser,
with **your** logged-in session, performing the same actions you'd do by hand:
enter an event once, post it to the platforms you choose, keep the copies in
sync, migrate lineups between them.

## Independent project

event-bridge is an independent, open-source tool (WTFPL). It is **not affiliated
with, endorsed by, or a product of** vrc.tl, vrcpop.com or rave.page — the three
are equal integrations. Each connects differently: rave.page happens to expose a
public API and an auth-handoff page, while vrc.tl and vrcpop.com are driven
entirely through your own logged-in browser session (they have no public write
API). The UI ships its own neutral theme; it's built on the `@rave-page/ui`
component library, but uses it only as a component kit, not as branding.

Status: pre-alpha, under construction.

## License

[WTFPL](LICENSE).
