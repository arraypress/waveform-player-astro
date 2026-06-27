/**
 * @module types
 * @description
 * Public TypeScript types for `@arraypress/waveform-player-astro`.
 *
 * The shared option surface — visual styles, colour presets, audio modes,
 * markers, peaks, and the full per-option list — is owned by the core
 * `@arraypress/waveform-player` library, which ships hand-authored type
 * declarations (`index.d.ts`). This wrapper re-exports those shared types
 * verbatim (so consumers can keep importing them from this package) and
 * derives its component prop interface from the core's
 * {@link WaveformPlayerOptions} rather than re-declaring it. That keeps the
 * two packages from drifting: any option the core adds (or renames) flows
 * through here automatically, and there is a single source of truth.
 *
 * The prop names match the library option names 1:1 (camelCase) — the
 * Astro component handles the conversion to the library's `data-*`
 * attribute contract (kebab-case) under the hood.
 *
 * Props are intentionally all optional (except `url`, which the wrapper
 * requires so the player always has audio to load). When a prop is
 * omitted, the wrapper emits no corresponding `data-*` attribute, letting
 * the core library apply its own internal defaults.
 *
 * @see {@link https://github.com/arraypress/waveform-player} — core library
 */

import type { WaveformPlayerOptions } from '@arraypress/waveform-player';

/**
 * Shared option types, re-exported from the core library so consumers can
 * continue to import them from `@arraypress/waveform-player-astro`:
 *
 * ```ts
 * import type {
 *   WaveformStyle,
 *   WaveformMarker,
 *   WaveformPeaks,
 * } from '@arraypress/waveform-player-astro';
 * ```
 *
 * The core's `index.d.ts` is the single source of truth for their shape —
 * this wrapper no longer maintains parallel copies that can drift.
 */
export type {
	WaveformStyle,
	ColorPreset,
	AudioMode,
	AudioPreload,
	ButtonAlign,
	WaveformMarker,
	WaveformPeaks,
} from '@arraypress/waveform-player';

/**
 * Props accepted by the `<WaveformPlayer>` Astro component.
 *
 * Inherits every construction option from the core library's
 * {@link WaveformPlayerOptions} (including `accessibleSeek`, `seekLabel`,
 * `barRadius`, and the gradient-array forms of `waveformColor` /
 * `progressColor`) and layers on the Astro-specific extras. Two groups of
 * core options are deliberately removed:
 *
 *  - `url` — optional on the core options, but **required** here (the
 *    wrapper exists to render a player, which needs a source). Redeclared
 *    below as a required `string`.
 *  - `style` — the core exposes `style` as a shorthand alias for
 *    {@link WaveformStyle} (`data-style`), but in an Astro component `style`
 *    is the HTML inline-style attribute. We remove the core's alias and
 *    redeclare `style` below as the inline-CSS `string`; consumers select
 *    the visual style via the canonical `waveformStyle` prop instead.
 *  - the `on*` lifecycle callbacks (`onLoad`, `onPlay`, …) — these are JS
 *    functions, and a server-rendered Astro component emits static HTML
 *    plus `data-*` attributes with nothing to attach a runtime callback
 *    to. Consumers wire lifecycle handling via the DOM
 *    `waveformplayer:*` events instead.
 *
 * Because the option surface is inherited rather than hand-copied, anything
 * the core adds in future is exposed here without a manual edit.
 */
export interface WaveformPlayerProps
	extends Omit<
		WaveformPlayerOptions,
		| 'url'
		| 'style'
		| 'onLoad'
		| 'onPlay'
		| 'onPause'
		| 'onEnd'
		| 'onError'
		| 'onTimeUpdate'
	> {
	// ─────────────────────────────────────────────────────────────────────
	// Audio source (Astro-required override)
	// ─────────────────────────────────────────────────────────────────────

	/**
	 * Audio file URL. Provide one of `url` or its shorthand alias `src`
	 * (inherited from the core options) — the player needs a source to do
	 * anything useful.
	 *
	 * Supported formats are whatever the user's browser supports — MP3,
	 * WAV, OGG, AAC, etc. CORS headers must allow cross-origin loads if
	 * hosted on a different domain.
	 */
	url?: string;

	// ─────────────────────────────────────────────────────────────────────
	// Astro-specific extras
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
