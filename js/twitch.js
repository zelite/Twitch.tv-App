var users = ["ESL_SC2", "OgamingSC2", "cretetion",
             "freecodecamp", "storbeck", "habathcx", "RobotCaleb",
             "noobs2ninjas", "brunofin", "comster404"];



function addUser(user){
    $.getJSON("https://api.twitch.tv/kraken/users/"+user, function(data){
            var logo = $("<div/>", {class: "picture two columns"})
                   .append($("<img />", {class: "profile-img",
                                         src: data.logo || "images/Portrait_placeholder.png",
                                         alt: data.display_name+" user logo image"}));
            var username = $("<div/>", {class: "username three columns"})
                            .append($("<p/>").text(data.display_name))
            
            var stream_info = $("<div/>", {class: "status seven columns"}).append($("<p/>"));
            var current_u_div = $("<div/>", {class: "user row"}).append(logo, username, stream_info);
            
            
            
            addStreamData(user, current_u_div);
            })}

function addStreamData(user, div) {
    $.getJSON("https://api.twitch.tv/kraken/streams/" + user)
        .always(function(data, status) {
            if(status !== "success"){
            div.find(".status p").text("Account closed");
            div.addClass("offline");
            addToUserTable(div);
        }else{
            if (data.stream) {
                div.find(".status p").html(data.stream.game + "<span class='extra-status'>: " + data.stream.channel.status);
                div.addClass("online");
            }
            else {
                div.find(".status p").text("Offline");
                div.addClass("offline");
            }
            addChannelLink(user, div);
        }
        })}
        

function addChannelLink(user, div){
    $.getJSON("https://api.twitch.tv/kraken/channels/"+user) 
        .done(function(data){
            debugger;
            if(data.url){
            div.find(".username p").wrap("<a href='"+data.url+"'></a>");
            addToUserTable(div);
            }
        });
}
        
function addToUserTable(div){
    if(div.hasClass("online")){
        $(".streamers-table").prepend(div);
    }else{
        $(".streamers-table").append(div);
    }
}
    
  /*for (var user in users_data) {
   if (users_data.hasOwnProperty(user)) {
     var logo = $("<div/>", {class: "picture two columns"})
                   .append($("<img />", {class: "profile-img",
                                         src: users_data[user].logo,
                                         alt: users_data[user].display_name+" user logo image"}));

     var username = $("<a/>", {href: "#"})// TODO: add links
                      .append(
                            $("<div/>", {class: "username three columns"})
                            .append($("<p/>").text(users_data[user].display_name))
                            );

     var stream_info = $("<div/>", {class: "status seven columns"}).append($("<p/>"));
     if(users_data[user].status == "not-found"){
       stream_info.find("p").text("User does not exist.");
     }else{
       stream_info.find("p").html(users_data[user].game+"<span class='extra-status'>"+users_data[user].channel_status+"</span>");
     }

    var current_u_div = $("<div/>", {class: "user row"}).append(logo, username, stream_info);

    if( users_data[user].status === "not-found" || ["Offline", "Account Closed"].indexOf(users_data[user].game) >=0  ){
      current_u_div.addClass("offline");
      $(".streamers-table").append(current_u_div);
    }else{
      current_u_div.addClass("online");
      $(".streamers-table").prepend(current_u_div);
    }
   }}*/

 





$(document).ready(
    users.forEach(addUser)
    );
