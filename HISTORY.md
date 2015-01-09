# 0.2.2
## 2015-01-8
* Changed the shared/helpers to follow a CommonJS pattern of requiring each helper separately
* added tests for the helpers
* added a `forEach` helper
* added documentation for all the helpers
* added ability to pass blocks into partials / views
* upgrade to underscore@1.7.0

# 0.2.1
## 2014-12-11
* Removed need to initialize the view twice on the client-side. This fixed leaking listeners and makes the code perform as expected

# 0.2.0
## 2014-02-25
* Add support for AMD modules.
* Upgraded to Handlebars@1.3.0.
* Upgraded to Underscore@1.5.2.
