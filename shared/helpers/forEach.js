/**
* Create a `forEach` helper that works on a few more cases and gives more flexibility
* when dealing with arrays, objects, or collections
*/
var _ = require('underscore');

module.exports = function (collection, opts) {
  var len = collection && collection.length,
      app = this._app || this.app,
      isCollection = app.modelUtils.isCollection(collection),
      buffer = '';

  if (_.isEmpty(collection)) {
    return opts.inverse(_.extend({}, this, {
      _app: app,
      _model: this._model || this.model,
      _collection: this._collection || this.collection,
      _view: this._view || this.view
    }));
  }

  // iterate the models on a collection
  if (isCollection) {
    collection = collection.models
  }

  _.each(collection, function (value, key) {
    if (isCollection && opts.hash.toJSON) {
      value = value.toJSON();
    }

    var item = _.extend({
      key: key,
      value: value,
      _app: this._app || this.app,
      _model: this._model || this.model,
      _collection: this._collection || this.collection,
      _view: this._view || this.view
    }, opts.hash);

    // adding extra attributes to an item for array traversal
    if (_.isArray(collection) || isCollection) {
      item = _.extend(item, {
        _total: len,
        _isFirst: key === 0,
        _isLast: key === (len - 1)
      });
    }

    buffer += opts.fn(item);
  }.bind(this));

  return buffer;
};
