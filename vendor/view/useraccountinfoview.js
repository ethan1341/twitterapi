var Twit = Twit || {};

Twit.accountInfoView = Backbone.View.extend({
  el: '#accountinfodiv',
  render: function() {
    var self = this;
    var output = '';
    this.collection.each(
      function(models) {
        output += self.template(models.attributes);
      })
    this.$el.html(output);
  },

  settings: _.templateSettings = {
    evaluate: /\{\{(.+?)\}\}/g,
    interpolate: /\{\{=(.+?)\}\}/g
  },

  template: _.template($("#accountinfotemplate").html()),

});

Twit.accountinfoview = new Twit.accountInfoView({
  collection: Twit.accountinfocollection
});
