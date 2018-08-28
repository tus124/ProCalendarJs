
var date;
var firstDay;
var lastDay;
var initialLocaleCode = 'en';

var america_timezones = [
    'America/Adak',
    'America/Anchorage',
    'America/Boise',
    'America/Chicago',
    'America/Denver',
    'America/Detroit',
    'America/Indiana/Indianapolis',
    'America/Indiana/Knox',
    'America/Indiana/Marengo',
    'America/Indiana/Petersburg',
    'America/Indiana/Tell_City',
    'America/Indiana/Vevay',
    'America/Indiana/Vincennes',
    'America/Indiana/Winamac',
    'America/Juneau',
    'America/Kentucky/Louisville',
    'America/Kentucky/Monticello',
    'America/Los_Angeles',
    'America/Menominee',
    'America/Metlakatla',
    'America/New_York',
    'America/Nome',
    'America/North_Dakota/Beulah',
    'America/North_Dakota/Center',
    'America/North_Dakota/New_Salem',
    'America/Phoenix',
    'America/Sitka',
    'America/Yakutat',
    'Pacific/Honolulu',
];


$(document).ready(function () {
    date = new Date();
    firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
    lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString();
 
    testCalendarDemo();
});


function testCalendarDemo() {
    var promises = [];
    var allEvents = [];
    var deferred = $.Deferred();
    

    for (var i = 0; i < 1000; i++) {
        var event = {};

        var randomMonth = Math.floor(Math.random() * 12);
        var randomDay = Math.floor(Math.random() * 30);
        var randomDayIncrement = Math.floor(Math.random() * 10);
        var randomHour = Math.floor(Math.random() * 24);

        event.id = i;
        event.start = new Date(2018, randomMonth, randomDay, randomHour);
        event.end = new Date(2018, randomMonth, randomDay, randomHour + 2);
        event.title = "Meeting " + i.toString();
        event.tooltip = "";
        event.allDay = false;

        allEvents.push(event);
    }


    $('#calendar').fullCalendar({
        header: {
            left: 'prevYear prev,next nextYear today',
            center: 'title',
            right: 'listYear, month,listMonth, agendaWeek,agendaDay,listWeek'
        },
        defaultDate: new Date(),    // Today's Date
        defaultView: 'month',
        locale: initialLocaleCode,
        buttonIcons: true, // show the prev/next text
        navLinks: true,
        weekNumbers: true,
        weekNumbersWithinDays: true,
        selectable: true,
        businessHours: false,
        editable: true,
        eventLimit: true, // allow "more" link when too many events
        events: allEvents,
        dayClick: function (date) {
            console.log('dayClick', date.format());
        },
        select: function (startDate, endDate) {
            console.log('select', startDate.format(), endDate.format());
        }
    });

    // build the locale selector's options
    $.each($.fullCalendar.locales, function (localeCode) {
        $('#locale-selector').append(
            $('<option/>')
                .attr('value', localeCode)
                .prop('selected', localeCode == initialLocaleCode)
                .text(localeCode)
        );
    });
    
    // when the selected option changes, dynamically change the calendar option
    $('#locale-selector').on('change', function () {
        if (this.value) {
            $('#calendar').fullCalendar('option', 'locale', this.value);
        }
    });

    // when the timezone selector changes, dynamically change the calendar option
    $('#timezone-selector').on('change', function () {
        $('#calendar').fullCalendar('option', 'timezone', this.value || false);
    });

    // when the timezone selector changes, dynamically change the calendar option
    $('#filter-selector').on('change', function () {
       // debugger;
        var filterType = this.value;
        console.log(filterType);

        var usersFilterEvents = [];
       
        for (var i = 0; i < 5; i++) {
            var event = {};

            var randomMonth = Math.floor(Math.random() * 12);
            var randomDay = Math.floor(Math.random() * 31);
            var randomDayIncrement = Math.floor(Math.random() * 10);
            var randomHour = Math.floor(Math.random() * 12);

            event.id = i;
            event.start = new Date(2018, 09, randomDay, randomHour);
            event.end = new Date(2018, 09, randomDay, randomHour + 2);
            event.title = "Meeting " + i.toString();
            event.tooltip = "";
            event.allDay = false;

            usersFilterEvents.push(event);
        }


        $('#calendar').fullCalendar('removeEventSources');
        console.log('all events are removed');

        if (filterType == "user") {
            $('#calendar').fullCalendar('addEventSource', usersFilterEvents);
            console.log('user events are added');
        }
        if (filterType == "all") {
            $('#calendar').fullCalendar('addEventSource', allEvents);
            console.log('all events are added');
        }

    });

    console.log('allEventsCount...' + allEvents.length);
    var allEventsNames = _.pluck(allEvents, 'title');
    console.log('allEventsNamesCount...' + allEventsNames.length);


    $("#search-event-selector").autocomplete({
        source: allEventsNames
    });
}


// https://tc39.github.io/ecma262/#sec-array.prototype.includes
if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
        value: function (searchElement, fromIndex) {

            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            // 1. Let O be ? ToObject(this value).
            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If len is 0, return false.
            if (len === 0) {
                return false;
            }

            // 4. Let n be ? ToInteger(fromIndex).
            //    (If fromIndex is undefined, this step produces the value 0.)
            var n = fromIndex | 0;

            // 5. If n ≥ 0, then
            //  a. Let k be n.
            // 6. Else n < 0,
            //  a. Let k be len + n.
            //  b. If k < 0, let k be 0.
            var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

            function sameValueZero(x, y) {
                return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
            }

            // 7. Repeat, while k < len
            while (k < len) {
                // a. Let elementK be the result of ? Get(O, ! ToString(k)).
                // b. If SameValueZero(searchElement, elementK) is true, return true.
                if (sameValueZero(o[k], searchElement)) {
                    return true;
                }
                // c. Increase k by 1. 
                k++;
            }

            // 8. Return false
            return false;
        }
    });
}





//function initialize() {
//    var clientUrl = window.parent.Xrm.Page.context.getClientUrl();
//    var deferred = $.Deferred();
//    $.ajax({
//        type: "GET",
//        contentType: "application/json; charset=utf-8",
//        datatype: "json",
//        url: clientUrl + "/api/data/v8.2/pcx_calendarentities?$select=pcx_calendarentityid,pcx_calendarentityname,pcx_enddatefield,pcx_hexcolorcode,pcx_calendarname,pcx_locationfield,pcx_partyfield,pcx_showincalendar,pcx_showteamcalendar,pcx_startdatefield,pcx_subjectfield,pcx_tooltipfield",
//        async: true,
//        beforeSend: function (XMLHttpRequest) {
//            XMLHttpRequest.setRequestHeader("OData-MaxVersion", "4.0");
//            XMLHttpRequest.setRequestHeader("OData-Version", "4.0");
//            XMLHttpRequest.setRequestHeader("Accept", "application/json");
//            XMLHttpRequest.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
//        },
//        success: function (data, textStatus, xhr) {
//            var results = data;
//            var configs = [];

//            for (var i = 0; i < results.value.length; i++) {
//                var config = {};
//                config.pcx_calendarentityid = results.value[i]["pcx_calendarentityid"];
//                config.pcx_calendarentityname = results.value[i]["pcx_calendarentityname"];
//                config.pcx_enddatefield = results.value[i]["pcx_enddatefield"];
//                config.pcx_hexcolorcode = results.value[i]["pcx_hexcolorcode"];
//                config.pcx_calendarname = results.value[i]["pcx_calendarname"];
//                config.pcx_locationfield = results.value[i]["pcx_locationfield"];
//                config.pcx_partyfield = results.value[i]["pcx_partyfield"];
//                config.pcx_showincalendar = results.value[i]["pcx_showincalendar"];
//                config.pcx_showincalendar_formatted = results.value[i]["pcx_showincalendar@OData.Community.Display.V1.FormattedValue"];
//                config.pcx_showteamcalendar = results.value[i]["pcx_showteamcalendar"];
//                config.pcx_showteamcalendar_formatted = results.value[i]["pcx_showteamcalendar@OData.Community.Display.V1.FormattedValue"];
//                config.pcx_startdatefield = results.value[i]["pcx_startdatefield"];
//                config.pcx_subjectfield = results.value[i]["pcx_subjectfield"];
//                config.pcx_tooltipfield = results.value[i]["pcx_tooltipfield"];
//                configs.push(config);
//            }
//            deferred.resolve(configs);
//        },
//        error: function (xhr, textStatus, errorThrown) {
//            window.parent.Xrm.Utility.alertDialog(textStatus + " " + errorThrown);
//        }
//    });
//    return deferred.promise();
//}

//function buildUrl(config) {
//    var clientUrl = window.parent.Xrm.Page.context.getClientUrl();
//    var userName = window.parent.Xrm.Page.context.getUserName();
//    var userId = window.parent.Xrm.Page.context.getUserId().replace("{", "").replace("}", "");

//    var url = clientUrl + "/api/data/v8.2/" +
//        config.pcx_calendarentityname + "s?$select=" + "_" +
//        //_ownerid_value
//        config.pcx_partyfield + "_value," +
//        //pcx_caseplaneventname
//        config.pcx_subjectfield + "," +
//        //pcx_startdate
//        config.pcx_startdatefield + "," +
//        //pcx_enddate
//        config.pcx_enddatefield + "," +
//        //pcx_description
//        config.pcx_tooltipfield;

//    if (config.pcx_calendarentityname == "appointment") {
//        //url = url + '&$filter= ' + arr[k].pcx_startdatefield + ' ge ' + firstDay + ' and ' + arr[k].pcx_enddatefield + ' le ' + lastDay + ' and contains(pcx_attendies,\'' + window.parent.Xrm.Page.context.getUserName() + '\')';
//        url = url + '&$filter= ' + ' contains(pcx_attendies,\'' + userName + '\')';
//    }
//    else {
//        //url = url + '&$filter= ' + arr[k].pcx_startdatefield + ' ge ' + firstDay + ' and ' + arr[k].pcx_enddatefield + ' le ' + lastDay + ' and _' + arr[k].pcx_partyfield + '_value eq ' + window.parent.Xrm.Page.context.getUserId().replace("{", "").replace("}", "");
//        url = url + '&$filter= ' + '_' + config.pcx_partyfield + '_value eq ' + userId;
//    }

//    return url;
//}


//function crmGet(configs) {
//    console.log("arr:");
//    console.log(configs);
//    var promises = [];
//    var events = [];
//    var j = 0; // var j = -1;
//    var deferred = $.Deferred();
//    var clientUrl = window.parent.Xrm.Page.context.getClientUrl();

//    for (var k = 0; k < configs.length; k++) {
//        if (configs[k].pcx_showincalendar && window.name == configs[k].pcx_calendarname) {
//            var url = buildUrl(configs[k]);

//            console.log(url);

//            promises.push($.ajax({
//                type: "GET",
//                contentType: "application/json; charset=utf-8",
//                datatype: "json",
//                url: url,
//                async: true,
//                beforeSend: function (XMLHttpRequest) {
//                    XMLHttpRequest.setRequestHeader("OData-MaxVersion", "4.0");
//                    XMLHttpRequest.setRequestHeader("OData-Version", "4.0");
//                    XMLHttpRequest.setRequestHeader("Accept", "application/json");
//                    XMLHttpRequest.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
//                },
//                success: function (data, textStatus, xhr) {
//                    var results = data;
//                    j++;    // j = j + 1;
//                    for (var i = 0; i < results.value.length; i++) {
//                        var event = {};

//                        //console.log("results.value[" + i + "]:");
//                        //console.log(results.value[i]);

//                        if (configs[j].pcx_calendarentityname == "appointment") {
//                            //console.log(results.value[i]["activityid"]);

//                            event.id = results.value[i]["activityid"];
//                        }
//                        else {
//                            event.id = results.value[i][configs[j].pcx_calendarentityname + "id"];
//                        }
//                        event.start = results.value[i][configs[j].pcx_startdatefield + "@OData.Community.Display.V1.FormattedValue"];
//                        event.end = results.value[i][configs[j].pcx_enddatefield + "@OData.Community.Display.V1.FormattedValue"];
//                        event.title = results.value[i][configs[j].pcx_subjectfield];
//                        event.tooltip = results.value[i][configs[j].pcx_tooltipfield];
//                        event.allDay = true;
//                        event.entity = configs[j].pcx_calendarentityname;
//                        event.color = configs[j].pcx_hexcolorcode;
//                        event.url = clientUrl + "/userdefined/edit.aspx?etc=10005&id=%7b" + results.value[i].chco_eventid + "%7d";;

//                        events.push(event);

//                    }
//                    //console.log("events:");
//                    //console.log(events);
//                },
//                error: function (xhr, textStatus, errorThrown) {
//                    window.parent.Xrm.Utility.alertDialog(textStatus + " " + errorThrown + "\n Probably the plural name of the entity does not end with s");
//                }
//            }));
//        }
//    }
//    Promise.all(promises).then(function () {
//        deferred.resolve(events);
//        renderCal(events);
//    });
//}


//function renderCal(events) {
//    console.log("rendering cal");
//    console.log(events)
//    $('#calendar').fullCalendar({
//        header: {
//            left: 'prev,next today',
//            center: 'title',
//            right: 'listYear, month,listMonth agendaWeek,agendaDay,listWeek'
//        },
//        eventMouseover: function (data, event, view) {
//            console.log(data);
//            tooltip = '<div class="tooltiptopicevent" style="width:auto;height:auto;background:#feb811;position:absolute;z-index:10001;padding:10px 10px 10px 10px ;  line-height: 200%;">' + 'Description ' + ': ' + data.tooltip + '</br>' + 'Start ' + ': ' + moment(data.start).format("lll") + '</br>' + 'End ' + ': ' + moment(data.end).format("lll") + '</div>';
//            $("#calContainer").append(tooltip);
//            $(this).mouseover(function (e) {
//                $(this).css('z-index', 10000);
//                $('.tooltiptopicevent').fadeIn('500');
//                $('.tooltiptopicevent').fadeTo('10', 1.9);
//            }).mousemove(function (e) {
//                $('.tooltiptopicevent').css('top', e.pageY + 10);
//                $('.tooltiptopicevent').css('left', e.pageX + 20);
//            });
//        },
//        eventMouseout: function (data, event, view) {
//            $(this).css('z-index', 8);

//            $('.tooltiptopicevent').remove();

//        },
//        dayClick: function () {
//            tooltip.hide()
//        },
//        eventResizeStart: function () {
//            tooltip.hide()
//        },
//        eventDragStart: function () {
//            tooltip.hide()
//        },
//        viewDisplay: function () {
//            tooltip.hide()
//        },
//        eventClick: function (event) {
//            window.open(event.url, null, "resizable,scrollbars,status");
//            return false;
//        },
//        defaultDate: Date.now(),
//        navLinks: true, // can click day/week names to navigate views

//        weekNumbers: true,
//        weekNumbersWithinDays: true,
//        weekNumberCalculation: 'ISO',

//        editable: true,
//        eventLimit: true, // allow "more" link when too many events
//        events: events
//    });
//}