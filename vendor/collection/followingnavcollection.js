var Twit = Twit || {};

Twit.followerNavCollection = Backbone.Collection.extend({
  model: Twit.followerNavModel,
  url: '/getids',
  syncCollection: function() {
    Backbone.sync('create', this);
  }

});
Twit.followernavcollection = new Twit.followerNavCollection();

function getfollowernav(){
$.ajax({
  dataType: 'json',
  url: '/getids',
  success: function(data) {
    Twit.followernavcollection.reset();
    console.log(data);
    Twit.followernavcollection.add(data);
    console.log(Twit.followernavcollection);
    Twit.followernavview.render()
  },
  error: function(error) {
    console.log(error);
  }

})
}
getfollowernav();
