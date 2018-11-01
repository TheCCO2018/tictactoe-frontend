$(function(){

    $(document).ready(function(){
        if(sessionStorage.getItem("tokenKey") !== null && sessionStorage.getItem("userName") !== null){
            location.href= "file:///C:/Users/User/Desktop/C%23-Java-C-%C4%B0deas%20&%20Projects/tictactoe-frontend/dist/MainMenu.html"
        }
    })

    // Login
    $("#login").submit(function(event){ 
        event.preventDefault();

        var loginData = {
            grant_type: 'password',
            Username: $('#login-username').val(),
            Password: $('#login-password').val()
        };

        $.ajax({
            type: 'POST',
            url: 'http://localhost:4812/token',
            contentType: 'application/x-www-form-urlencoded; charset=utf-8',
            data: loginData,
        }).done(function (data) {
            $("#login-info").removeClass("text-warning")
            $("#login-info").addClass("text-succes")
            $("#login-info").text("You've successfully logged in. Enjoy your game :)")
            // Cache the access token in session storage.
            sessionStorage.setItem("tokenKey", data.access_token)
            sessionStorage.setItem("userName", data.userName)
            location.href = "file:///C:/Users/User/Desktop/C%23-Java-C-%C4%B0deas%20&%20Projects/tictactoe-frontend/dist/MainMenu.html"
        }).fail(function(){
            $("#login-info").addClass("text-warning")
            $("#login-info").text("Your login attempt is failed please check your credentials.")
        })
        return false;
    })

    // Register
    $("#sign-up").submit(function(event){
        event.preventDefault(); 

        var data = {
            Username: $("#sign-username").val(),
            Password: $("#sign-password").val(),
            ConfirmPassword: $("#sign-confirm-password").val()
        };
        
        $.ajax({
            type: 'POST',
            url: 'http://localhost:4812/api/Account/Register',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(data)
        }).done(function (data) {
            $("#sign-info").removeClass("text-warning")
            $("#sign-info").addClass("text-succes")
            $("#sign-info").text("You've successfully registered. You can login and enjoy the game now :)")
        }).fail(function(){
            $("#sign-info").removeClass("text-succes")
            $("#sign-info").addClass("text-warning")
            $("#sign-info").text("Your login attempt is failed please check your credentials.")
        })
        return false;
    })

    $("#loginAsGuest").click(function(event){ 
        event.preventDefault();

        var guestName = "Guest"+(Math.floor(Math.random()*100)+1).toString();
        var guestPassword = "!"+guestName;

        var loginData = {
            grant_type: 'password',
            Username: guestName,
            Password: guestPassword
        };

        var data ={
            Username: guestName,
            Password: guestPassword,
            ConfirmPassword: guestPassword
        }

        $.ajax({
            type: 'POST',
            url: 'http://localhost:4812/api/Account/Register',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(data)
        }).done(function (data) {
            console.log("Guest user registered successfully!")
            $.ajax({
                type: 'POST',
                url: 'http://localhost:4812/token',
                contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                data: loginData,
            }).done(function (data) {
                console.log("Guest user logged in successfully!")
                // Cache the access token in session storage.
                sessionStorage.setItem("tokenKey", data.access_token)
                sessionStorage.setItem("userName", data.userName)
                location.href = "file:///C:/Users/User/Desktop/C%23-Java-C-%C4%B0deas%20&%20Projects/tictactoe-frontend/dist/MainMenu.html"
            }).fail(function(){
                alert("Our guest account limit has full for now. If you want to play the game please register as a normal player!")
                console.log("Failed to logging a guest user!")
            })
        }).fail(function(){
            alert("Our guest account limit has full for now. If you want to play the game please register as a normal player!")
            console.log("Failed to registering a guest user!")
        })
        
        return false;
    })

})