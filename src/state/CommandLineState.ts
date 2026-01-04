/**
 * Centralized state management for CLI options
 * Replaces global variables with a proper state module
 */

interface CommandLineState {
  downloadYoutubeSubtitles: boolean;
  delayYoutube: number;
  ytVerbose: boolean;
  optRenderUserQuizAnswer: boolean;
  previousYoutubeTimestamp: number;
}

/**
 * Default state values
 */
const defaultState: CommandLineState = {
  downloadYoutubeSubtitles: false,
  delayYoutube: 0,
  ytVerbose: false,
  optRenderUserQuizAnswer: false,
  previousYoutubeTimestamp: 0,
};

/**
 * Current state (initialized with defaults)
 */
let currentState: CommandLineState = { ...defaultState };

/**
 * Set all state values at once
 */
export function setCommandLineState(state: Partial<CommandLineState>): void {
  currentState = {
    ...currentState,
    ...state,
  };
}

/**
 * Get current state values
 */
export function getCommandLineState(): Readonly<CommandLineState> {
  return currentState;
}

/**
 * Reset state to defaults (useful for testing)
 */
export function resetCommandLineState(): void {
  currentState = { ...defaultState };
}

/**
 * Individual state getters (for convenience)
 */
export const state = {
  get downloadYoutubeSubtitles(): boolean {
    return currentState.downloadYoutubeSubtitles;
  },
  get delayYoutube(): number {
    return currentState.delayYoutube;
  },
  get ytVerbose(): boolean {
    return currentState.ytVerbose;
  },
  get optRenderUserQuizAnswer(): boolean {
    return currentState.optRenderUserQuizAnswer;
  },
  get previousYoutubeTimestamp(): number {
    return currentState.previousYoutubeTimestamp;
  },
};

/**
 * Individual state setters (for convenience)
 */
export const setState = {
  set downloadYoutubeSubtitles(value: boolean) {
    currentState.downloadYoutubeSubtitles = value;
  },
  set delayYoutube(value: number) {
    currentState.delayYoutube = value;
  },
  set ytVerbose(value: boolean) {
    currentState.ytVerbose = value;
  },
  set optRenderUserQuizAnswer(value: boolean) {
    currentState.optRenderUserQuizAnswer = value;
  },
  set previousYoutubeTimestamp(value: number) {
    currentState.previousYoutubeTimestamp = value;
  },
};
