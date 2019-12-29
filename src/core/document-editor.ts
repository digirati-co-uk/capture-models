// List available form fields. Data on the fields:
// - Form itself for the editing interface
// - Form for editing the props
//     - optional, will should generic JSON-editor interface
//     - should be lazy-loaded using `import('...')` so we can tree-shake out the imports
//     - Will be a function that is given a render-prop style, with `storybook/knobs` style API return
//     - Some of the form fields are pre-provided for those shared with all.
//     - Option for custom components in the form for more advanced components
// - Display title
// - Static type - might not be needed, but could be useful
// - Default value - used for nuking the form fields recursively

// Generate property from vocabulary term
// Add property from vocabulary
// Add new nested entity
// Change form type of document term
// Edit field / entity label (path)
// Edit field / entity description (path)
// Add selector to field / entity (path)
