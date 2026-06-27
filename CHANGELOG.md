# Changelog

All notable changes to `@arraypress/waveform-player-astro` are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Types are now sourced directly from the core
  `@arraypress/waveform-player` package — a single source of truth. The
  shared option types (`WaveformStyle`, `ColorPreset`, `AudioMode`,
  `AudioPreload`, `ButtonAlign`, `WaveformMarker`, `WaveformPeaks`) are
  re-exported from the core, and `WaveformPlayerProps` now `extends` the
  core's `WaveformPlayerOptions` instead of re-declaring every option, so
  the two packages can no longer drift. Every previously-exported type name
  is preserved.
- Bumped the `@arraypress/waveform-player` peer (and dev) dependency to
  `^1.8.0`, which ships the hand-authored `index.d.ts` these types adopt.

### Added

- `accessibleSeek`, `seekLabel`, `barRadius`, and the gradient-array forms
  of `waveformColor` / `progressColor` are now exposed on
  `WaveformPlayerProps` (inherited from the core option surface), filling
  gaps where the previous hand-maintained copy had missed or drifted.

## [0.1.2] — 2026-06-27

### Changed

- Bumped the `@arraypress/waveform-player` peer (and dev) dependency to
  `^1.7.2`. Consumers now get the native accessible keyboard / ARIA seek
  slider by default. No component API changes.

## [0.1.1] — Unreleased

### Changed

- Widened the `astro` peerDependency to `^6.0.0 || ^7.0.0` for
  Astro 7 readiness. No runtime changes — the component is unaffected by the
  Astro 7 compiler / Vite 8 (Rolldown) upgrade.

## [0.1.0] — Unreleased

Initial release.

### Added

- `<WaveformPlayer>` Astro component wrapping every option exposed by
  `@arraypress/waveform-player` 1.6.x as a typed prop:
  - Audio source props (`url`, `audioMode`, `preload`)
  - Waveform visualisation props (`waveformStyle`, `height`, `samples`,
    `barWidth`, `barSpacing`, `waveform`)
  - Colour props (`colorPreset`, `waveformColor`, `progressColor`,
    `buttonColor`, `buttonHoverColor`, `textColor`,
    `textSecondaryColor`, `backgroundColor`, `borderColor`)
  - Playback control props (`playbackRate`, `showPlaybackSpeed`,
    `playbackRates`)
  - UI toggle props (`showControls`, `showInfo`, `showTime`,
    `showHoverTime`, `showBPM`, `buttonAlign`)
  - Marker props (`markers`, `showMarkers`)
  - Content metadata props (`title`, `subtitle`, `artwork`, `album`)
  - Behaviour flags (`autoplay`, `singlePlay`, `playOnSeek`,
    `enableMediaSession`)
  - Icon props (`playIcon`, `pauseIcon`)
- Astro-specific `lazy` prop that switches the init attribute to
  `data-waveform-player-lazy` and ships a single deduplicated
  `IntersectionObserver` for grids of many previews.
- Astro-specific `id`, `class`, and `style` pass-throughs.
- Public TypeScript types: `WaveformPlayerProps`, `WaveformStyle`,
  `WaveformMarker`, `WaveformPeaks`, `ColorPreset`, `AudioMode`,
  `AudioPreload`, `ButtonAlign`.
- Ambient declaration for `window.WaveformPlayer` to type consumer
  scripts that reach for the global.
- Vitest suite (29 tests) covering attribute mapping, omission
  semantics, JSON serialisation for array props, lazy-mount script
  presence, and pass-through props.
- Documentation: full prop reference, setup guide, seven usage
  examples (`examples/basic.astro`).
