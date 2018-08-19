var date;
var firstDay;
var lastDay;
$(document).ready(function () {
    date = new Date();
    firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
    lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString();
    configGet().done(function (configs) {
        eventsGet(configs);
    });
});

function configGet() {
    debugger;
    var deferred = $.Deferred();
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        url: window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.2/pcx_calendarentities?$select=pcx_calendarentityid,pcx_calendarentityname,pcx_enddatefield,pcx_hexcolorcode,pcx_calendarname,pcx_locationfield,pcx_partyfield,pcx_showincalendar,pcx_showteamcalendar,pcx_startdatefield,pcx_subjectfield,pcx_tooltipfield",
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("OData-MaxVersion", "4.0");
            XMLHttpRequest.setRequestHeader("OData-Version", "4.0");
            XMLHttpRequest.setRequestHeader("Accept", "application/json");
            XMLHttpRequest.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
        },
        async: true,
        success: function (data, textStatus, xhr) {
            var results = data;
            var configs = [];

            for (var i = 0; i < results.value.length; i++) {
                var config = {};
                config.pcx_calendarentityid = results.value[i]["pcx_calendarentityid"];
                config.pcx_calendarentityname = results.value[i]["pcx_calendarentityname"];
                config.pcx_enddatefield = results.value[i]["pcx_enddatefield"];
                config.pcx_hexcolorcode = results.value[i]["pcx_hexcolorcode"];
                config.pcx_calendarname = results.value[i]["pcx_calendarname"];
                config.pcx_locationfield = results.value[i]["pcx_locationfield"];
                config.pcx_partyfield = results.value[i]["pcx_partyfield"];
                config.pcx_showincalendar = results.value[i]["pcx_showincalendar"];
                config.pcx_showincalendar_formatted = results.value[i]["pcx_showincalendar@OData.Community.Display.V1.FormattedValue"];
                config.pcx_showteamcalendar = results.value[i]["pcx_showteamcalendar"];
                config.pcx_showteamcalendar_formatted = results.value[i]["pcx_showteamcalendar@OData.Community.Display.V1.FormattedValue"];
                config.pcx_startdatefield = results.value[i]["pcx_startdatefield"];
                config.pcx_subjectfield = results.value[i]["pcx_subjectfield"];
                config.pcx_tooltipfield = results.value[i]["pcx_tooltipfield"];
                configs.push(config);
            }
            deferred.resolve(configs);
        },
        error: function (xhr, textStatus, errorThrown) {
            window.parent.Xrm.Utility.alertDialog(textStatus + " " + errorThrown);
        }
    });
    return deferred.promise();
}

function eventsGet(configs) {
    debugger;
    console.log("config:");
    console.log(configs);
    var promises = [];
    var events = [];
    var j = -1;
    var deferred = $.Deferred();
    for (var k = 0; k < configs.length; k++) {
        if (configs[k].pcx_showincalendar && window.name == configs[k].pcx_calendarname) {
            var url = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.2/" + configs[k].pcx_calendarentityname + "s?$select=" +
                //_ownerid_value
                "_" + configs[k].pcx_partyfield + "_value," +
                //pcx_caseplaneventname
                configs[k].pcx_subjectfield + "," +
                //pcx_startdate
                configs[k].pcx_startdatefield + "," +
                //pcx_enddate
                configs[k].pcx_enddatefield + "," +
                //pcx_description
                configs[k].pcx_tooltipfield;
            //"pcx_enddate,pcx_location,pcx_startdate&$filter=pcx_startdate gt 2018-06-01T04:00:00.000Z and  pcx_enddate lt 2018-06-30T04:00:00.000Z",
            if (configs[k].pcx_calendarentityname == "appointment") {
                url = url + '&$filter= ' + configs[k].pcx_startdatefield + ' ge ' + firstDay + ' and ' + configs[k].pcx_enddatefield + ' le ' + lastDay + ' and contains(pcx_attendies,\'' + window.parent.Xrm.Page.context.getUserName() + '\')';
            }
            else
                url = url + '&$filter= ' + configs[k].pcx_startdatefield + ' ge ' + firstDay + ' and ' + configs[k].pcx_enddatefield + ' le ' + lastDay + ' and _' + configs[k].pcx_partyfield + '_value eq ' + window.parent.Xrm.Page.context.getUserId().replace("{", "").replace("}", "");
            console.log(url);

            promises.push($.ajax({
                type: "GET",
                contentType: "application/json; charset=utf-8",
                datatype: "json",
                url: url,


                beforeSend: function (XMLHttpRequest) {
                    XMLHttpRequest.setRequestHeader("OData-MaxVersion", "4.0");
                    XMLHttpRequest.setRequestHeader("OData-Version", "4.0");
                    XMLHttpRequest.setRequestHeader("Accept", "application/json");
                    XMLHttpRequest.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
                },
                async: true,
                success: function (data, textStatus, xhr) {
                    var results = data;
                    j = j + 1;
                    for (var i = 0; i < results.value.length; i++) {
                        var event = {};
                        console.log(results.value[i]);
                        if (configs[j].pcx_calendarentityname == "appointment") {
                            event.id = results.value[i]["activityid"];
                        }
                        else {
                            event.id = results.value[i][configs[j].pcx_calendarentityname + "id"];
                        }
                        event.start = results.value[i][configs[j].pcx_startdatefield + "@OData.Community.Display.V1.FormattedValue"];
                        event.end = results.value[i][configs[j].pcx_enddatefield + "@OData.Community.Display.V1.FormattedValue"];
                        event.title = results.value[i][configs[j].pcx_subjectfield];
                        event.tooltip = results.value[i][configs[j].pcx_tooltipfield];
                        event.allDay = false;
                        event.entity = configs[j].pcx_calendarentityname;
                        event.color = configs[j].pcx_hexcolorcode;

                        events.push(event);
                        /*
                        _owningteam_value = results.value[i]["_owningteam_value"];
                        var _owningteam_value_formatted = results.value[i]["_owningteam_value@OData.Community.Display.V1.FormattedValue"];
                        var _owningteam_value_lookuplogicalname = results.value[i]["_owningteam_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
                        var _owninguser_value = results.value[i]["_owninguser_value"];
                        var _owninguser_value_formatted = results.value[i]["_owninguser_value@OData.Community.Display.V1.FormattedValue"];
                        var _owninguser_value_lookuplogicalname = results.value[i]["_owninguser_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
                        var pcx_caseplaneventname = results.value[i]["pcx_caseplaneventname"];
                        var pcx_enddate = results.value[i]["pcx_enddate"];
                        var pcx_location = results.value[i]["pcx_location"];
                        var pcx_startdate = results.value[i]["pcx_startdate"];
                        */
                    }
                    console.log("events:");
                    console.log(events);
                },
                error: function (xhr, textStatus, errorThrown) {
                    window.parent.Xrm.Utility.alertDialog(textStatus + " " + errorThrown + "\n Probably the plural name of the entity does not end with s");
                }
            }));
        }
    }
    Promise.all(promises).then(function () {
        deferred.resolve(events);
        renderCal(events);
    });
}

function renderCal(events) {
    console.log("rendering cal");
    console.log(events)
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,listWeek'
        },
        eventMouseover: function (data, event, view) {
            console.log(data);
            tooltip = '<div class="tooltiptopicevent" style="width:auto;height:auto;background:#feb811;position:absolute;z-index:10001;padding:10px 10px 10px 10px ;  line-height: 200%;">' + 'Description ' + ': ' + data.tooltip + '</br>' + 'Start ' + ': ' + moment(data.start).format("lll") + '</br>' + 'End ' + ': ' + moment(data.end).format("lll") + '</div>';
            $("#calContainer").append(tooltip);
            $(this).mouseover(function (e) {
                $(this).css('z-index', 10000);
                $('.tooltiptopicevent').fadeIn('500');
                $('.tooltiptopicevent').fadeTo('10', 1.9);
            }).mousemove(function (e) {
                $('.tooltiptopicevent').css('top', e.pageY + 10);
                $('.tooltiptopicevent').css('left', e.pageX + 20);
            });


        },
        eventMouseout: function (data, event, view) {
            $(this).css('z-index', 8);

            $('.tooltiptopicevent').remove();

        },
        dayClick: function () {
            tooltip.hide()
        },
        eventResizeStart: function () {
            tooltip.hide()
        },
        eventDragStart: function () {
            tooltip.hide()
        },
        viewDisplay: function () {
            tooltip.hide()
        },
        eventClick: function (calEvent, jsEvent, view) {
            windowOptions = {
                entityName: calEvent.entity,
                entityId: calEvent.id,
                openInNewWindow: true,
                navBar: "off",
                cmdbar: true,
                width: 1000,
                height: 600
            };
            parent.Xrm.Navigation.openForm(windowOptions, null).then(
                function (success) {
                    console.log("success");
                    console.log(success);
                },
                function (error) {
                    console.log("error");
                    console.log(error);
                }
            );

        },
        defaultDate: Date.now(),
        navLinks: true, // can click day/week names to navigate views

        weekNumbers: true,
        weekNumbersWithinDays: true,
        weekNumberCalculation: 'ISO',

        editable: true,
        eventLimit: true, // allow "more" link when too many events
        events: events
    });

}