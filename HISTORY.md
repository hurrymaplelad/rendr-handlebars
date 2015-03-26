# 1.0.1
## 2015-03-26
* allow instance of templateFinder to be passed in
* only ship handlbars runtime, greatly reduces client bundle size

# 1.0.0
## 2015-02-24
* update to handlebars 2.0.0
* update to underscore 1.8.2
* add serverToClientJson for an example of how to escape JSON between the client and server
* omit anything in the fetch params that as a data attribute

# 0.2.4
## 2015-02-03
* invoke block views with the parent scope

# 0.2.3
## 2015-02-03
* stringify objects
* added view tests
* fixed missing require for underscore

# 0.2.2
## 2015-01-08
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
