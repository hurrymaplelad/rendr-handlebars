[![travis-ci status](https://secure.travis-ci.org/rendrjs/rendr-handlebars.png)](http://travis-ci.org/#!/rendrjs/rendr-handlebars/builds)
[![Dependency Status](https://david-dm.org/rendrjs/rendr-handlebars.png)](https://david-dm.org/rendrjs/rendr-handlebars)

rendr-handlebars
================

[Handlebars](http://handlebarsjs.com/) template adapter for [Rendr](https://github.com/rendrjs/rendr) apps.

## Configuration options

- `entryPath` *optional* - change the location of the application for the given rendr-app.
- `templateFinder` *optional* - allows the ability to require a different template finder.  Commonly used to make a non-dynamic version of `require` to make build systems more efficient.

## Helpers

There are a number of variables that are set by default to these helpers and are passed in the context.  Those variables include:
- `_app` -  The instance of the Rendr application
- `_model` - when setting the `model` attribute, the `_model` variable will be set as the instance of a Rendr model.
- `_collection` - when using a `collection` attribute, the `_collection` variable will be set to the instance of the Rendr collection.
- `_block` - when passing a block to the `view` or `partial` helper, the `_block` variable will be available.  This `_block` variable will be the HTML passed in.


#### view
------
The view helper is used to insert a new Rendr view.  This is done on the server-side by generating the html and inserting it inline.  On the client-side it creates a placeholder, and then in Rendr it will call the `attach` function to create a view instance and insert the HTML.  If you don't pass any attributes to the helper, it sets the context (or scope) of the helper to the same as the parents.

You can also pass a block into the helper and it will be available inside of the created view as `_block`.  This is helpful when you want to have a chunk of HTML differ in a view, but have the majority of it stay the same.

Example:
```
// no attributes
{{ view "viewName" }}

{{ view "viewName" model=_model an_option="my option" }}

// with a block
{{ view "viewName" }}
  <div class="test">My Block</div>
{{/view}}
```


#### partial
------
A partial is HTML only, and it is inserted at compile time of the templates, making them more performant than a view.  These are good to use in cases where you don't have any view interaction and just want to reduce the amount of copied HTML.  This will inherit the parents context if no attributes are passed into the helper.

Again, you can pass a block into the partial and access the `_block` variable inside of the partial.  This is helpful when you want to set a variable chunk of HTML inside of a partial

Example:
```
// no attributes
{{ partial "partialName" }}

{{ partial "partialName" attr="example" }}

// with block
{{ partial "partialName" }}
  <div class="test">My Block</div>
{{/partial}}
```


#### json
------
This helper simply takes an object and runs `JSON.stringify` on the object.  You can also pass the [spacing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#space_argument) into the helper.

Example:
```
{{json myObject}}

// with spacing
{{ json myObject " " }}
```


#### each
------
Iterates an array setting the context to the value of the array element.  Works as you would expect the Handlebars [each](http://handlebarsjs.com/builtin_helpers.html#iteration) helper to work, but this adds Rendr specific options set in the context (`_app`, `_model`, `_collection`, `_block`)

Example:
```html
<ul>
  {{ each arr }}
    <li>{{this}}<li>
  {{/each}}
</ul>
```


#### forEach
------
Another helper to iterate items in the template, this has a bit more included though.  You can iterate objects, arrays, or Collections with this, setting the value and the key attributes in the scope.

Always available in the `forEach` helper
- `key` - The key on the object, or the index in the array
- `value` - The value of the item being iterated.

If iterating arrays or collections there is extra data included: 
- `_isFirst` - Boolean, is true if it's the first item in the array / collection
- `_isLast` - Boolean, is true if it's the last item in the array / collection
- `_total` - The number of items in the array / collection

If iterating an instance of a collection, you can set the `toJSON` attribute to convert the model being iterated into JSON instead of an instance of the model.  By default the `value` will be set to a Backbone model when iterating a collection.

Example:
```html
<!-- iterating an object -->
<h1>for each obj test</h1>
{{forEach obj}}
  <div>{{ key }} :::: {{ value }}</div>
{{/forEach}}

<!-- inverse available -->
{{forEach arr}}
  <div>{{ value }}</div>
{{else}}
  <div>Array is empty</div>
{{/forEach}}

<!-- pass variables into the scope -->
{{forEach arr attribute="test"}}
   <div>{{attribute}}</div>
{{/forEach}}

<!-- where value is what is stored in the array, can also store an array of objects
and access them on the value with the dot operator -->
<h1>for each array of objs test</h1>
{{forEach arr}}
  {{if _isFirst}}
    <div>Will only display for first element in array and collection</div>
  {{/if}}

  {{if _isLast}}
    <div>Will only display for last element in array and collection</div>
  {{/if}}
  <span>{{ value }}</span>
{{/forEach}}

<!-- array of a collection which returns a model -->
<h1>for each array of objs test</h1>
{{forEach myCollection}}
  <span>{{ key }} :::: {{ value.attributes.someAttr }}</span>
{{/forEach}}

<!-- array of collection which turns models into json -->
<h1>for each array of objs test toJSON</h1>
{{forEach myCollection toJSON=true}}
  <span>{{ key }} :::: {{ value.someAttr }}</span>
{{/forEach}}

<!-- can be used in conjunction with the view operator to pass the model to child views -->
<h1>forEach collection -> subview</h1>
{{forEach myCollection }}
  {{view model=value model_name="ExampleModel"}}
{{/forEach}}
```
