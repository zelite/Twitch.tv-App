var users = ["ESL_SC2", "OgamingSC2", "cretetion",
             "freecodecamp", "storbeck", "habathcx", "RobotCaleb",
             "noobs2ninjas", "brunofin", "comster404", "jksdhfiusd874z387hf873h4"];

users_data = {};

users.forEach(function(u){
  users_data[u] = {};
});



function getUserInfo(username){
  return $.getJSON("https://api.twitch.tv/kraken/users/"+username)
            .always(function(data, status){
              collectUserData(data, status, username);});
}

function getUserStream(username){
  return $.getJSON("https://api.twitch.tv/kraken/streams/"+username)
    .always(function(data, status){
      collectStreamData(data, status, username);});
}

function collectUserData(data, status, username) {
    if (status == "success") {
            users_data[username].status = "exists";
            users_data[username].display_name = data.display_name;
            users_data[username].logo = data.logo || "https://unsplash.it/300/300";
        } // //if logo null uses placeholder, TODO: find placeholder image
    else {
        users_data[username].display_name = username;
        users_data[username].status = "not-found";
        users_data[username].logo = "https://unsplash.it/300/300";
        }
    }

function collectStreamData(data, status, username){
 if(status == "success"){
   if(data.stream === null){
     users_data[username].game = "Offline";
     users_data[username].channel_status = "";
   }else{
     users_data[username].game = data.stream.game;
     users_data[username].channel_status = data.stream.channel.status;
   }
 }else{
   users_data[username].game = "Account Closed";
   users_data[username].channel_status = "";
 }
}


users.forEach(function(u){
  getUserInfo(u);
  getUserStream(u);
});

$(document).ajaxStop(populatePage);

function populatePage(){
  users_divs = [];
  for (var user in users_data) {
   if (users_data.hasOwnProperty(user)) {
     var logo = $("<div/>", {class: "picture two columns"})
                   .append($("<img />", {class: "profile-img",
                                         src: users_data[user].logo,
                                         alt: users_data[user].display_name+" user logo image"}));

     var username =  $("<div/>", {class: "username three columns"})
                       .append($("<p/>").text(users_data[user].display_name));

     var stream_info = $("<div/>", {class: "status seven columns"}).append($("<p/>"));
     if(users_data[user].status == "not-found"){
       stream_info.find("p").text("User does not exist.");
     }else{
       stream_info.find("p").text(users_data[user].game+": "+users_data[user].channel_status);
     }

    var current_u_div = $("<div/>", {class: "row"}).append(logo, username, stream_info);

    if( users_data[user].status === "not-found" || ["Offline", "Account Closed"].indexOf(users_data[user].game) >=0  ){
      current_u_div.addClass("offline");
      $(".streamers-table").append(current_u_div);
    }else{
      current_u_div.addClass("online");
      $(".streamers-table").prepend(current_u_div);
    }
   }}

 }







//users.forEach(getUserInfo);
