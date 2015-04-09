var Twit = Twit || {};

Twit.contentDisplayView = Backbone.View.extend({
  el: '#contentdisplaydiv',
  render: function() {
    var self = this;
    var output = '<h3> People Chirping</h3>';
    this.collection.each(
      function(models) {
        output += self.template(models.attributes);
      });
    this.$el.html(output);
  },
  settings: _.templateSettings = {
    evaluate: /\{\{(.+?)\}\}/g,
    interpolate: /\{\{=(.+?)\}\}/g
  },

  template: _.template($("#contentdisplaytemplate").html()),
  initialize: function(){  
   this.listenTo(this.collection, 'add',this.render)
    this.listenTo(this.collection, 'remove',this.render);
  }
});

Twit.contentdisplayview = new Twit.contentDisplayView({
  collection: Twit.contentdisplaycollection
});
