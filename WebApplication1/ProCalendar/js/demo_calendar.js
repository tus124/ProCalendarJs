﻿var america_timezones = [
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

    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'listYear, month,listMonth,  agendaWeek,agendaDay,listWeek'
        },
        defaultDate: new Date(),    // Today's Date
        locale: initialLocaleCode,
        buttonIcons: true, // show the prev/next text
        navLinks: true,
        weekNumbers: true,
        weekNumbersWithinDays: true,
        weekNumberCalculation: 'ISO',
        selectable: true,
        businessHours: false,
        editable: true,
        eventLimit: true, // allow "more" link when too many events
        events: [
            {
                id: 101,
                title: 'Test1',
                start: '2018-08-01', // new Date(),
                end: '2018-08-01',   // new Date(),
                url: 'http://www.google.com',
                overlap: true,
                //color: 'red',
                constraint: 'businessHours'
            },
            {
                id: 102,
                title: 'Test2',
                start: '2018-08-01', // new Date(),
                end: '2018-08-01',   // new Date(),
                url: 'http://www.bing.com',
                overlap: true,
                color: 'blue',
                constraint: 'businessHours'

            },
            {
                title: 'Conference',
                start: '2018-08-01',
                end: '2018-08-03'
            },
            {
                title: 'Meeting',
                start: '2018-08-20',
                end: '2018-08-24',
                constraint: 'availableForMeeting', // defined below
                color: '#257e4a'
            },
            {
                id: 'availableForMeeting',
                //title: 'Available',
                start: '2018-08-20T10:00:00',
                end: '2018-08-20T16:00:00',
                //overlap: false,
                rendering: 'background',
                color: '#ff9f89'

            },
            {
                start: '2018-08-24',
                end: '2018-08-28',
                overlap: false,
                rendering: 'background',
                color: '#ff9f89'
            },
            {
                start: '2018-08-06',
                end: '2018-08-08',
                overlap: false,
                rendering: 'background',
                color: '#ff9f89'
            }
        ],
        loading: function (bool) {
            $('#loading').toggle(bool);
        },
        eventRender: function (event, el) {
            // render the timezone offset below the event title
            if (event.start.hasZone()) {
                el.find('.fc-title').after(
                    $('<div class="tzo"/>').text(event.start.format('Z'))
                );
            }
        },
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


    $.each(america_timezones, function (i, timezone) {
        $('#timezone-selector').append(
            $('<option/>').attr('value', timezone).text(timezone)
        );
    })


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
});