var Twit = Twit || {};

Twit.contentDisplayCollection = Backbone.Collection.extend({
  model: Twit.contentDisplayModel
});

Twit.contentdisplaycollection = new Twit.contentDisplayCollection();
var content = Twit.contentdisplaycollection;
function getcontent(){
$.ajax({
  dataType: 'json',
  url: '/getcontent',
  success: function(data) {
   Twit.contentdisplaycollection.reset();
   for (var i = 0; i < data.length; i++) {
      for(var j = 0;j < data[i].length;j++){
        content.add(data[i][j]);
      
      }
      //  Twit.contentdisplaycollection.add(collectionbody);  
    }
    for ( var l = 0; l < content.models.length;l++){
     if(content.models[l].attributes.favorited_id){
        var username = Twit.followernavcollection.get(Twit.contentdisplaycollection.models[l].attributes.favorited_id);
        console.log(content.models[l].attributes.favorited_id);
        content.models[l].set('name',username.attributes.screen_name);
     }else{
        console.log('hello');
     }
    }
   Twit.contentdisplayview.render();
    //var parsedata =JSON.parse(data.body[0])
    // var parsedata = data[i].body;
    // var collectiondata = JSON.parse(parsedata);
    // for(var i = 0; i < collectiondata.length;i++){
    // Twit.contentdisplaycollection.add(collectiondata[i]);
    // }
    // Twit.contentdisplayview.render();
    // console.log(Twit.contentdisplaycollection);
  }
});
}
getcontent();
