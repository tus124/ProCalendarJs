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

var users = [];
var businessUnits = [];
var demographicGroups = [];

$(document).ready(function () {
    getBusinessUnits();
    getDemographicGroups();

    buildSelectList('#businessunit-selector', businessUnits);
    buildSelectList('#target-audiences-selector', demographicGroups);

    $("#locale-component").hide();
    $("#businessUnits-component").hide();
    $("#target-audiences-component").hide();

    configGet().done(function (configs) {
        eventsGet(configs);
    });
});

function buildSelectList(selectName, selectList) {
    $.each(selectList, function (index, value) {
        $(selectName).append($('<option/>').attr('value', value).text(value));
    });
}



function getDemographicGroups() {
    var fetchXml = "<fetch><entity name='chco_demographicgroup'><attribute name='chco_name' /><order attribute='chco_name' /></entity></fetch>";
    var url = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.2/chco_demographicgroups?fetchXml=" + fetchXml;
    console.log(url);

    var req = new XMLHttpRequest();
    req.open("GET", url, false);
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.onload = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                var returned = JSON.parse(this.responseText);
                var results = returned.value;

                for (var i = 0; i < results.length; ++i) {
                    demographicGroups.push(results[i]["chco_name"]);
                }
                //console.log(demographicGroups);

                return demographicGroups;
            }
            else {
                console.log(this.statusText);
            }
        }
    }
    req.send();
}


function getDemographicGroupOnEvents(eventId) {
    var eventsDemographicGroups = [];
    var fetchXml = "<fetch><entity name='chco_event'><attribute name='chco_eventid' /><attribute name='chco_eventname' /><attribute name='chco_name' /><filter><condition attribute='chco_eventid' operator='eq' value='" + eventId + "' /></filter><link-entity name='chco_targetaudience' from='chco_eventid' to='chco_eventid' link-type='outer' ><attribute name='chco_eventid' /><link-entity name='chco_demographicgroup' from='chco_demographicgroupid' to='chco_demographicgroupid' link-type='outer' ><attribute name='chco_description' alias='DemographicDescription' /><attribute name='chco_name' alias='DemographicName' /><order attribute='chco_name' /></link-entity></link-entity></entity></fetch>";
    var url = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.2/chco_events?fetchXml=" + fetchXml;
    //console.log(url);

    var req = new XMLHttpRequest();
    req.open("GET", url, false);
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.onload = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                var returned = JSON.parse(this.responseText);
                var results = returned.value;
                for (var i = 0; i < results.length; ++i) {
                    if (results[i]["DemographicName"] != null) {
                        eventsDemographicGroups.push(results[i]["DemographicName"]);
                    }
                }
                return eventsDemographicGroups;
            }
            else {
                console.log(this.statusText);
            }
        }
    }
    req.send();

    return eventsDemographicGroups;
}


function getBusinessUnits() {
    var fetchXml = "<fetch><entity name='systemuser'><attribute name='fullname' /><attribute name='businessunitid' /><filter><condition attribute='isdisabled' operator='eq' value='0' /></filter><link-entity name='businessunit' from='businessunitid' to='businessunitid' link-type='outer'><attribute name='name' /></link-entity></entity></fetch>";
    var url = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.2/systemusers?fetchXml=" + fetchXml;
    //console.log(url);

    var req = new XMLHttpRequest();
    req.open("GET", url, false);
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.onload = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                var returned = JSON.parse(this.responseText);
                var results = returned.value;
                for (var i = 0; i < results.length; ++i) {
                    var user = {};
                    user.name = results[i]["fullname"];
                    user.businessunit = results[i]["businessunit1_x002e_name"];
                    users.push(user);

                    // Only add unique elements, duplicates are skipped.
                    if (businessUnits.indexOf(user.businessunit) === -1)
                        businessUnits.push(user.businessunit);
                }
                //console.log(users);

                return users;
            }
            else {
                console.log(this.statusText);
            }
        }
    }
    req.send();
}

function buildSearchEvents(events) {
    //    $("#search-event-selector").autocomplete({
    //        source: _.pluck(events, 'title')
    //    });

    var allEvents = _.map(events, function (item) {
        return { value: item.url, label: item.title }
    });

    $("#search-event-selector").autocomplete({
        source: allEvents,
        select: function (event, ui) {
            //window.location.href = ui.item.value;            
            window.open(ui.item.value, null, "resizable,scrollbars,status");
            return false;
        }
    });
}


function configGet() {
    //debugger;
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
            //console.log("configs: ");
            //console.log(configs);
            deferred.resolve(configs);
        },
        error: function (xhr, textStatus, errorThrown) {
            window.parent.Xrm.Utility.alertDialog(textStatus + " " + errorThrown);
        }
    });


    return deferred.promise();
}


function eventsGet(configs) {
    var promises = [];
    var events = [];
    var j = -1;
    var deferred = $.Deferred();

    var userName = window.parent.Xrm.Page.context.getUserName();
    var userId = window.parent.Xrm.Page.context.getUserId().replace("{", "").replace("}", "");

    for (var k = 0; k < configs.length; k++) {
        if (configs[k].pcx_showincalendar && window.name == configs[k].pcx_calendarname) {

            var fetchXml = [
                "<fetch>",
                "  <entity name='" + configs[k].pcx_calendarentityname + "'>",
                "    <attribute name='" + configs[k].pcx_partyfield + "' />",
                "    <attribute name='" + configs[k].pcx_subjectfield + "' />",
                "    <attribute name='" + configs[k].pcx_startdatefield + "' />",
                "    <attribute name='" + configs[k].pcx_enddatefield + "' />",
                "    <attribute name='" + configs[k].pcx_tooltipfield + "' />",
                "    <attribute name='chco_eventtypeid' />",
                "    <link-entity name='chco_eventtype' from='chco_eventtypeid' to='chco_eventtypeid' link-type='outer'>",
                "      <attribute name='chco_hexcolor' />",
                "      <attribute name='chco_eventtypeid' />",
                "    </link-entity>",
                "  </entity>",
                "</fetch>",
            ].join("").trim();

            var url = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.2/" + configs[k].pcx_calendarentityname + "s?fetchXml=" + fetchXml;
            //console.log(url);

            promises.push(
                $.ajax({
                    type: "GET",
                    contentType: "application/xml; charset=utf-8",
                    datatype: "xml",
                    url: url,
                    beforeSend: function (XMLHttpRequest) {
                        XMLHttpRequest.setRequestHeader("OData-MaxVersion", "4.0");
                        XMLHttpRequest.setRequestHeader("OData-Version", "4.0");
                        XMLHttpRequest.setRequestHeader("Accept", "application/xml");
                        XMLHttpRequest.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
                    },
                    async: true,
                    success: function (data, textStatus, xhr) {
                        var results = data;
                        j++;
                        for (var i = 0; i < results.value.length; i++) {

                            var event = {};
                            event.id = configs[j].pcx_calendarentityname == "appointment" ? results.value[i]["activityid"] : results.value[i][configs[j].pcx_calendarentityname + "id"];
                            event.start = results.value[i][configs[j].pcx_startdatefield + "@OData.Community.Display.V1.FormattedValue"];
                            event.end = results.value[i][configs[j].pcx_enddatefield + "@OData.Community.Display.V1.FormattedValue"];
                            event.title = results.value[i][configs[j].pcx_subjectfield];
                            event.tooltip = results.value[i][configs[j].pcx_tooltipfield];
                            event.allDay = true;
                            event.entity = configs[j].pcx_calendarentityname;
                            event.color = results.value[i]["chco_eventtype1_x002e_chco_hexcolor"] != null ? results.value[i]["chco_eventtype1_x002e_chco_hexcolor"] : configs[j].pcx_hexcolorcode;
                            event.username = results.value[i]["_ownerid_value@OData.Community.Display.V1.FormattedValue"];
                            event.url = window.parent.Xrm.Page.context.getClientUrl() + "/userdefined/edit.aspx?etc=10005&id=%7b" + results.value[i].chco_eventid + "%7d";
                            event.demographicgroups = getDemographicGroupOnEvents(event.id);

                            events.push(event);
                        }

                        //console.log("events:");
                        //console.log(events);
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
    var initialLocaleCode = 'en';
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'listYear, month,listMonth agendaWeek,agendaDay,listWeek'
        },
        eventMouseover: function (data, event, view) {
            if (view.name == "month") {
                tooltip = '<div class="tooltiptopicevent" style="width:auto;height:auto;background:#feb811;position:absolute;z-index:10001;padding:10px 10px 10px 10px ;  line-height: 200%;">' + 'Description ' + ': ' + data.tooltip + '</br>' + 'Start ' + ': ' + moment(data.start).format("ll") + '</br>' + 'End ' + ': ' + moment(data.end).format("ll") + '</div>';
                $("#calContainer").append(tooltip);
                $(this).mouseover(function (e) {
                    $(this).css('z-index', 10000);
                    $('.tooltiptopicevent').fadeIn('500');
                    $('.tooltiptopicevent').fadeTo('10', 1.9);
                }).mousemove(function (e) {
                    $('.tooltiptopicevent').css('top', e.pageY + 10);
                    $('.tooltiptopicevent').css('left', e.pageX + 20);
                });
            }
        },
        eventMouseout: function (data, event, view) {
            if (view.name == "month") {
                $(this).css('z-index', 8);
                $('.tooltiptopicevent').remove();
            }
        },
        dayClick: function () {
            tooltip.hide();
        },
        eventResizeStart: function () {
            tooltip.hide();
        },
        eventDragStart: function () {
            tooltip.hide();
        },
        viewDisplay: function () {
            tooltip.hide();
        },
        eventClick: function (event) {
            window.open(event.url, null, "resizable,scrollbars,status");
            return false;
        },
        eventRender: function (event, el) {
            // render the timezone offset below the event title
            if (event.start.hasZone()) {
                el.find('.fc-title').after(
                    $('<div class="tzo"/>').text(event.start.format('Z'))
                );
            }
        },
        select: function (startDate, endDate) {
            console.log('select', startDate.format(), endate.format());
        },
        defaultDate: Date.now(),
        navLinks: true, // can click day/week names to navigate views
        locale: initialLocaleCode,
        buttonIcons: true,
        selectable: true,
        weekNumbers: true,
        weekNumbersWithinDays: true,
        //weekNumberCalculation: 'ISO',
        firstDay: 0,
        editable: true,
        eventLimit: true, // allow "more" link when too many events
        events: events
    });

    buildSearchEvents(events);

    $('#businessunit-selector').fSelect();
    $('#target-audiences-selector').fSelect();


    if ($('#calendartype-selector').val() == "User") {
        var userName = window.parent.Xrm.Page.context.getUserName();
        $("#username-display").text(userName);
    }

    // build the locale selector's options
    $.each($.fullCalendar.locales, function (localeCode) {
        $('#locale-selector').append(
            $('<option/>')
                .attr('value', localeCode)
                .prop('selected', localeCode == initialLocaleCode)
                .text(localeCode));
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

    $('#calendartype-selector').on('change', function () {
        var calendarType = this.value;
        var userName = window.parent.Xrm.Page.context.getUserName();

        $('#calendar').fullCalendar('removeEventSources');
        $("#businessUnits-component").hide();
        $("#username-display").text("");
        $("#target-audiences-component").hide();

        if (calendarType == "Master") {
            $('#calendar').fullCalendar('addEventSource', events);
            $("#username-display").text("All Users");

            buildSearchEvents(events);
        }
        else if (calendarType == "Components") {
            $("#businessUnits-component").show();
        }
        else if (calendarType == "Target-Audiences") {
            $("#target-audiences-component").show();
        }
        else { //if calendarType == "User"
            var filterEventsByUser = events.filter(function (event) {
                if (event.username == userName) {
                    return event;
                }
            });

            $('#calendar').fullCalendar('addEventSource', filterEventsByUser);
            $("#username-display").text(userName);

            buildSearchEvents(filterEventsByUser);
        }
    });


    $('#businessunit-selector').on('change', function () {
        var selectedBusinessUnit = $('#businessunit-selector').val();
        var filterUsers = users.filter(function (user) {
            if (selectedBusinessUnit.includes(user.businessunit)) {
                return user;
            }
        });

        var subsetNames = _.pluck(filterUsers, 'name');
        var filterEventsByBusinessUnits = events.filter(function (event) {
            if (subsetNames.includes(event.username))
                return event;
        });

        $('#calendar').fullCalendar('removeEventSources');
        $('#calendar').fullCalendar('addEventSource', filterEventsByBusinessUnits);

        buildSearchEvents(filterEventsByBusinessUnits);
    });

    $('#target-audiences-selector').on('change', function () {
        var selectedTargetAudiences = $('#target-audiences-selector').val();
        var filterEventsByDemographicsGroups = events.filter(function (event) {
            var demoGroup = event.demographicgroups;
            for (var i = 0; i < demoGroup.length; i++) {
                if (selectedTargetAudiences.includes(demoGroup[i])) {
                    return event;
                }
            }
        });

        $('#calendar').fullCalendar('removeEventSources');
        $('#calendar').fullCalendar('addEventSource', filterEventsByDemographicsGroups);

        buildSearchEvents(filterEventsByDemographicsGroups);
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