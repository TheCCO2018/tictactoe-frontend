var activeUser;

function updateTable(data){
    $('#users').empty(); // Clear the table body.
    if(data.Result == '1'){
        // Loop through the list of users.
        $.each(data.Data, function (key, val) {
            // Add a table row for the user.
            if(sessionStorage.getItem("userName") == val.Username)
                $('#users').append('<tr class="table-success"><td>'+val.Stats.Rank+'</td><td>' + val.Username + '</td><td>' + val.Stats.TotalWins + '</td><td>' + val.Stats.TotalLoses + '</td><td>' + val.Stats.WinStreak + '</td><td>' + val.Stats.Point + '</td><tr/>');
            else{
                if(val.Stats.Rank == 1)
                    $('#users').append('<tr class="table-gold"><td>'+val.Stats.Rank+'</td><td>' + val.Username + '</td><td>' + val.Stats.TotalWins + '</td><td>' + val.Stats.TotalLoses + '</td><td>' + val.Stats.WinStreak + '</td><td>' + val.Stats.Point + '</td><tr/>');
                else if(val.Stats.Rank == 2)
                    $('#users').append('<tr class="table-silver"><td>'+val.Stats.Rank+'</td><td>' + val.Username + '</td><td>' + val.Stats.TotalWins + '</td><td>' + val.Stats.TotalLoses + '</td><td>' + val.Stats.WinStreak + '</td><td>' + val.Stats.Point + '</td><tr/>');
                else if(val.Stats.Rank == 3)
                    $('#users').append('<tr class="table-bronze"><td>'+val.Stats.Rank+'</td><td>' + val.Username + '</td><td>' + val.Stats.TotalWins + '</td><td>' + val.Stats.TotalLoses + '</td><td>' + val.Stats.WinStreak + '</td><td>' + val.Stats.Point + '</td><tr/>');
                else
                    $('#users').append('<tr ><td>'+val.Stats.Rank+'</td><td>' + val.Username + '</td><td>' + val.Stats.TotalWins + '</td><td>' + val.Stats.TotalLoses + '</td><td>' + val.Stats.WinStreak + '</td><td>' + val.Stats.Point + '</td><tr/>');
            }
        });
    }else{
        $('#users').append('<tr class="table-warning"><td colspan="6">This list is under construction!<td></tr>')
    }
}

// Gets Informations Of Active Client User
function getActiveUser() {            
$.getJSON("http://localhost:4812/api/users",
    function (data) {
        $('#users').empty(); // Clear the table body.
        if(data.Result == "1"){
            var counter = 0;
            // Loop through the list of users.
            $.each(data.Data, function (key, val) {
                // Add a table row for the user.
                if(val.Username == sessionStorage.getItem('userName')){
                    activeUser = val;
                    $.getJSON("http://localhost:4812/api/users/"+activeUser.AspUserId, 
                        function(data){
                            activeUser = data
                            if(!sessionStorage.getItem('userName').includes("Guest"))
                                $('#activeUser').append('<tr class="table-success"><td>'+ activeUser.Data[0].Stats.Rank +'</td><td>' + activeUser.Data[0].Username + '</td><td>' + activeUser.Data[0].Stats.TotalWins + '</td><td>' + activeUser.Data[0].Stats.TotalLoses + '</td><td>' + activeUser.Data[0].Stats.WinStreak + '</td><td>' + activeUser.Data[0].Stats.Point + '</td><tr/>')
                            else
                                $('#activeUser').append('<tr class="table-success"><td colspan="6"><i style="margin-right: 0.4em; color:#17a2b8" class="fas fa-info"></i><i style="font-size:20px" class="text-info">If you want to see yourself at the Leaderboard you need to <a href="" onClick="registerGuest()"><u>register</u></a> first. :)</i></td><tr/>')
                    })                
                }
            });
        }else{
            $('#users').append('<tr><td colspan="6">User not found!<td></tr>')
        }
    });
}
function registerGuest(){     
    if(sessionStorage.getItem('userName').includes('Guest')){
        $.ajax({
            type: 'DELETE',
            url: 'http://localhost:4812/api/users/'+activeUser.Data[0].AspUserId,
        })
        debugger;
        sessionStorage.removeItem('tokenKey')
        sessionStorage.removeItem('userName')
        window.location = "file:///C:/Users/User/Desktop/C%23-Java-C-%C4%B0deas%20&%20Projects/tictactoe-frontend/dist/login.html"
    }
}
// Gets Informations All Users With Their Stats
function getUsers() {
    $.getJSON('http://localhost:4812/api/users/FullBoard', function(data){updateTable(data)})
}

// Gets Informations Of top 15 users
function getLeaderBoard() {            
    $.getJSON("http://localhost:4812/api/users/LeaderBoard", function(data){updateTable(data)})
}

// Updates users stats end of the games depends on winning situation
function updateUserStats(winnerId,loserId){

    $.ajax({
        type: 'POST',
        url:'http://localhost:4812/api/users/'+winnerId+'/winner',
    }).done(function (data) {
        getUsers()
    }).fail(function(data){
        getUsers()
        alert("User informations couldn't updated! An Error has ocurred!")
    })

    $.ajax({
        type: 'POST',
        url:'http://localhost:4812/api/users/'+loserId+'/loser',
    }).done(function (data) {
        getUsers()
    }).fail(function(data){
        getUsers()
        alert("User informations couldn't updated! An Error has ocurred!")
    })
}
$(function(){
    var token = sessionStorage.getItem("tokenKey");

    $.ajaxSetup({
        headers : {
            'Authorization' : 'Bearer ' + token,
        }
    });

    getActiveUser()
    getLeaderBoard()

})