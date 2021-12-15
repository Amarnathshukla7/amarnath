import CommonViewOptions from "../config/common-view-options";

let options = {
  currentStepKey: "search",
  relativePath: "/search",
};

/**
 * Merging in the default comon view options.
 * If the common view needs be overiden place in options.
 *
 * e.g. showSteps: false wont be displayed in transactions view if set to false.
 */
options = {
  ...CommonViewOptions,
  ...options,
};

export default options;
