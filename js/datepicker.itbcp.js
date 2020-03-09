// Configurables
var _myProjects = getJSONFromDBFake();

// Default configuration 4169e1
var _defaultConfig = {
    "ThemeBackColor": "#4169e1",
    "ThemeForeColor": "#fff",

    /* Texts */
    "NoEventsForSelectedDay": "No hay eventos disponibles para esta fecha.",
    "NoSelectedDate": "No ha seleccionado ninguna fecha."
}

/**********************************************************
 ****************    BEGIN  - Configuration   *************
 *********************************************************/

/* Estáticos */
var _dtp = '#datepicker';

$(_dtp).datepick({
    firstDay: 1,
    monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"],
    monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Dic"],
    dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    dayNamesShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sáb"],
    dayNamesMin: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sáb"],
    prevText: "",
    nextText: "",
    todayText: "Hoy",
    prevStatus: "",
    nextStatus: "",
    todayStatus: "",
    monthStatus: "",
    yearStatus: "",
    currentStatus: "",
    dayStatus: "",
    multiSelect: 999,
    // changeMonth: false,
    // onShow: $.datepick.monthNavigation,
    onChangeMonthYear: function(year, month) {
        $('div.c-events').empty();
        CreateNoSelectedDateHTML();
    },
    dateFormat: "dd/MM/yyyy",
    onSelect: function(dates) {
        ConfigDatePicker(_myProjects);
    }
});

function GetRangeDates(_startDate, _endDate) {

    var sd = _startDate.split("/");
    var ed = _endDate.split("/");

    var startDate = new Date(sd[2], sd[1] - 1, sd[0]);
    var endDate = new Date(ed[2], ed[1] - 1, ed[0]);

    var range = [];
    while (startDate <= endDate) {
        range.push(new Date(startDate));
        startDate.setDate(startDate.getDate() + 1);
    }
    return range;
}

function GetAllDatesByProjects(Projects) {
    if (Projects == undefined || Projects == null) {
        console.log('GetAllDatesByProjects(Projects) | Projects is undefined or null.');
        console.log('Projects : ' + Projects);
        return;
    }

    var allDates = [];

    $.each(Projects, function(iproj, proj) {

        var range = GetRangeDates(proj.Project.StartDate, proj.Project.EndDate)

        for (var i = 0; i < range.length; i++) {
            allDates.push(range[i]);
        }
    });
    $(_dtp).datepick('setDate', allDates);
}

/* Calling */
GetAllDatesByProjects(_myProjects);

function HexToRgbA(hex, opacity) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ', ' + opacity + ')';
    }
    throw new Error('Bad Hex');
}

function ConfigDatePicker(Projects) {
    if (Projects == undefined || Projects == null) {
        console.log('ConfigDatePicker(Projects) | Projects is undefined or null.');
        console.log('Projects : ' + Projects);
        return;
    }

    var _theme, _color, _title, _details;

    CustomSnakeDays(_myProjects);

    var $dtp = $(document).find(_dtp);

    $.each(Projects, function(iproj, proj) {

        _theme = proj.Project.Color;

        var range = GetRangeDates(proj.Project.StartDate, proj.Project.EndDate);

        for (var i = 0; i < range.length; i++) {
            var date = range[i];
            date.setHours(12, 0, 0);
            var ts = date.getTime();

            $dtp.find('tbody tr td a.dp' + ts).css('background-color', _theme);

            $dtp.find('tbody span.side-a-last.dp' + ts).css('background-color', HexToRgbA(_theme, '.15'));
            $dtp.find('tbody span.side-a-first.dp' + ts).css('background-color', HexToRgbA(_theme, '.15'));
            $dtp.find('tbody span.side-a.dp' + ts).css('background-color', HexToRgbA(_theme, '.15'));
        }
    });

    $('a.datepick-cmd-today').css({
        'background-color': _defaultConfig.ThemeBackColor,
        'color': _defaultConfig.ThemeForeColor
    });

    $('div.c-date-selected').css({
        'background-color': _defaultConfig.ThemeBackColor,
        'color': _defaultConfig.ThemeForeColor
    });

    CreateNoSelectedDateHTML();

    $('div.no-select-date p').css('color', _defaultConfig.ThemeBackColor);
    $('div.no-events p').css('color', _defaultConfig.ThemeBackColor);

    $('div.datepick-month-header').css('color', _defaultConfig.ThemeBackColor);

    $('.datepick-month-year').css('color', _defaultConfig.ThemeBackColor);
}

$(document).on('click', _dtp, function(e) {
    e.preventDefault();
    ChangeSizeDay();
    ConfigDatePicker(_myProjects);
});

function CustomSnakeDays(Projects) {
    if (Projects == undefined || Projects == null) {
        console.log('customSnakeDays(Projects) | Projects is undefined or null.');
        console.log('Projects : ' + Projects);
        return;
    }

    var $dtp = $(document).find(_dtp);
    var $rows = $dtp.find('tbody tr');

    $rows.each(function(indexRow, itemRow) {
        var $row = $(itemRow);
        var $tds = $row.find('td');

        $tds.each(function(indexTd, itemTd) {

            /* 0 to 6 */
            var $currentIndex = indexTd;
            var $prevIndex = indexTd - 1;
            var $nextIndex = indexTd + 1;

            /* Add ul's a todos los días (excepto si es de otro mes) */
            var hasA = $row.find('td').eq($currentIndex).find('a').length;

            if (hasA != 0) {
                var ts = GetTimeFromElementA($row.find('td').eq($currentIndex).find('a'));
                var $ulHTML = '<ul class="dp' + ts + '"></ul>';
                $row.find('td').eq($currentIndex).find('ul').remove();
                $row.find('td').eq($currentIndex).append($ulHTML);
            }

            var colorEvent;

            //Projects foreach
            $.each(Projects, function(iproj, proj) {
                colorEvent = proj.Project.Color;

                //Events foreach
                $.each(proj.Project.Event, function(ievent, event) {
                    var currentTD = $row.find('td').eq(indexTd);

                    var dateStartEvent = event.StartDate;
                    var dateEndEvent = event.EndDate;

                    //Si el evento tiene fecha ini && fecha fin
                    if (dateStartEvent != null &&
                        dateEndEvent != null) {

                        var range = GetRangeDates(dateStartEvent, dateEndEvent);

                        for (var i = 0; i < range.length; i++) {

                            var onlyDate = range[i];
                            onlyDate.setHours(12, 0, 0);
                            var ts = onlyDate.getTime();

                            var hasA = $row.find('td').eq($currentIndex).find('a').length;

                            if (hasA != 0) {

                                //Validate only 3 points
                                var ulLength = $row.find('td').eq($currentIndex).find('ul.dp' + ts + ' li').length;

                                if (ulLength < 3) {
                                    var $liHTML = "<li class='dp" + ts + "' style='background-color: " + event.Color + "'></li>";
                                    $row.find('td').eq($currentIndex).find('ul.dp' + ts).append($liHTML);
                                }

                                if (ulLength > 2) {

                                    var hasMoreLength = $row.find('td').eq($currentIndex).find('a').find('span.hasMoreEvents').length;

                                    if (hasMoreLength == 0) {
                                        var hasMoreEventHTML = "<span class='hasMoreEvents'></span>";
                                        $row.find('td').eq($currentIndex).find('a').append(hasMoreEventHTML);
                                    }
                                }
                            }
                        }
                    }
                });
            });

            if (!DayIsSelected($row, $prevIndex) &&
                !DayIsSelected($row, $nextIndex)) {
                return;
            }

            //Prev td
            if ($prevIndex >= 0) {

                //Has prev and next item
                if (DayIsSelected($row, $prevIndex) &&
                    DayIsSelected($row, $nextIndex)) {
                    $row.find('td').eq($currentIndex).removeClass().addClass('isSnake');

                    /* Add sides */
                    var ts = GetTimeFromElementA($row.find('td').eq($currentIndex).find('a'));
                    var side = "<span class='side-a dp" + ts + "'></span>";

                    $row.find('td').eq($currentIndex).find('span.side-a.dp' + ts).remove();
                    $row.find('td').eq($currentIndex).append(side);
                }


                if (!DayIsSelected($row, $nextIndex)) {
                    $row.find('td').eq($currentIndex).removeClass().addClass('isSnake-last');

                    if ($row.find('td').eq($currentIndex).has('a.datepick-selected').length > 0) {
                        /* Add sides */
                        var ts = GetTimeFromElementA($row.find('td').eq($currentIndex).find('a'));
                        var side = "<span class='side-a-last dp" + ts + "'></span>";

                        $row.find('td').eq($currentIndex).find('span.side-a-last.dp' + ts).remove();
                        $row.find('td').eq($currentIndex).append(side);
                    }
                }

                if (!DayIsSelected($row, $prevIndex)) {
                    $row.find('td').eq($currentIndex).removeClass().addClass('isSnake-first');

                    if ($row.find('td').eq($currentIndex).has('a.datepick-selected').length > 0) {
                        /* Add sides */
                        var ts = GetTimeFromElementA($row.find('td').eq($currentIndex).find('a'));
                        var side = "<span class='side-a-first dp" + ts + "'></span>";

                        $row.find('td').eq($currentIndex).find('span.side-a-first.dp' + ts).remove();
                        $row.find('td').eq($currentIndex).append(side);
                    }
                }
            } else {
                /* current = 0, prev = -1 */
                if (DayIsSelected($row, $nextIndex)) {
                    $row.find('td').eq($currentIndex).removeClass().addClass('isSnake-first');

                    if ($row.find('td').eq($currentIndex).has('a.datepick-selected').length > 0) {
                        /* Add sides */
                        var ts = GetTimeFromElementA($row.find('td').eq($currentIndex).find('a.datepick-selected'));
                        var side = "<span class='side-a-first dp" + ts + "'></span>";

                        $row.find('td').eq($currentIndex).find('span.side-a-first.dp' + ts).remove();
                        $row.find('td').eq($currentIndex).append(side);
                    }
                }
            }
        });
    });
}

function DayIsSelected($row, $colIndex) {
    return $row.find('td').eq($colIndex).find('a').hasClass('datepick-selected');
}

function ChangeSizeDay() {
    var w = $(_dtp).find('table thead tr:first th:first').width();
    $(_dtp).find('table tbody tr td').css('height', w + 'px');
}

$(window).on('resize', function() { ChangeSizeDay(); });
ChangeSizeDay();

$(_dtp).on('click', 'tbody td a', function(e) {
    e.preventDefault();

    var tsClass = $(this).prop('class').split(' ')[0];

    if (tsClass.indexOf('dp') == -1) {
        console.log("tbody td a.datepick-selected | event:click() | No se encontró la clase dp##########");
        return;
    }

    var ts = parseInt(tsClass.substring(2));
    var date = new Date(ts);

    $(_dtp + ' table tbody a').not(this).each(function(i, item) {
        $(item).removeClass('current-date-select');
    });

    $(this).toggleClass('current-date-select');

    CreateEventsInnerHTML();

    $('div.c-date-selected').find('p').html(GetDateInTextFormatPE(date));
    ShowListEventsByDaySelected(date);

    ClearEvents();

    CreateNoSelectedDateHTML();
});

function ShowListEventsByDaySelected(date) {

    $.each(_myProjects, function(iproj, proj) {

        $.each(proj.Project.Event, function(ievent, event) {

            var dateStartEvent = event.StartDate;
            var dateEndEvent = event.EndDate;

            if (dateStartEvent != null &&
                dateEndEvent != null) {

                var range = GetRangeDates(dateStartEvent, dateEndEvent);

                for (var i = 0; i < range.length; i++) {

                    if (TransformDateToDDMMYYY(date) == TransformDateToDDMMYYY(range[i])) {
                        var eventHTML = "<div class='event' style='background-color: " + event.Color + "'>" +
                            "<span class='event-title'>" + event.Title + "</span>" +
                            " <p class='event-details'>" + event.Details + "</p>" +
                            "</div>";

                        $('div.c-events-inner').append(eventHTML);
                    }
                }
            }
        });
    });

    var hasnotEvents = $('div.c-events-inner').find('div.event').length;

    if (hasnotEvents == 0) {
        var noEventsLength = $('div.c-events-inner').find('div.no-events').length;
        if (noEventsLength == 0) {
            var hasnotEventsHTML = "<div class='no-events'><p>" + _defaultConfig.NoEventsForSelectedDay + "</p></div>";
            $('div.c-events-inner').append(hasnotEventsHTML);
        }
    }
}

function CreateEventsInnerHTML() {
    var inner = $('div.c-events').find('.c-events-inner').length;

    if (inner != 0) {
        $('div.c-events').empty();
    }

    var titleSelectedDateHTML = "<div class='c-date-selected'><p></p></div>";
    $('div.c-events').append(titleSelectedDateHTML);

    var eventsInnerHTML = "<div class='c-events-inner'></div>";
    $('div.c-events').append(eventsInnerHTML);
}

function GetDateInTextFormatPE(myDate) {

    var dayName = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    var monthName = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    var dateString = dayName[myDate.getDay()] + ', ' +
        (myDate.getDate() < 10 ? "0" + myDate.getDate() : myDate.getDate()) + ' de ' +
        monthName[myDate.getMonth()] + ' de ' + myDate.getFullYear();

    return dateString;
}

function GetTimeFromElementA(ElementA) {
    var tsClass = $(ElementA).prop('class').split(' ')[0];
    if (tsClass.indexOf('dp') == -1) {
        console.log("GetTimeFromElementA(ElementA) | No se econtró la clase [dp###################]");
        return null;
    }
    return tsClass.substring(2);
}

function TransformDateToDDMMYYY(date) {
    if (date != undefined && date != null) {
        var DateDDMMYYYY = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "/" +
            ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "/" +
            date.getFullYear();
        return DateDDMMYYYY;
    }
}

function ClearEvents() {
    var dateSelected = $(_dtp).find('a.current-date-select').length;

    if (dateSelected == 0) {
        $('div.c-events').empty();
    }
}

function CreateNoSelectedDateHTML() {
    var selectedDateHTML = "<div class='no-select-date'><p>" + _defaultConfig.NoSelectedDate + "</p></div>";
    var selectedCurrentDateLength = $(_dtp).find('a.current-date-select').length;
    var selectedDateLength = $('div.c-events').find('.no-select-date').length;

    if (selectedCurrentDateLength == 0) {
        if (selectedDateLength == 0) {
            $('div.c-events').append(selectedDateHTML);
        }
    } else {
        if (selectedDateLength != 0) {
            $('div.c-events').find('.no-select-date').remove();
        }
    }
}

// $('div.datepick-month-nav div a').on('mouseover', function() {
//     $(this).css({
//         'background-color': _defaultConfig.ThemeBackColor,
//         'color': _defaultConfig.ThemeForeColor
//     });
// }).on('mouseout', function() {
//     $(this).css({
//         'background-color': 'rgb(240, 240, 240)',
//         'color': _defaultConfig.ThemeBackColor
//     });
// });


setInterval(function() { $(_dtp).trigger('click'); }, 100);