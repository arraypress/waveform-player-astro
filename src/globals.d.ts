/**
 * @module globals
 * @description
 * Ambient declarations for the globals the core `@arraypress/waveform-player`
 * library installs on `window` when its IIFE script runs.
 *
 * Consumers don't need to import this file — TypeScript picks it up
 * automatically via the package's exported types. The shim lets you do
 * things like:
 *
 * ```ts
 * window.WaveformPlayer?.init();
 * const player = window.WaveformPlayer?.getInstance('my-player-id');
 * ```
 *
 * without TypeScript complaining about `window.WaveformPlayer` being
 * `any` / undefined.
 *
 * The shape is intentionally minimal — just the static surface a typical
 * consumer touches. The full instance API lives in the core library's
 * own types (when those ship) or via `// @ts-expect-error` for now.
 */

/**
 * Static / global surface of `window.WaveformPlayer`.
 *
 * The core library exposes its class constructor directly on `window`;
 * static helpers like `init()`, `getInstance()`, `getAllInstances()`,
 * and `destroyAll()` hang off the same object.
 */
interface WaveformPlayerGlobal {
	/**
	 * Manually scan the document for any `[data-waveform-player]`
	 * elements and mount players into them. Called automatically on
	 * `DOMContentLoaded`; call again after dynamically inserting
	 * markup.
	 */
	init(): void;

	/**
	 * Retrieve a player instance by element id, DOM element, or
	 * internally-generated player id.
	 */
	getInstance(idOrElement: string | HTMLElement): unknown | undefined;

	/** Return every active player instance. */
	getAllInstances(): unknown[];

	/** Destroy every active player instance on the page. */
	destroyAll(): void;

	/**
	 * Pre-compute peaks from an audio URL using the Web Audio API.
	 * Useful for ad-hoc generation when you don't have a build-time
	 * pipeline.
	 */
	generateWaveformData(url: string, samples?: number): Promise<number[]>;

	/** Allow `new WaveformPlayer(...)` from user code. */
	new (container: string | HTMLElement, options?: Record<string, unknown>): unknown;
}

declare global {
	interface Window {
		/**
		 * Installed by `@arraypress/waveform-player`'s IIFE script.
		 * `undefined` until that script loads.
		 */
		WaveformPlayer?: WaveformPlayerGlobal;

		/**
		 * Internal — set by `<WaveformPlayer lazy>`'s inline mount
		 * script to deduplicate the `IntersectionObserver`. Do not
		 * rely on this; it is an implementation detail.
		 *
		 * @internal
		 */
		__wfpLazyMountBound?: boolean;

		/**
		 * Internal — set by the non-lazy `<WaveformPlayer>`'s inline
		 * script to deduplicate the `astro:page-load` re-init listener
		 * that re-runs `WaveformPlayer.init()` after View Transitions
		 * navigations. Do not rely on this; it is an implementation
		 * detail.
		 *
		 * @internal
		 */
		__wfpInitBound?: boolean;
	}
}

export {};
