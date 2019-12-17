# Capture model editor

In order to edit or create capture models, we need to create a few distinct steps. Here is a rough outline for the 
process of creating a new model from scratch.

The most important aspect is that all of the data is retained inside of the capture model, with the exception of locally 
added vocabularies with a URL alias provided.

- Create or import an RDF vocabulary
- Compose the structure of your target output data model using the vocab
- Go through the model assigning field types (using your plugins installed)
- Compose your fields into a structure

After this point you can repeat any of the steps and flesh out the model.


### IMPORTANT CONSIDERATIONS

- When new model is started from navigation, need to create an identifier to group the fields edited together.
- Possibly need to keep a record of these, the creator, review status
- Functions to remove one of these groups of fields
- When saving capture model - filter out anything unchanged (unless it's the first in the list of fields, then just remove the ID).


## Development plan

- Data model utilities
    - RDF Import tools
        - Capture model field from RDF description
        - Tools for managing an `@profile` field
            - Adding/removing profile
            - Adding prefix
            - Updating properties in the document
    - Document editing utils
    - Structure editing utils
    - Diffing/Integrity utils
    - Contributor utils
- Plugin utilities
    - List of UI Components
    - List of UI Selectors (by data type)
- Editing components
    - RDF Vocab manager
    - Structure editor
    - Full document editor with nesting
    - Form editor
- Display components
    - RDF Vocab viewer
    - Structure viewer
    - Full document viewer
    - Form viewer

## UI Considerations
- Document model
    - Vocabulary editor
        - Import RDF document
        - Choose from existing RDF urls
    - Document tree editor
        - Add new field type
        - Attach selector to field or entity
        - Choose selector
        - Add new entity type
        - Reorder field types
    - Field editor
- Structure
    - Structure tree editor
    - Choice editor
    - Form editor
        - Document field selector
- Data (like preview, but with all fields and no structure)
- Preview (with structure)
- Publish
    - Clear all data
    - Save to capture model service
    - Download JSON

### Components
- Import RDF Document
- RDF Chooser
- RDF Property library
- Context editor
- Document tree view
- Select new field type
- Select vocabulary for field
- Edit field
- Select new selector type
- Edit selector
- Select vocabulary for entity
- Structure tree view
- Choice editor
- Form editor
- Document node selector
- Data editing view
- Preview screen
- Publish screen
- Splash screen
- Upload existing capture model
- Choose from capture model service
    
### Strategy for building
- Display all data in simple HTML
- Create hooks for managing state changes
- Create simple HTML forms
- Tidy forms and look and feel
- Design a new look and feel
- Wait for time to do more


## Import RDF

A simple way to import RDF that will be used in other steps.
- Import RDF (URL + File)
- Remove RDF (if not used)
- Add prefix to RDF
- Override URL of vocabulary 


### Functionality

- RDF File importer
- RDF URL importer
- RDF Configuration form
- RDF hook/store/API
- Parsing of `@context` to produce these stores
- `model.document` Context mutation


#### Future considerations

If we resolved JSON-LD contexts and vocabularies down to their primitive values, we could build an out of the box UI 
selection based on an Entity (like from Schema.org). We could also generate a capture model from an existing RDF 
document potentially, making for a great starting point. We need to treat fieldset as a type in itself that splits up 
object-"values" into their own distinct types. Alternatively, a single field type could produce a complex object.

*Note:* Need to consider how a fallback method may work in this scenario, that is where a single field has NESTED 
field's inside of it, in the exact same way that a fieldset does, but in a custom context. For example, an autocomplete 
for a person might have a nested capture model for tracking the fields of a person if the autocomplete didn't work. This 
should work EXACTLY like the fieldset, from a mutation point of view. It's just a fieldset with a value and fields. In 
the serialisation steps, that will be an either or. If there is a value that will be used, otherwise the fallback will 
be used. Alternatively, the fact that it has fallen back could be part of the value. This will give ultimate flexibility 
to the capture model format with another avenue for recursion.


## Output Model

A way of choosing various RDF fields to build a document. Literal values will be simply added to the model, complex 
types will need their own interface for adding. Options for enumerable types or models, although possibly factor into 
the next step.

- RDF property selection / search component
- Model visualisers
- Field editor


### Functionality

- Autocomplete on RDF properties (multiple section autocomplete)
- JSON-like structure visualiser (fields + models)
- `model.fields` Context mutation
- Add new field
- Remove field
- Change rdf type of field
- Add custom RDF alias
- Adding collection of models (with conforms to)


## Field types
Taking the structure from the previous step and adding field types to it. For the technical aspect, adding all of them 
as hidden or `null` types that can be changed should help tame the model. Other options for customising the fields will 
be presented too.

- Field selection component
- Per-field editing UI
- Capture model mutations


### Functionality

- `model.fields` Context mutation
- Ability to use the form field itself to pre-fill it with a value


#### Extra things on a field plugin
There are some things that should be tree-shaken out but would be very useful for debugging AND for the capture model 
editing interface. 

- Form itself for the editing interface
- Form for editing the props
    - optional, will should generic JSON-editor interface
    - should be lazy-loaded using `import('...')` so we can tree-shake out the imports
    - Will be a function that is given a render-prop style, with `storybook/knobs` style API return
    - Some of the form fields are pre-provided for those shared with all.
    - Option for custom components in the form for more advanced components
- Display title
- Static type - might not be needed, but could be useful
- Default value - used for nuking the form fields recursively 

This should still make it easy to extend an existing component to allow for a custom variation and share as much code 
as possible.


## Structure

Using the existing fields, create a navigation structure for the capture model.

- Structure editing component


### Functionality

- Add new choice
- Add new model
- Add field to model
- Remove field from model
- Reorder field
- Reorder choice/model
- Add label/desc to choice / model

## Plan for building

- Visualisation for full capture model structure
- Form for editing basic fields in structure
- Additions, changes to structure (choices / models)
- Visualisation for full capture model fields
- Forms for editing capture model fields
- Additions, changes to fields
- Vocabulary management


## Supporting other use-cases


### Fallback model with autocomplete

This could be supported by profiles below, where a profile could be set as "model-autocomplete" or something, and then 
that would indicate to the UI that this should be used first and if that's not successful, fallback to the full model.
This is _NOT_ an MVP requirement, but something that we want to get to.

This could also work with a special `identifier` field that is only ever populated by a backend after creating or
auto-completing on a resource in a model. 
```json
{
  "type": "entity",
  "label": "Review",
  "conformsTo": "Review",
  "identifier": "http://example.org/link-to-resource"
}
```
The link should probably also return the JSON-LD document for the resource too, making it easier to match up properties 
to a capture model during the autocomplete process.

**Conclusion** put a pin in this for now.

### UI Profiles

At the moment, each of the models and UI components are treated the same and will appear the same in the UI. It would be 
good to be able to distinguish components. For example, a "commenting" profile might show the form at the bottom of a 
page, or a "transcribing" might show an expandable UI and a "annotating" might be a more even split. We should quantify 
these and get them planned into the UX.

It will also be interesting to see if a choice that has 2 different profiles (and supported by the UI) will deconstruct 
into non-choices.

```json
{
  "type": "choice",
  "label": "Describe this book",
  "items": [
    {
      "type": "model",
      "label": "Basic information",
      "fields": [
        "name",
        "description",
        "author"
      ]
    },
    {
      "type": "model",
      "label": "Leave a comment",
      "profile": ["comment"],
      "fields": ["userComments"]
    }
  ] 
}
```

These could also be per-field. So a model could describe a few fields to be displayed alongside the content and also a 
comment field with that profile that renders under. It could also be used for other note taking for the capture model. 
Additionally, the profile could control the review process, to ensure it's only displayed in that context. It might be 
required for a capture models fields to be filtered for compatible profiles when displaying, so that empty choices do
not show up when not compatible.

**Conclusion**
* [] Add "getChoiceFields" utility that will optionally take in a profile and filter the fields (type: model -> type: model)
* [] Add a choice filtering utility for cases where there is only one choice per profile (type: choice -> type: choice | model)
* [x] Add `profile` to capture model type.


### Workflows

The concept of workflows are an alternative or compliment to structures. Workflows will start as linear paths where 
capture models are done in a specific order. This will tie into user permissions at a later stage. 
```json
{
  "type": "workflow",
  "label": "Describe this book",
  "currentStep": 0,
  "items": [
    {
      "type": "model",
      "label": "Basic information",
      "contributors": ["http://example.org/user/1"],
      "fields": [
        "name",
        "description",
        "author"
      ]
    },
    {
      "type": "review",
      "label": "Review information",
      "fields": [
        "name",
        "description"
      ]
    },
    {
      "type": "model",
      "label": "Add an ISBN number",
      "fields": [
        "isbn"
      ]
    }
  ]
}
```

**Conclusion**
* [] Add new type of field to typescript types
* [] Add utility to transform "workflow" into single "model"
* [] Take into account cases where something is in review stage or completed
* [] UI for taking two capture models and outputting a single capture model (full)


### Segmentation

At the moment, the structure only supports `choice` and `model` types, with `workflow` above being proposed. Another 
addition to this could be `segmentation`. This would take the same fields as the as the `model` but instead of showing a 
UI for editing the fields, it would only show the selectors for the fields. This would allow a pre-step to create all of 
the boxes for a given image.

**Conclusion**

* [] Add new type of field to typescript types
* [] Add utility for segmentation-only types, filtering fields with selectors


### Contributors

Whenever someone contributes to a capture model, they should have they name added both on the field they wrote and at 
the top level.

This will be useful if fields are replaced, you can still see who contributed to the document as a whole. It will also 
help with searching for all documents contributed by a single person.

The top level will contain the full information for displaying user details.

**Conclusion**

* [] Add diffing tool that will check changes made to model and add contributor fingerprints
* [] Diffing tool will also take in "allowed changes" for defining paths that are able to be edited
* [] Add contributors to Typescript types
* [] Add filter to return capture model with only contributor fields (and structure etc.)
* [] Add integrity checks (https://github.com/bevacqua/hash-sum) 
* [] Combine integrity checks with diffing tool
* [] Define set of permissions / roles and tools for checking and verifying these


### Search options

This type of extension to a capture model could extend to how external services interact. For example, we could add 
extra data for a search service.
```json
{
  "search": {
    "index": "name-of-index",
    "fields": ["title", "description"]
  }
}
```

We could also add analyse options to individual fields that could be picked up by a search service.

**Conclusion**: Wait for further tech design and requirements.


### RDF Document storage

At the moment, the vocabulary service is assumed to be an adapter to the search service, using the capture models
directly. This however could be Omeka itself. Where RDF documents are saved to Omeka and Omeka search is the gateway
to searching across the types. 

**Conclusion**: Hold off on implementation or design.


### IIIFlat

With capture models it's possible to make a wide variety of JSON-LD documents. A capture model for a IIIF document like 
a Manifest would really push this model to it's limits. It's unlikely that such a nested model will work well for some 
enumerable types but an exercise like this will help to uncover the details of the problems we are likely to face with 
more complex data.

**Conclusion**: Keep in mind, but not implemented


### Non-human form fields

At the moment, it is assumed that all capture models are to be chosen by humans and operated on by humans. However, 
there is room to make these changes programmatic too. For example, say we had a text-extraction service that returned a 
full-text blob of text as a transcription. You could imagine a new property on the capture model for this case.
```json
{
  "operations": [
    { "type": "text-extraction", "fields": ["machineTranscription"], "lastRun": "00:00:00 00-00-0000" }
  ],
  "fields": {
    "machineTranscription": [{
      "type": "textarea",
      "machine": true,
      "value": ""
    }]
  }
}
```

This value could then be populated by a service, and then with a non-empty value and `machine` equal to true offer it up
as a field that needs to verification. 

This could manifest in the capture model service, which will host the capture models, the editing interface and other 
pieces and would be bootstrapped with plugins. A service plugin (i.e. a typescript wrapper for external service) could 
advertise both a server side element for handling the operations and dispatching them out to the wider DLCS and also UI 
for adding potential services. 

The capture model API could then have an API for triggering an operation on a capture model. Using the example above, 
the endpoint could be:
```
POST /operations?model={url}&operation=text-extraction
```
This would alter the capture model in some way to indicate that it's processing and trigger the run. After the run, the 
capture model would be updated, using the capture model configuration, with the values required. 

Additionally, the capture model would need to support a "request" that would need to be approved, in addition to a
direct operation in order to fit in with user permissions.


### Output formats

The capture model service could output capture models in various formats. This would also be supported by plugins. A
plugin would be able to convert to the desired format, this could be completely custom and only work specific models or 
it could be a more general one. Examples include: RDF/JSON,  Various W3C Annotation formats, external metadata formats, 
CSV.

Customising on the capture model side:
```json
{
  "formats": [
    "json+ld",
    ["w3c-annotation", { "type": "transcription", "field": "machineTranscription" }],
    ["w3c-annotation", { "config": "some-value" }]
  ]
}
``` 
This still needs refined. If you requested `w3c-annotation` in this example, would you get ALL of the annotations that
were created from both configurations? Should these be a map that can be requested:
```json
{
  "formats": {
    "json": "json+ld",
    "transcription": ["w3c-annotation", {  }],
    "other": ["w3c-annotation", {  }]
  }
}
```

With these types of extensions, it becomes easier to see more and more of these fields as being "hidden" when serving 
normal capture models. They are part of the metadata, driven by configuration potentially.


## Capture model server

The functions of a capture model service

- Serve capture models
    - based on context provided
    - context is sent to configuration service to get default capture models
    - Future: server users their own capture model, forked from the canonical capture model
- Update capture models
- Dispatch capture model web-hooks or event bus events

