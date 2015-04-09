var Twit = Twit || {};
Twit.friendsListModel = Backbone.Model.extend({
  defaults: {
    favorite: true,
    retweet: true,
    destroy: false
  },
  Sync: function(){ 
  return Backbone.sync('create', this,{url:'/friends', success:function(){ return getfollowernav();}});
  }
})
