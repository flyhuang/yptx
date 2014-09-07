function getCreateUserPage() {
    $.ajax({
      url: "/user/create",
      datatype: "text/html",
      type: "get",
      success: function(res) {
        $("#page-wrapper").html(res);
      }
    })
}

function getMessagePage(type) {
  $.ajax({
    url: "/messages/" + type,
    datatype: "text/html",
    type: "get",
    success: function(res) {
      $("#page-wrapper").html(res);
      //$("#dataTable-message").dataTable();
      var datatable = $("#dataTable-message").dataTable({
        "oLanguage": {
            "sSearch": "搜索:",
            "sLengthMenu": "每页显示 _MENU_ 条记录",
                "sZeroRecords": "没有记录",
            "sInfo": "显示第  _START_ 条到第  _END_ 条记录,一共  _TOTAL_ 条记录",
            "sInfoEmpty": "显示0条记录",
            "oPaginate": {
                "sPrevious": " 上一页 ",
                "sNext":     " 下一页 ",
                }
            },
            "bAutoWidth":false,
            "bProcessing":true,
            "bRetrieve":true,
        });}
  })
}

function getCreateMessagePage(type) {
    $.ajax({
      url: "/message/create/" + type,
      datatype: "text/html",
      type: "get",
      success: function(res) {
        $("#page-wrapper").html(res);
      }
    })
}

function createUser() {
  $.ajax({
    url: "/api/createuser",
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


function createMessage(type) {
  $.ajax({
    url: "/api/messages/create/" + type,
    datatype: "json",
    type: "put",
    data: $("#create-message-form").serialize(),
    success: function(res) {
        if (res.success) {
          alertify.success("消息创建成功!");
        } else {
          alertify.error(res.msg);
        }
    }
  })
}
