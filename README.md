# Advisor

Public download page for Advisor on macOS, served at [aione.page](https://aione.page/).

The page reads [this repository's Releases](https://github.com/ai1place/ai1place.github.io/releases) and links the newest macOS disk image. No account is required to download it. A stable release is preferred. When every release is a pre-release, the newest pre-release is offered and marked Preview.

Publish these assets on a Release of **this** repository (the Advisor source repository is private, so the page cannot read its releases):

| Asset | Role |
| --- | --- |
| `Advisor_X.Y.Z_aarch64.dmg` | Apple silicon build. This is the download button. |
| `Advisor_X.Y.Z_aarch64.dmg.sha256` | Checksum, linked next to the button. |
| `Advisor_X.Y.Z_x64.dmg` | Optional Intel build. Shown beside the Apple silicon download. |

The button uses the asset's browser download URL (`https://github.com/ai1place/ai1place.github.io/releases/download/...`).

`icons/robot.svg` is the app's robot, including the CSS classes that color its face. `icons/app-icon.svg` is the macOS icon tile. The `mood-*.svg` faces are that robot in the app's on-screen state colors.

## Love Lock

`love-lock/` holds the pages for the Love Lock iPhone app. It has its own `style.css` and `images/`, so it doesn't depend on the Advisor assets.

| Page | URL | Used for |
| --- | --- | --- |
| `love-lock/index.html` | https://ai1.place/love-lock/ | Features and screenshots (App Store marketing URL) |
| `love-lock/privacy.html` | https://ai1.place/love-lock/privacy.html | App Store Connect Privacy Policy URL |
| `love-lock/support.html` | https://ai1.place/love-lock/support.html | App Store Connect Support URL |

Support requests are issues on this repository, filed with the `.github/ISSUE_TEMPLATE/love-lock.yml` form, which applies the `love-lock` label. The screenshots show made-up sample locks. They come from `scripts/screenshots.sh` in the Love Lock repository.

## Copyright

Copyright © 2026 Chris Earle. All rights reserved.

This repository is publicly available for viewing only. No permission is granted to copy, modify, distribute, or otherwise reuse the source code without prior written permission, except as required by applicable law or GitHub's Terms of Service.
