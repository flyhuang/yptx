function getCreateUserPage() {
    $.ajax({
      url: "/user/create",
      datatype: "text/html",
      type: "get",
      success: function(res) {
        // if (res.success) {
        $("#page-wrapper").text("").append(res);
        // } else {
          // alertify.error(res.msg);
        // }
      }

    })
}


function createUser() {
  $.ajax({
    url: "/createuser",
    datatype: "json",
    type: "post",
    data: $("#createUserForm").serialize(),
    success: function(res) {
        if (res.success) {
          alertify.success("用户创建成功!");
        } else {
          alertify.error(res.msg);
        }
    }

  })
}
