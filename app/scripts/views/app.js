var Backbone = require('backbone');
var Handlebars = require('handlebars');
var Templates = require('templates')(Handlebars);

module.exports = Backbone.View.extend({
  template: Templates['app/templates/app.hbs'],
  initialize: function () {
      this.render();
  },
  render: function() {
    this.$el.html(this.template({hello: "Welcome to Backbone & Marionette Skeleton"}));

    return this;
  }
});