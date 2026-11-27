# ai1.place

The site served at [ai1.place](https://ai1.place/). It has three parts, each with its own stylesheet and images, so none depends on another's assets:

| Folder | URL | What it is |
| --- | --- | --- |
| `/` (`index.html`, `style.css`) | https://ai1.place/ | Homepage, sending visitors to both apps |
| `advisor/` | https://ai1.place/advisor/ | Advisor for macOS and Windows: features, screenshots, the download, support, and privacy |
| `love-lock/` | https://ai1.place/love-lock/ | Love Lock for iPhone and Apple Watch: features, support, and privacy |

The homepage shows each app's screenshot from that app's own `images/` folder.

## Advisor

`advisor/index.html` is Advisor's page and download. Its download button reads [this repository's Releases](https://github.com/ai1place/ai1place.github.io/releases) and links the newest macOS disk image. No account is required to download it. A stable release is preferred. When every release is a pre-release, the newest pre-release is offered and marked Preview.

Publish these assets on a Release of **this** repository (the Advisor source repository is private, so the page cannot read its releases):

| Asset | Role |
| --- | --- |
| `Advisor_X.Y.Z_aarch64.dmg` | Apple silicon build. This is the download button. |
| `Advisor_X.Y.Z_aarch64.dmg.sha256` | Checksum, linked next to the button. |
| `Advisor_X.Y.Z_x64.dmg` | Optional Intel build. Shown beside the Apple silicon download. |

The button uses the asset's browser download URL (`https://github.com/ai1place/ai1place.github.io/releases/download/...`).

| Page | URL | Used for |
| --- | --- | --- |
| `advisor/support.html` | https://ai1.place/advisor/support.html | Microsoft Partner Center support contact |
| `advisor/privacy.html` | https://ai1.place/advisor/privacy.html | Microsoft Partner Center privacy policy URL |

Both cover the macOS app and the Microsoft Store app, which is listed there as AI1 Advisor. Update the privacy policy whenever the app starts storing or sending something new. Support requests are issues on this repository, filed with the `.github/ISSUE_TEMPLATE/advisor.yml` form, which applies the `advisor` label.

`advisor/download.js` fills in the button, using `advisor/release.js` to pick the release.

The Windows app is on the Microsoft Store at https://apps.microsoft.com/detail/9nsvgv1rtxbn?hl=en-US&gl=US, listed as AI1 Advisor. The Advisor page and the homepage link to it beside the Mac download.

In `advisor/images/`, `robot.svg` is the app's robot, including the CSS classes that color its face. `app-icon.svg` is the macOS icon tile, and `og.png` is that tile at 1200×1200 for link previews. The `mood-*.svg` faces are the robot in the app's on-screen state colors.

The screenshots show made-up sessions. They come from `app/scripts/screenshots.sh` in the Advisor repository, which runs a throwaway copy of the app. Convert them for the page with:

```sh
cwebp -q 88 -alpha_q 100 .screenshots/01-window.png -o advisor/images/window.webp
cwebp -q 88 -alpha_q 100 .screenshots/02-menu.png -o advisor/images/menu.webp
```

`02-menu.png` is the menu alone. The page draws the menu bar above it in CSS, and lines the robot up with the menu using numbers the script prints. If a new shot changes them, update `.menu-shot` in `advisor/style.css`. The menu bar's robots (`tray-*.png`) are the app's own tray icons from `app/src-tauri/icons/`, scaled with `sips -Z 88`.

## Love Lock

`love-lock/` holds the pages for the Love Lock iPhone app and its Apple Watch app. It has its own `style.css` and `images/`, so it doesn't depend on the Advisor assets.

| Page | URL | Used for |
| --- | --- | --- |
| `love-lock/index.html` | https://ai1.place/love-lock/ | Features and screenshots (App Store marketing URL) |
| `love-lock/privacy.html` | https://ai1.place/love-lock/privacy.html | App Store Connect Privacy Policy URL |
| `love-lock/support.html` | https://ai1.place/love-lock/support.html | App Store Connect Support URL |

The app is on the App Store at https://apps.apple.com/us/app/love-lock-countdowns/id6832439251. The Love Lock pages link to it, and set `apple-itunes-app` so Safari on iPhone shows the Smart App Banner.

Support requests are issues on this repository, filed with the `.github/ISSUE_TEMPLATE/love-lock.yml` form, which applies the `love-lock` label. The screenshots show made-up sample locks. They come from `scripts/screenshots.sh` in the Love Lock repository.

The Apple Watch shots (`watch-*.jpg`, 422 × 514) come from that script's `capture watch`, converted with `sips -s format jpeg -s formatOptions 88`. The homepage and the Love Lock hero pair `lock-screen.jpg` with `watch-face.jpg`, the Modular Ultra face at 9:41 to match the phone, and `watch-wayfinder.jpg` shows its hands at 10:09. watchOS simulators can't override the time, so those two were taken by shifting the watch simulator's clock zone: `xcrun simctl spawn <watch> launchctl setenv TZ Etc/GMT-10`, restarting Carousel (`launchctl kill SIGTERM system/com.apple.Carousel`), and taking `xcrun simctl io <watch> screenshot` during the real minute that reads 9:41 (or 10:09) there. The countdowns don't move, because the widget extension doesn't see `TZ`. Afterwards, `launchctl unsetenv TZ`.

## Copyright

Copyright © 2026 Chris Earle. All rights reserved.

This repository is publicly available for viewing only. No permission is granted to copy, modify, distribute, or otherwise reuse the source code without prior written permission, except as required by applicable law or GitHub's Terms of Service.
