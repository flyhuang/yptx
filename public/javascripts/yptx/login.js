//function login() {
//    $.ajax({
//        url: "/oauth/token",
//        datatype: "json",
//        type: "POST",
//        data: {"username": $("input[name='username']").val(), "client_id":"yptx", "client_secret":"yptx", "password": $("input[name='password']").val(), "is_admin": true, "grant_type": "password"},
//        success: function (res) {
//            storeToken(res.access_token, res.refresh_token);
//        },
//        error: function (res) {
//            alertify.error("用户名或者密码错误");
//        }
//    })
//}
//
//function storeToken(access_token, refresh_token) {
//    $.ajax({
//        url: "/store/token",
//        datatype: "json",
//        type: "POST",
//        data: {"access_token": access_token, "refresh_token": refresh_token},
//        success: function (res) {
//            window.location = "/dashboard";
//        },
//        error: function () {
//            alertify.error("登陆失败, 请重新登陆");
//        }
//    })
//}

function login() {
    $.ajax({
        url: "/api/login",
        datatype: "json",
        type: "POST",
        data: {"username": $("input[name='username']").val(), "password": $("input[name='password']").val(), "is_admin": true},
        success: function (res) {
            if (res.success) {
                window.location = "/dashboard"
            } else {
                alertify.error(res.msg);
            }
        }
    })
}
