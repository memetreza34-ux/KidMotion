# Public episode runtime assets

This directory is generated/maintained by `npm run kidmotion:activate`.

## Structure

```text
public/episodes/
└── YYYY-MM-DD/
    └── KM-XXX-theme-slug/
        ├── images/ -> episode final image directory
        └── audio/  -> episode audio directory
```

Example:

```text
public/episodes/2026-10-04/KM-003-full-body-workout/
├── images/
└── audio/
```

The old flat aliases such as `KM-002-bilder` and `KM-002-audio` are legacy and must not be used.

Canonical production files remain under `episodes/KM-XXX-theme-slug/`. The `public/episodes/...` tree only exposes the active episode assets to Remotion.
