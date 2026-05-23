/**
 * @module types
 * @description
 * Public TypeScript types for `@arraypress/waveform-player-astro`.
 *
 * Every option exposed by the core `@arraypress/waveform-player` library is
 * surfaced here as a typed prop. The prop names match the library option
 * names 1:1 (camelCase) — the Astro component handles the conversion to the
 * library's `data-*` attribute contract (kebab-case) under the hood.
 *
 * Props are intentionally all optional (except `url`, which the library
 * requires to load audio). When a prop is omitted, the wrapper emits no
 * corresponding `data-*` attribute, letting the core library apply its
 * own internal defaults.
 *
 * @see {@link https://github.com/arraypress/waveform-player} — core library
 */

/**
 * Visual style of the waveform rendering.
 *
 * - `bars`    — classic vertical bars from the baseline up
 * - `mirror`  — symmetrical bars mirrored around the centre line
 * - `line`    — connected line graph
 * - `blocks`  — chunky square blocks
 * - `dots`    — dotted plot
 * - `seekbar` — minimal seek bar with no peak detail
 */
export type WaveformStyle =
	| 'bars'
	| 'mirror'
	| 'line'
	| 'blocks'
	| 'dots'
	| 'seekbar';

/**
 * Forced colour scheme. `null` (the default) auto-detects from the page
 * theme and `prefers-color-scheme`.
 */
export type ColorPreset = 'dark' | 'light' | null;

/**
 * How the player handles audio.
 *
 * - `self`     — (default) the player owns an `<audio>` element and plays
 *   the URL itself. Use this for standalone players.
 * - `external` — the player renders the waveform visualisation only and
 *   dispatches `waveformplayer:request-play|pause|seek` events for an
 *   external controller (e.g. `@arraypress/waveform-bar`) to handle.
 *   Drive the visualisation from the controller by calling
 *   `setProgress()` and `setPlayingState()` on the player instance.
 */
export type AudioMode = 'self' | 'external';

/**
 * Browser preload hint passed through to the underlying `<audio>` element.
 *
 * - `auto`     — fetch the entire file ahead of time
 * - `metadata` — (default) fetch only enough to determine duration
 * - `none`     — fetch nothing until play is requested
 */
export type AudioPreload = 'auto' | 'metadata' | 'none';

/**
 * Vertical alignment of the play button relative to the waveform.
 *
 * `auto` picks `bottom` for the `bars` style and `center` for everything
 * else.
 */
export type ButtonAlign = 'auto' | 'top' | 'center' | 'bottom';

/**
 * A clickable chapter marker rendered on top of the waveform.
 *
 * Clicking a marker seeks the player to its `time`. Markers also display
 * their `label` as a tooltip on hover.
 */
export interface WaveformMarker {
	/** Time in seconds at which the marker appears. */
	time: number;
	/** Short label shown as a tooltip. */
	label: string;
	/** Optional override colour (CSS colour string). Falls back to the
	 *  player's progress colour. */
	color?: string;
}

/**
 * Pre-computed waveform peaks, OR a string pointer to them.
 *
 * - `number[]`            — inline array of peak amplitudes (0..1)
 * - `string` (.json URL)  — JSON file URL the library will `fetch()`
 * - `string` (JSON array) — inline JSON string the library will parse
 * - `null` / omitted      — the library decodes the audio file with the
 *   Web Audio API at load time (slowest path)
 *
 * Pre-computing peaks with `@arraypress/waveform-gen` at build time is
 * strongly recommended for any catalogue of more than a handful of
 * tracks; it removes a full Web Audio decode from the render path.
 */
export type WaveformPeaks = number[] | string | null;

/**
 * Props accepted by the `<WaveformPlayer>` Astro component.
 *
 * Grouped to mirror the README sections:
 *   1. Audio source
 *   2. Waveform visualisation
 *   3. Colours
 *   4. Playback controls
 *   5. UI toggles
 *   6. Markers
 *   7. Content metadata
 *   8. Behaviour flags
 *   9. Icons
 *  10. Astro-specific extras
 */
export interface WaveformPlayerProps {
	// ─────────────────────────────────────────────────────────────────────
	// 1. Audio source
	// ─────────────────────────────────────────────────────────────────────

	/**
	 * Audio file URL. Required for the player to do anything useful.
	 *
	 * Supported formats are whatever the user's browser supports — MP3,
	 * WAV, OGG, AAC, etc. CORS headers must allow cross-origin loads if
	 * hosted on a different domain.
	 */
	url: string;

	/**
	 * Whether the player owns its `<audio>` element (`self`) or only
	 * renders visualisation and emits request events (`external`).
	 *
	 * Use `external` together with `@arraypress/waveform-bar` for
	 * persistent-bar setups where one audio element drives many visual
	 * surfaces across the page.
	 *
	 * @default 'self'
	 */
	audioMode?: AudioMode;

	/**
	 * Browser preload hint for the underlying `<audio>` element.
	 *
	 * @default 'metadata'
	 */
	preload?: AudioPreload;

	// ─────────────────────────────────────────────────────────────────────
	// 2. Waveform visualisation
	// ─────────────────────────────────────────────────────────────────────

	/**
	 * Which waveform render style to use.
	 *
	 * @default 'mirror'
	 */
	waveformStyle?: WaveformStyle;

	/**
	 * Canvas height in pixels.
	 *
	 * @default 60
	 */
	height?: number;

	/**
	 * Number of peak samples to render across the waveform. Higher values
	 * give finer detail at the cost of slightly higher CPU and a busier
	 * visual. 100–300 is the sweet spot for most player widths.
	 *
	 * @default 200
	 */
	samples?: number;

	/**
	 * Width of each bar/block in pixels (where applicable). Defaults
	 * depend on `waveformStyle` (e.g. `2` for `mirror`, `3` for `bars`).
	 */
	barWidth?: number;

	/**
	 * Gap between adjacent bars/blocks in pixels. Defaults depend on
	 * `waveformStyle`.
	 */
	barSpacing?: number;

	/**
	 * Pre-computed peaks data. See {@link WaveformPeaks}.
	 *
	 * - `number[]` is JSON-stringified into the emitted attribute.
	 * - `string` (URL or inline JSON) is emitted verbatim — the library
	 *   parses it.
	 */
	waveform?: WaveformPeaks;

	// ─────────────────────────────────────────────────────────────────────
	// 3. Colours
	// ─────────────────────────────────────────────────────────────────────

	/**
	 * Forced colour preset. `null` auto-detects from the page theme.
	 *
	 * Individual `*Color` props always win over the preset, letting you
	 * keep the auto-detection but tweak one or two colours.
	 *
	 * @default null
	 */
	colorPreset?: ColorPreset;

	/** Colour of the unplayed waveform peaks (CSS colour string). */
	waveformColor?: string;
	/** Colour of the played-through portion of the waveform. */
	progressColor?: string;
	/** Border/text colour of the play button. */
	buttonColor?: string;
	/** Play button hover colour. */
	buttonHoverColor?: string;
	/** Primary text colour (title). */
	textColor?: string;
	/** Secondary text colour (subtitle, time). */
	textSecondaryColor?: string;
	/** Reserved for future use; currently no visible effect. */
	backgroundColor?: string;
	/** Reserved for future use; currently no visible effect. */
	borderColor?: string;

	// ─────────────────────────────────────────────────────────────────────
	// 4. Playback controls
	// ─────────────────────────────────────────────────────────────────────

	/**
	 * Initial playback rate (1 = normal speed; 0.5..2 supported).
	 *
	 * @default 1
	 */
	playbackRate?: number;

	/**
	 * Whether to render the playback-speed control menu.
	 *
	 * @default false
	 */
	showPlaybackSpeed?: boolean;

	/**
	 * List of speeds to offer in the speed menu.
	 *
	 * @default [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
	 */
	playbackRates?: number[];

	// ─────────────────────────────────────────────────────────────────────
	// 5. UI toggles
	// ─────────────────────────────────────────────────────────────────────

	/**
	 * Show the play/pause button.
	 *
	 * @default true
	 */
	showControls?: boolean;

	/**
	 * Show the info bar (title, subtitle, time, BPM, speed).
	 *
	 * @default true
	 */
	showInfo?: boolean;

	/**
	 * Show the current-time / total-time readout.
	 *
	 * @default true
	 */
	showTime?: boolean;

	/**
	 * Show a hover-time indicator on the waveform (reserved — not all
	 * library versions implement this yet).
	 *
	 * @default false
	 */
	showHoverTime?: boolean;

	/**
	 * Detect and display the track's BPM in the info bar.
	 *
	 * Adds a ~50–200 ms onset-detection pass on first load.
	 *
	 * @default false
	 */
	showBPM?: boolean;

	/**
	 * Where to align the play button vertically relative to the waveform.
	 *
	 * @default 'auto'
	 */
	buttonAlign?: ButtonAlign;

	// ─────────────────────────────────────────────────────────────────────
	// 6. Markers
	// ─────────────────────────────────────────────────────────────────────

	/**
	 * Chapter markers to render on the waveform. Each becomes a clickable
	 * seek point.
	 *
	 * Emitted as JSON-stringified `data-markers`. The library parses it.
	 */
	markers?: WaveformMarker[];

	/**
	 * Whether to render markers at all. Useful for hiding markers in
	 * compact layouts while still passing them in for future use.
	 *
	 * @default true
	 */
	showMarkers?: boolean;

	// ─────────────────────────────────────────────────────────────────────
	// 7. Content metadata
	// ─────────────────────────────────────────────────────────────────────

	/**
	 * Track title shown in the info bar. Falls back to a prettified
	 * filename extracted from the URL.
	 */
	title?: string;

	/**
	 * Subtitle shown under the title — typically the artist name.
	 */
	subtitle?: string;

	/**
	 * Album / collection cover image URL displayed as a thumbnail.
	 */
	artwork?: string;

	/**
	 * Album name. Passed through to the Media Session API for lockscreen
	 * and OS-level media displays.
	 */
	album?: string;

	// ─────────────────────────────────────────────────────────────────────
	// 8. Behaviour flags
	// ─────────────────────────────────────────────────────────────────────

	/**
	 * Start playback as soon as audio metadata loads.
	 *
	 * Note that most browsers block autoplay with audible audio unless
	 * the user has interacted with the page first.
	 *
	 * @default false
	 */
	autoplay?: boolean;

	/**
	 * Pause any other `WaveformPlayer` on the page when this one starts.
	 *
	 * @default true
	 */
	singlePlay?: boolean;

	/**
	 * Resume playback automatically when the user seeks on a paused
	 * waveform.
	 *
	 * @default true
	 */
	playOnSeek?: boolean;

	/**
	 * Wire up the browser's Media Session API so OS media keys, lock
	 * screens, and bluetooth controls drive the player.
	 *
	 * @default true
	 */
	enableMediaSession?: boolean;

	// ─────────────────────────────────────────────────────────────────────
	// 9. Icons
	// ─────────────────────────────────────────────────────────────────────

	/**
	 * Inline HTML/SVG to use for the play button. Anything you pass is
	 * injected raw — use trusted markup only.
	 */
	playIcon?: string;

	/**
	 * Inline HTML/SVG to use for the pause button. Anything you pass is
	 * injected raw — use trusted markup only.
	 */
	pauseIcon?: string;

	// ─────────────────────────────────────────────────────────────────────
	// 10. Astro-specific extras
	// ─────────────────────────────────────────────────────────────────────

	/**
	 * Defer initialisation until the player scrolls into view.
	 *
	 * When `true`, the component emits `data-waveform-player-lazy` and
	 * the bundled `IntersectionObserver` script promotes it to
	 * `data-waveform-player` once it crosses the viewport (with a 200px
	 * buffer so audio is decoded ahead of time).
	 *
	 * Use this on grids of many previews to avoid spawning N concurrent
	 * `fetch()` + `decodeAudioData` jobs on page load.
	 *
	 * @default false
	 */
	lazy?: boolean;

	/**
	 * DOM id forwarded to the player container. Useful for targeting
	 * the player from external scripts via `WaveformPlayer.getInstance(id)`.
	 */
	id?: string;

	/**
	 * Extra class names appended to the container's `class` attribute.
	 *
	 * The base class `wfp-host` is always applied so the package's CSS
	 * (or your own overrides) can target the wrapper.
	 */
	class?: string;

	/**
	 * Inline style passed through to the container. Useful for setting
	 * `min-height` to reserve layout space before the waveform draws.
	 */
	style?: string;
}
