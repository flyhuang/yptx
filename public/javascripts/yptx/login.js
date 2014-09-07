function login() {
  $.ajax({
    url: "/api/login",
    datatype: "json",
    type: "POST",
    data: {"username": $("input[name='username']").val(), "password": $("input[name='password']").val()},
    success: function(res) {
      if (res.success) {
        window.location = "/dashboard"
      } else {
        alertify.error(res.msg);
      }
    }

  })
}
