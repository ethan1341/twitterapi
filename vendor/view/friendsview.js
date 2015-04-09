var Twit = Twit || {};

Twit.friendsListView = Backbone.View.extend({
  el: '#friendslist',
  render: function() {
    var self = this;
    var output = ' <h2>Add Chirpers</h2> ';
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
  template: _.template($("#friendstemplate").html()),
  events: {
    'click .listen': 'addfollowers',
    'mouseover ':'pag',
    'change':'changefunc'
  },
  addfollowers: function() {
    var followerid = event.target.id;
    var getmodel = Twit.friendslistcollection.get(followerid);
    var clonemodel = getmodel.clone();
    // clonemodel.set("follower_id", followerid);
    clonemodel.Sync();

    getfollowernav();
    getcontent();
  },
  pag: function(){
  console.log('hello5');
    $('#friendslist').bind('scroll', function(){
      if($(this).scrollTop() + $(this).innerHeight() >= this.scrollHeight){
        $('#friendslist').empty();
       console.log('page');
        paging();
        Twit.friendslistview.render();
      }
    })
  },
});

Twit.friendslistview = new Twit.friendsListView({
  collection: Twit.friendslistcollection
});
