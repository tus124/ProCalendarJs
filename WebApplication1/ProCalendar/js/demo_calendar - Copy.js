
var date;
var firstDay;
var lastDay;

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
    var initialLocaleCode = 'en';
    var allEvents = [];

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
            left: 'prev,next today',
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
});