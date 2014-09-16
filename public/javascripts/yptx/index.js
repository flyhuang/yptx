var currentDataTable;

$(document).ajaxError(function (event, xhr, options, exc) {
    console.log(event);
    console.log(xhr);
    console.log(options);
    console.log(exc);
    window.location = "/login?expired=true";
});

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
        }
    })
}

// Page request end...


// API...

function deleteMsg(messageid) {
    $.ajax({
        url: "/admin/api/messages/delete/" + messageid,
        datatype: "json",
        type: "delete",
        success: function (res) {
            if (res.success) {
                alertify.success(res.msg);
                currentDataTable.api().ajax.reload()
            } else {
                alertify.error("删除失败!");
            }
        }
    })
}


function createUser() {
    $.ajax({
        url: "/admin/api/createuser",
        datatype: "json",
        type: "post",
        data: $("#createUserForm").serialize(),
        success: function (res) {
            if (res.success) {
                alertify.success("用户创建成功!");
            } else {
                alertify.error(res.msg);
            }
        }
    })
}


function createMessage(type) {
    var content = CKEDITOR.instances.msgContent.getData();
    $.ajax({
        url: "/admin/api/messages/create/" + type,
        datatype: "json",
        type: "put",
        data: {"title": $("input[name='title']").val(), "content": content},
        success: function (res) {
            if (res.success) {
                alertify.success("消息创建成功!");
            } else {
                alertify.error(res.msg);
            }
        }
    })
}

function updateMessage(id) {
    var content = CKEDITOR.instances.msgContent.getData();
    console.log(content);
    $.ajax({
        url: "/admin/api/messages/update/" + id,
        datatype: "json",
        type: "post",
        data: {"title": $("input[name='title']").val(), "content": content},
        success: function (res) {
            if (res.success) {
                alertify.success("消息更新成功!");
            } else {
                alertify.error(res.msg);
            }
        }
    })
}

function updateUserStatus(id, status) {
    $.ajax({
        url: "/admin/api/update/user/"+ status +"/"+ id +"/",
        datatype: "json",
        type: "post",
        success: function (res) {
            if (res.success) {
                alertify.success("用户状态更新成功!");
                currentDataTable.api().ajax.reload();
            } else {
                alertify.error(res.msg);
            }
        }
    })
}

function deleteUser(id) {
    $.ajax({
        url: "/admin/api/delete/user/" + id,
        datatype: "json",
        type: "delete",
        success: function (res) {
            if (res.success) {
                alertify.success(res.msg);
                currentDataTable.api().ajax.reload()
            } else {
                alertify.error("删除失败!");
            }
        }
    })
}

function updateUser(id) {
    $.ajax({
        url: "/admin/api/update/user/" + id,
        datatype: "json",
        type: "post",
        data: $("#createUserForm").serialize(),
        success: function (res) {
            if (res.success) {
                alertify.success("更新用户信息成功!");
            } else {
                alertify.error(res.msg);
            }
        }
    })
}

function updatePermission() {
    $.ajax({
        url: "/admin/api/permission",
        datatype: "json",
        type: "post",
        data: $("#permission-form").serialize(),
        success: function (res) {
            if (res.success) {
                alertify.success("更新游客用户权限成功!");
            } else {
                alertify.error(res.msg);
            }
        }
    })
}

function logout() {
    $.ajax({
        url: "/admin/api/logout",
        datatype: "json",
        type: "get",
        success: function (res) {
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
        "ajax": "/admin/api/messages/" + type
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
        "ajax": "/admin/api/user/list"
    });
}

function remove() {
    $("a[class='active']").removeClass('active');
}
