var Twit = Twit || {};
Twit.friendsListCollection = Backbone.Collection.extend({
  model: Twit.friendsListModel,
  url: '/friends',
  syncCollection: function() {
    Backbone.sync('create', this);
  }
});
Twit.paging = -1
Twit.friendslistcollection = new Twit.friendsListCollection();
function paging(){
$.ajax({
  dataType: 'json',
  url: '/friends/'+Twit.paging,
  success: function(data) {
    var parsedata = JSON.parse(data.body);
    Twit.paging  = parsedata.next_cursor;
    for (var i = 1; i < parsedata.users.length; i++) {
      var specuser = parsedata.users[i];
      Twit.friendslistcollection.add(specuser);
    }
    Twit.friendslistview.render();
  },
  error: function(jqXHR, textStatus, errorThrown) {
    console.log(errorThrown);
  }
});
}
paging();
