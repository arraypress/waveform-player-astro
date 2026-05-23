# @arraypress/waveform-player-astro

Astro component wrapper around [`@arraypress/waveform-player`](https://github.com/arraypress/waveform-player). Exposes every library option as a typed prop, handles `data-*` attribute serialisation for you, and ships an optional lazy-mount `IntersectionObserver` for grids of many previews.

The core library stays a zero-dependency vanilla-JS package that works anywhere a `<script>` tag does (WordPress, Shopify, raw HTML). This package adds the framework-native ergonomics Astro users expect — without touching the runtime.

```astro
---
import WaveformPlayer from '@arraypress/waveform-player-astro';
import '@arraypress/waveform-player/dist/waveform-player.css';
import wfpJsUrl from '@arraypress/waveform-player/dist/waveform-player.min.js?url';
---
<script src={wfpJsUrl} is:inline></script>

<WaveformPlayer
  url="/audio/track.mp3"
  title="My Track"
  waveformStyle="bars"
  showBPM
/>
```

## Installation

```bash
npm install @arraypress/waveform-player-astro @arraypress/waveform-player
```

`@arraypress/waveform-player` is a peer dependency — you bring it explicitly so you control the version.

## Setup

The wrapper does **not** load the core library's JS or CSS for you. This is deliberate: you might want a CDN, a self-hosted asset, or the bundled npm path. Load both once in your root layout:

```astro
---
// src/layouts/Layout.astro
import '@arraypress/waveform-player/dist/waveform-player.css';
import wfpJsUrl from '@arraypress/waveform-player/dist/waveform-player.min.js?url';
---
<html>
  <head>
    <script src={wfpJsUrl} is:inline></script>
  </head>
  <body><slot /></body>
</html>
```

Then `<WaveformPlayer>` works on any page.

## Usage

### Minimal

```astro
<WaveformPlayer url="/audio/track.mp3" />
```

### With metadata + a chosen style

```astro
<WaveformPlayer
  url="/audio/track.mp3"
  title="Midnight Dreams"
  subtitle="The Wavelength"
  artwork="/img/cover.jpg"
  waveformStyle="bars"
  barWidth={3}
  barSpacing={1}
  height={80}
/>
```

### Pre-computed peaks (recommended for catalogues)

```astro
<WaveformPlayer
  url="/audio/track.mp3"
  waveform="/peaks/track.json"
/>
```

Generate the JSON at build time with [`@arraypress/waveform-gen`](https://github.com/arraypress/waveform-gen). Removes a full Web Audio decode from the runtime render path.

### Chapter markers

```astro
<WaveformPlayer
  url="/audio/podcast.mp3"
  markers={[
    { time: 0,   label: 'Intro' },
    { time: 60,  label: 'Main topic', color: '#a855f7' },
    { time: 600, label: 'Q&A' },
  ]}
/>
```

### Lazy mounting (large grids)

Pass `lazy` and the wrapper switches the init attribute to `data-waveform-player-lazy`, then installs a single shared `IntersectionObserver` that promotes each mount when it crosses the viewport (with 200 px of buffer so audio is decoded before the user actually sees the player).

```astro
{previews.map((p) => (
  <WaveformPlayer url={p.url} title={p.title} lazy />
))}
```

The observer is installed at most once per page (`window.__wfpLazyMountBound` flag), and re-fires on Astro's `astro:page-load` event so cross-page navigations pick up new mounts.

### External audio mode

For setups where one audio element (e.g. [`@arraypress/waveform-bar`](https://github.com/arraypress/waveform-bar)) drives many visual surfaces:

```astro
<WaveformPlayer
  url={track.url}
  audioMode="external"
  waveformStyle="seekbar"
  showInfo={false}
/>
```

The player dispatches `waveformplayer:request-play | request-pause | request-seek` custom events instead of touching audio itself. Drive the visualisation from your controller via the player instance's `setProgress(currentTime, duration)` and `setPlayingState(playing)` methods.

## Props

Every prop maps 1:1 to an option on the core library. Omitting a prop emits no `data-*` attribute and lets the library apply its own default.

### Audio source

| Prop        | Type                                  | Default      | Description |
| ----------- | ------------------------------------- | ------------ | ----------- |
| `url`       | `string` *(required)*                 | —            | Audio file URL. |
| `audioMode` | `'self' \| 'external'`                | `'self'`     | `'external'` renders waveform only and emits request events. |
| `preload`   | `'auto' \| 'metadata' \| 'none'`      | `'metadata'` | Browser preload hint. |

### Waveform visualisation

| Prop            | Type                                                          | Default    | Description |
| --------------- | ------------------------------------------------------------- | ---------- | ----------- |
| `waveformStyle` | `'bars' \| 'mirror' \| 'line' \| 'blocks' \| 'dots' \| 'seekbar'` | `'mirror'` | Visual style. |
| `height`        | `number`                                                      | `60`       | Canvas height in pixels. |
| `samples`       | `number`                                                      | `200`      | Number of waveform peaks to render. |
| `barWidth`      | `number`                                                      | style-dependent | Width of each bar/block. |
| `barSpacing`    | `number`                                                      | style-dependent | Gap between bars. |
| `waveform`      | `number[] \| string`                                          | —          | Pre-computed peaks (array, JSON URL, or inline JSON). |

### Colours

All optional. `colorPreset` controls the auto theme, and any individual colour wins over the preset.

| Prop                  | Type                            | Description |
| --------------------- | ------------------------------- | ----------- |
| `colorPreset`         | `'dark' \| 'light' \| null`     | `null` (default) auto-detects. |
| `waveformColor`       | `string`                        | Unplayed peak colour. |
| `progressColor`       | `string`                        | Played-through peak colour. |
| `buttonColor`         | `string`                        | Play-button colour. |
| `buttonHoverColor`    | `string`                        | Play-button hover colour. |
| `textColor`           | `string`                        | Primary text colour. |
| `textSecondaryColor`  | `string`                        | Secondary text colour. |
| `backgroundColor`     | `string`                        | Reserved. |
| `borderColor`         | `string`                        | Reserved. |

### Playback controls

| Prop                | Type        | Default                              | Description |
| ------------------- | ----------- | ------------------------------------ | ----------- |
| `playbackRate`      | `number`    | `1`                                  | Initial speed. |
| `showPlaybackSpeed` | `boolean`   | `false`                              | Show the speed menu. |
| `playbackRates`     | `number[]`  | `[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]` | Speeds offered in the menu. |

### UI toggles

| Prop            | Type                                       | Default  | Description |
| --------------- | ------------------------------------------ | -------- | ----------- |
| `showControls`  | `boolean`                                  | `true`   | Show the play/pause button. |
| `showInfo`      | `boolean`                                  | `true`   | Show the info bar (title, time, etc.). |
| `showTime`      | `boolean`                                  | `true`   | Show current / total time. |
| `showHoverTime` | `boolean`                                  | `false`  | Reserved. |
| `showBPM`       | `boolean`                                  | `false`  | Detect and display BPM. |
| `buttonAlign`   | `'auto' \| 'top' \| 'center' \| 'bottom'`  | `'auto'` | Play-button vertical alignment. |

### Markers

| Prop          | Type                                                              | Default | Description |
| ------------- | ----------------------------------------------------------------- | ------- | ----------- |
| `markers`     | `Array<{ time: number; label: string; color?: string }>`          | —       | Clickable seek-point markers. |
| `showMarkers` | `boolean`                                                         | `true`  | Render markers (false to hide without losing data). |

### Content metadata

| Prop       | Type     | Description |
| ---------- | -------- | ----------- |
| `title`    | `string` | Track title (defaults to a prettified filename). |
| `subtitle` | `string` | Subtitle / artist. |
| `artwork`  | `string` | Thumbnail image URL. |
| `album`    | `string` | Album name (Media Session API). |

### Behaviour

| Prop                 | Type      | Default | Description |
| -------------------- | --------- | ------- | ----------- |
| `autoplay`           | `boolean` | `false` | Start as soon as metadata loads. |
| `singlePlay`         | `boolean` | `true`  | Pause other players on the page when this one starts. |
| `playOnSeek`         | `boolean` | `true`  | Resume on seek if paused. |
| `enableMediaSession` | `boolean` | `true`  | Wire up the Media Session API. |

### Icons

| Prop        | Type     | Description |
| ----------- | -------- | ----------- |
| `playIcon`  | `string` | Inline HTML / SVG for the play button (injected raw — trust your source). |
| `pauseIcon` | `string` | Inline HTML / SVG for the pause button. |

### Astro-specific

| Prop    | Type      | Default | Description |
| ------- | --------- | ------- | ----------- |
| `lazy`  | `boolean` | `false` | Defer mount until viewport entry. |
| `id`    | `string`  | —       | Forwarded to the container element. |
| `class` | `string`  | —       | Appended to the container's classes (`wfp-host` is always present). |
| `style` | `string`  | —       | Inline style on the container. |

## TypeScript

Importing the types directly:

```ts
import type {
  WaveformPlayerProps,
  WaveformStyle,
  WaveformMarker,
  WaveformPeaks,
  ColorPreset,
  AudioMode,
  AudioPreload,
  ButtonAlign,
} from '@arraypress/waveform-player-astro';
```

The package also ships an ambient declaration for `window.WaveformPlayer` so consumers reaching for it from their own scripts get autocomplete.

## Testing

```bash
npm test          # one-shot
npm run test:watch
npm run typecheck
```

Tests use Astro's official `experimental_AstroContainer` API to render the component to a string and assert on the resulting HTML. No browser required.

## License

MIT © ArrayPress
