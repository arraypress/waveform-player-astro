# Changelog

All notable changes to `@arraypress/waveform-player-astro` are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
