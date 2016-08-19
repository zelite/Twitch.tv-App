var users = ["ESL_SC2", "OgamingSC2", "cretetion",
    "freecodecamp", "storbeck", "habathcx", "RobotCaleb",
    "noobs2ninjas", "brunofin", "comster404"
];



function addUser(user) {
    $.getJSON("https://api.twitch.tv/kraken/users/" + user, function(data) {
        var logo = $("<div/>", {
                class: "picture two columns"
            })
            .append($("<img />", {
                class: "profile-img",
                src: data.logo || "images/Portrait_placeholder.png",
                alt: data.display_name + " user logo image"
            }));
        var username = $("<div/>", {
                class: "username three columns"
            })
            .append($("<p/>").text(data.display_name))

        var stream_info = $("<div/>", {
            class: "status seven columns"
        }).append($("<p/>"));
        var current_u_div = $("<div/>", {
            class: "user row"
        }).append(logo, username, stream_info);



        addStreamData(user, current_u_div);
    });
}

function addStreamData(user, div) {
    $.getJSON("https://api.twitch.tv/kraken/streams/" + user)
        .always(function(data, status) {
            if (status !== "success") {
                div.find(".status p").text("Account closed");
                div.addClass("offline");
                addToUserTable(div);
            }
            else {
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
        });
}


function addChannelLink(user, div) {
    $.getJSON("https://api.twitch.tv/kraken/channels/" + user)
        .done(function(data) {
            if (data.url) {
                div.find(".username p").wrap("<a href='" + data.url + "'></a>");
                addToUserTable(div);
            }
        });
}

function addToUserTable(div) {
    if (div.hasClass("online")) {
        $(".streamers-table").prepend(div);
    }
    else {
        $(".streamers-table").append(div);
    }
}


function filter(showThis, button) {
    $(".filter").removeClass("selected")
    $(button).addClass("selected");
    $(".user").removeAttr("style"); //First we show everything
    //Then we hide the oposite ones
    switch (showThis) {
        case 'online':
            $(".user.offline").css("display", "none");
            break;
        case 'offline':
            $(".user.online").css("display", "none")
    }
}

$(document).ready(function() {
    users.forEach(addUser);
    $("#filter-all").click(function() {
        filter("all", this);
    });
    $("#filter-online").click(function() {
        filter("online", this);
    });
    $("#filter-offline").click(function() {
        filter("offline", this);
    });
});
