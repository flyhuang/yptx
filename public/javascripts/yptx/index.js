var currentDataTable;

// Page Request...
function getCreateUserPage(self) {
    remove();
    $(self).addClass('active');
    $.ajax({
        url: "/user/create",
        datatype: "text/html",
        type: "get",
        success: function (res) {
            $("#page-wrapper").html(res);
        },
        error: function (res) {
            window.location = "/login";
        }
    })
}

function getMessagePage(type, self) {
    remove();
    $(self).addClass('active');
    $.ajax({
        url: "/messages/" + type,
        datatype: "text/html",
        type: "get",
        success: function (res) {
            $("#page-wrapper").html(res);
            initMsgDataTable(type);
        },
        error: function (res) {
            window.location = "/login";
        }
    })
}

function getCreateMessagePage(type) {
    $.ajax({
        url: "/messages/create/" + type,
        datatype: "text/html",
        type: "get",
        success: function (res) {
            $("#page-wrapper").html(res);
            CKEDITOR.replace('msgContent');
        },
        error: function (res) {
            window.location = "/login";
        }
    })
}

function getUserListPage(self) {
    remove();
    $(self).addClass('active');
    $.ajax({
        url: "/user/list",
        datatype: "text/html",
        type: "get",
        success: function (res) {
            $("#page-wrapper").html(res);
            initUserDataTable();
        },
        error: function (res) {
            window.location = "/login";
        }
    })
}

function getEditUserPage(id) {
    $.ajax({
        url: "/user/edit/" + id,
        datatype: "text/html",
        type: "get",
        success: function (res) {
            $("#page-wrapper").html(res);
        },
        error: function (res) {
            window.location = "/login";
        }
    })
}

function getEditMsgPage(id) {
    $.ajax({
        url: "/messages/update/" + id,
        datatype: "text/html",
        type: "get",
        success: function (res) {
            $("#page-wrapper").html(res);
            CKEDITOR.replace('msgContent');
        },
        error: function (res) {
            window.location = "/login";
        }
    })
}

function getPermissionPage(self) {
    remove();
    $(self).addClass('active');
    $.ajax({
        url: "/user/permission",
        datatype: "text/html",
        type: "get",
        success: function (res) {
            $("#page-wrapper").html(res);
        },
        error: function (res) {
            window.location = "/login";
        }
    })
}

// Page request end...


// API...

function deleteMsg(messageid) {
    $.ajax({
        url: "/api/messages/delete/" + messageid,
        datatype: "json",
        type: "delete",
        success: function (res) {
            if (res.success) {
                alertify.success(res.msg);
                currentDataTable.api().ajax.reload()
            } else {
                alertify.error("删除失败!");
            }
        },
        error: function (res) {
            window.location = "/login";
        }
    })
}


function createUser() {
    $.ajax({
        url: "/api/createuser",
        datatype: "json",
        type: "post",
        data: $("#createUserForm").serialize(),
        success: function (res) {
            if (res.success) {
                alertify.success("用户创建成功!");
            } else {
                alertify.error(res.msg);
            }
        },
        error: function (res) {
            window.location = "/login";
        }
    })
}


function createMessage(type) {
    var content = CKEDITOR.instances.msgContent.getData();
    $.ajax({
        url: "/api/messages/create/" + type,
        datatype: "json",
        type: "put",
        data: {"title": $("input[name='title']").val(), "content": content},
        success: function (res) {
            if (res.success) {
                alertify.success("消息创建成功!");
            } else {
                alertify.error(res.msg);
            }
        },
        error: function (res) {
            window.location = "/login";
        }
    })
}

function updateMessage(id) {
    var content = CKEDITOR.instances.msgContent.getData();
    console.log(content);
    $.ajax({
        url: "/api/messages/update/" + id,
        datatype: "json",
        type: "post",
        data: {"title": $("input[name='title']").val(), "content": content},
        success: function (res) {
            if (res.success) {
                alertify.success("消息更新成功!");
            } else {
                alertify.error(res.msg);
            }
        },
        error: function (res) {
            window.location = "/login";
        }
    })
}

function deleteUser(id) {
    $.ajax({
        url: "/api/delete/user/" + id,
        datatype: "json",
        type: "delete",
        success: function (res) {
            if (res.success) {
                alertify.success(res.msg);
                currentDataTable.api().ajax.reload()
            } else {
                alertify.error("删除失败!");
            }
        },
        error: function (res) {
            window.location = "/login";
        }
    })
}

function updateUser(id) {
    $.ajax({
        url: "/api/update/user/" + id,
        datatype: "json",
        type: "post",
        data: $("#createUserForm").serialize(),
        success: function (res) {
            if (res.success) {
                alertify.success("更新用户信息成功!");
            } else {
                alertify.error(res.msg);
            }
        },
        error: function (res) {
            window.location = "/login";
        }
    })
}

function updatePermission() {
    $.ajax({
        url: "/api/permission",
        datatype: "json",
        type: "post",
        data: $("#permission-form").serialize(),
        success: function (res) {
            if (res.success) {
                alertify.success("更新游客用户权限成功!");
            } else {
                alertify.error(res.msg);
            }
        },
        error: function (res) {
            window.location = "/login";
        }
    })
}

// API END


// Common Function....
function initMsgDataTable(type) {
    currentDataTable = $("#dataTable-message").dataTable({
        "oLanguage": {
            "sSearch": "搜索:",
            "sLengthMenu": "每页显示 _MENU_ 条记录",
            "sZeroRecords": "没有记录",
            "sInfo": "显示第  _START_ 条到第  _END_ 条记录,一共  _TOTAL_ 条记录",
            "sInfoEmpty": "显示0条记录",
            "oPaginate": {
                "sPrevious": " 上一页 ",
                "sNext": " 下一页 "
            },
            "sProcessing": "<div width='100%' align='center'><img width='23px' height='28px' src='/images/loading.gif'></div>"
        },
        "bAutoWidth": false,
        "bProcessing": true,
        "bRetrieve": true,
        "ajax": "/api/messages/" + type + "?is_admin_request=true"
    });
}

function initUserDataTable() {
    currentDataTable = $("#dataTable-user").dataTable({
        "oLanguage": {
            "sSearch": "搜索:",
            "sLengthMenu": "每页显示 _MENU_ 条记录",
            "sZeroRecords": "没有记录",
            "sInfo": "显示第  _START_ 条到第  _END_ 条记录,一共  _TOTAL_ 条记录",
            "sInfoEmpty": "显示0条记录",
            "oPaginate": {
                "sPrevious": " 上一页 ",
                "sNext": " 下一页 "
            },
            "sProcessing": "<div width='100%' align='center'><img width='23px' height='28px' src='/images/loading.gif'></div>"
        },
        "bAutoWidth": false,
        "bProcessing": true,
        "bRetrieve": true,
        "ajax": "/api/user/list"
    });
}

function remove() {
    $("a[class='active']").removeClass('active');
}
