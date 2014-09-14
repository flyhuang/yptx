//function login() {
//    $.ajax({
//        url: "/oauth/token",
//        datatype: "json",
//        type: "POST",
//        data: {"username": $("input[name='username']").val(), "client_id":"yptx", "client_secret":"yptx", "password": $("input[name='password']").val(), "is_admin": true, "grant_type": "password"},
//        success: function (res) {
//            window.location = "/dashboard";
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
