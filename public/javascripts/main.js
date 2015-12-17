$(function () {

    /**
     * add listener on #add_btn, for add api
     */
    $('#add_btn button:eq(0)').on('click', function () {
        var add_input = $('<div id="add_input" class="row"><div class="col-xs-2"><input id="add_input_name"  placeholder="Input Api Name"></div><div class="col-xs-2"><select id="add_input_type"><option value="GET">GET</option><option value="POST">POST</option><option value="PUT">PUT</option><option value="DELETE">DELTE</option></select></div><div class="col-xs-6"><textarea id="add_input_desc" placeholder="Input Api Desc" style="width:100%"></textarea></div></div>');
        $('#api_view').append(add_input);

        $('#add_btn button:eq(0)').css('display', 'none');
        $('#add_btn button:eq(1)').css('display', 'inline');
        $('#add_btn button:eq(2)').css('display', 'inline');
    });

    /**
     * send inputs's value to add api
     */
    $('#add_btn button:eq(1)').on('click', function () {
        var name = $('#add_input_name').val();
        var type = $('#add_input_type').val();
        var desc = $('#add_input_desc').val();

        if (!name || !type || !desc) {
            alert('Please Complet');
            return false;
        }

        $.ajax({
            type: 'GET',
            url: '/api/add?name=' + name + '&type=' + type + '&desc=' + desc,
            success: function (data) {
                $('#add_input').remove();
                location.reload();
            }
        });
    });

    /**
     * add_btn reset
     */
    $('#add_btn button:eq(2)').on('click', function () {
        $('#add_input').remove();
        $('#add_btn button:eq(0)').css('display', 'block');
        $('#add_btn button:eq(1)').css('display', 'none');
        $('#add_btn button:eq(2)').css('display', 'none');
    })


    /**
     * delete one api
     */
    $('.api_del').on('click', function () {

        var r = confirm('您确定要删除这条api吗?');
        if (!r) {
            return false;
        }
        var _id = $(this).attr('api_id');
        $.ajax({
            type: 'GET',
            url: '/api/delete?_id=' + _id,
            success: function (data) {
                location.reload();
            }
        })
    });


    /**
     * add event
     */
    $('.api_view_add').on('click', function (event, param1, param2) {
        var html = '';
        if (param1 && param2) {
            html = $('<div class="row"><div class="col-xs-6">Key: <input value="' + param1 + '"></div> <div class="col-xs-6"> Value: <input value="' + param2 + '"></div></div>');
        } else {

            html = $('<div class="row"><div class="col-xs-6">Key: <input></div> <div class="col-xs-6"> Value: <input></div></div>');
        }
        $(this).parent().find('.api_view_request').append(html);
    })

    /**
     * minus event
     */
    $('.api_view_minus').on('click', function () {
        $(this).parent().find('.api_view_request .row:last').remove();
    });

    /**
     * send event
     */
    $('.api_view_send').on('click', function () {
        var that = this;
        var name = $(this).parent().parent().find('.api_view_name').text().trim();
        var type = $(this).parent().parent().find('.api_view_type').text().trim();

        var request = {};
        /**
         * get keys and values
         */
        var req_line = $(this).parent().parent().parent().find('.api_view_request .row');
        req_line.each(function (index, item) {
            var key = $(item).find('input:first').val().trim();
            var value = $(item).find('input:last').val().trim();
            request[key] = value;
        });

        if (name.match(':[a-zA-Z]')) {
            var param_name = name.split(':');
            if (!request[param_name[1]]) {
                return false;
            }
            var acture_param_name = request[param_name[1]];
            delete request[param_name[1]];
            name = param_name[0] + '/' + acture_param_name;
        }

        console.log(name);
        console.log(request);

        url = name;
        $.ajax({
            type: type,
            url: url,
            data: request,
            success: function (data) {
                console.log(data);
                var html = $('<div>' + JSON.stringify(data) + '</div>');
                $(that).parent().parent().parent().find('.api_view_response').empty();
                $(that).parent().parent().parent().find('.api_view_response').append(html);
            }
        });
    });

    /**
     * go in update
     */
    $('.api_update').on('click', function () {
        /**
         * get value
         * @type {*|jQuery}
         */

        $('#modal_update .api_view_request').empty();

        var id = $(this).attr('api_id');

        $.ajax({
            type: 'GET',
            url: '/api?id=' + id,
            success: function (result) {
                $('#update_name input').val(result.data.name);
                $('#update_type select').val(result.data.type);
                $('#update_desc textarea').text(result.data.desc);
                $('#update_id input').val(result.data._id);
                if (result.data.request) {
                    var request = JSON.parse(result.data.request);
                    for (var i in request) {
                        $('.api_view_add').trigger('click', [i, request[i]]);
                        //$('#modal_update .api_view_request .row ')
                    }
                }

                $('#modal_update').modal();
            }
        })


        //var name = $($(this).parent().siblings()[0]).text().trim();
        //var type = $($(this).parent().siblings()[1]).text().trim();
        //var desc = $($(this).parent().siblings()[2]).text().trim();

        /**
         * set value
         */

    });

    /**
     * update event
     */
    $('#api_update_btn').on('click', function () {
        var data = getUpdateModalData(this);
        console.log(data.request);
        var id = $('#update_id input').val();

        var url = '/api/update?id=' + id;
        $.ajax({
            type: 'POST',
            url: url,
            data: data,
            success: function () {
                location.reload();

            }
        });
    });

    function getUpdateModalData(update_btn) {
        var name = $(update_btn).parent().parent().find('#update_name input').val();
        var type = $(update_btn).parent().parent().find('#update_type select').val();
        var desc = $(update_btn).parent().parent().find('#update_desc textarea').val();

        /**
         * get requests
         */
        var request = {};
        var req_line = $(update_btn).parent().parent().find('.api_view_request .row');
        req_line.each(function (index, item) {
            var key = $(item).find('input:first').val().trim();
            var value = $(item).find('input:last').val().trim();
            request[key] = value;
        });


        var result = {
            name: name,
            type: type,
            desc: desc,
            request: JSON.stringify(request)
        }

        return result;
    }

    ///**
    // * send ajax
    // */
    //function send(name, type) {
    //    url = '/api' + name;
    //    $.ajax({
    //        type: type,
    //        url: url,
    //        success: function(data){
    //            var html = $('<div>JSON.stringify(data)</div>');
    //            $()
    //        }
    //    })
    //}

    /**
     * send ajax
     */
    //(function () {
    //    $('.api_view_content').each(function (index, item) {
    //        var name = $(item).find('.api_view_name').text().trim();
    //        var type = $(item).find('.api_view_type').text().trim();
    //
    //        console.log(name);
    //        console.log(type)
    //
    //        $.ajax({
    //            type: type,
    //            url: '/api' + name,
    //            success: function (data) {
    //                var html = null;
    //
    //                if (type === 'GET') {
    //
    //                    html = $('<div class="row"><div class="col-xs-2"><div>params: <input></div><div>query: <input></div></div> <div class="col-xs-8">response: ' + JSON.stringify(data) + '</div></div>')
    //                } else {
    //                    html = $('<div class="row"><div class="col-xs-2"><div>body: <input></div></div> <div class="col-xs-8">response: ' + JSON.stringify(data) + '</div></div>')
    //                }
    //                //console.log(html);
    //                $($('.api_view_foot')[index]).append(html);
    //            }
    //        });
    //    });
    //})();

    /**
     * init
     */
    (function () {
        $('.api_view_send').trigger('click');
    })();

});