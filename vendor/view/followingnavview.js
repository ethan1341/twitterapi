var Twit = Twit || {};
Twit.followerNavView = Backbone.View.extend({
  el: '#followernavdiv',
  render: function() {
    var self = this;
    var output = '<h4> Currently  Listening</h4>';
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
  template: _.template($("#followernavtemplate").html()),
  events: {
    "change .favorite, .retweet,.destroy": "changedisplay",
    "click .savenav": "saveevent",
  },

  changedisplay: function() {
    var divclass = event.target.name;
    var divid = event.target.id;
    var obj = {
      name: divclass,
      id: divid
    }
    var findmodel = this.collection.findWhere({
      id_str: obj['id']
    });
    var vary = '.' + divclass;
    if ($(this.class).is(':checked')) {
    console.log($(this.class));
      findmodel.set(obj['name'], true);
      console.log(findmodel.attributes);
    } else {
      findmodel.set(obj['name'], false);
      console.log(findmodel.attributes);
    }
  },

  saveevent: function() {

    var divid = event.target.id;
    var obj = {
      id: divid
    }

    var findmodel = this.collection.findWhere({
      id_str: obj['id']
    });
    console.log(findmodel)
    findmodel.syncCollection();
    getcontent();
  },
  initialize:function(){
   this.listenTo(this.collection, 'add',this.render)
    this.listenTo(this.collection, 'remove',this.render);
    this.listenTo(this.collection, 'change',this.render);
  }

});

Twit.followernavview = new Twit.followerNavView({
  collection: Twit.followernavcollection
});
