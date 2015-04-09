var Twit = Twit || {};

Twit.followerNavModel = Backbone.Model.extend({
  defaults: {
   retweet: false,
       favorite: false,
           destroy:false
  },

  url: '/displayChanges',
  syncCollection: function() {
    console.log('hello');
    Backbone.sync('create', this);
  }

});
