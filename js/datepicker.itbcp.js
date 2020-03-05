/* Configurables */
var _myObject = getJSONFromDBFake();

/* Estáticos */
var _dtp = '#datepicker';
var _daysSelected = [];

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

    dateFormat: "dd/MM/yyyy",
    onSelect: function (dates) {
        configDatePicker(_myObject);
    }
});

/**********************************************************
 ****************    BEGIN  - Configuration   *************/

var sd = _myObject.Project.StartDate.split("/");
var ed = _myObject.Project.EndDate.split("/");

var startDate = new Date(sd[2], sd[1] - 1, sd[0]);
var endDate = new Date(ed[2], ed[1] - 1, ed[0]);

$(_dtp).datepick('setDate', getRangeDates(startDate, endDate));

function getRangeDates(startDate, endDate) {
    var range = [];
    while (startDate <= endDate) {
        range.push(new Date(startDate));
        startDate.setDate(startDate.getDate() + 1);
    }

    /* Add more dates */
    // range.push(new Date(2020, 3, 22),
    //     new Date(2020, 3, 23),
    //     new Date(2020, 3, 24),
    //     new Date(2020, 3, 25));
    return range;
}

function hexToRgbA(hex, opacity) {
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

/* Method */
function configDatePicker(config) {
    if (config == null || config == undefined) {
        console.log('El objeto es nulo o no ha sido definido');
        return;
    }

    var _theme, _color, _title, _details;

    if (config.Project != undefined) {
        _theme = config.Project.Color == undefined ? "#417AFF" : config.Project.Color;

        if (config.Project.Event != undefined) {

            switch (config.Project.Event.length) {
                case 0: {
                    console.log('No hay eventos :(')
                    break;
                }
                case 1: {
                    _color = config.Project.Event[0].Color;
                    break;
                }
                case 2: {
                    _color = config.Project.Event[0].Color;
                    _title = config.Project.Event[1].Color;
                    break;
                }
                default: {
                    _color = config.Project.Event[0].Color;
                    _title = config.Project.Event[1].Color;
                    _details = config.Project.Event[2].Color;
                    break;
                }
            }
        }
    }
    else {
        _theme = '#417AFF';
        _color = 'red';
        _title = 'white';
        _details = 'red';
    }

    var $dtp = $(document).find(_dtp);

    $dtp.find('.datepick-today').css('background-color', '#A3CB38');

    $dtp.find('a.datepick-cmd-today').css('background-color', _theme);
    $dtp.find('.datepick-month-header input').css('color', _theme);
    $dtp.find('.datepick-month-header select').css('color', _theme);
    $dtp.find('a.datepick-selected').css('background-color', _theme);

    customSnakeDays(_myObject);

    $dtp.find('.datepick .li-1').css('background-color', _color);
    $dtp.find('.datepick .li-2').css('background-color', _title);
    $dtp.find('.datepick .li-3').css('background-color', _details);
    $dtp.find('.isSnake span.side-a').css('background-color', hexToRgbA(_theme, '.15'));
    $dtp.find('.isSnake-first span.side-a-first').css('background-color', hexToRgbA(_theme, '.15'));
    $dtp.find('.isSnake-last span.side-a-last').css('background-color', hexToRgbA(_theme, '.15'));

    $dtp.find('.datepick .datepick-cmd-next').css('background-color', hexToRgbA(_theme, '.15'));
    $dtp.find('.datepick .datepick-cmd-prev').css('background-color', hexToRgbA(_theme, '.15'));
}

/* Event */
$(_dtp).on('click', function () {
    configDatePicker(_myObject);
    changeSizeDay();
});

function customSnakeDays(config) {
    var $dtp = $(document).find('#datepicker');
    var $tbody = $dtp.find('tbody');
    var $rows = $dtp.find('tbody tr');

    $rows.each(function (indexRow, itemRow) {
        var $row = $(itemRow);
        var $tds = $row.find('td');

        $tds.each(function (indexTd, itemTd) {

            /* 0 to 6 */
            var $currentIndex = indexTd;
            var $prevIndex = indexTd - 1;
            var $nextIndex = indexTd + 1;

            /* Add customs */

            var $ulHTML = '<ul>';

            if (config.Project.Event != undefined) {

                switch (config.Project.Event.length) {
                    case 0: {
                        $ulHTML = "";
                        break;
                    }
                    case 1: {
                        $ulHTML += "<li class='li-1'></li>";
                        break;
                    }
                    case 2: {
                        $ulHTML += "<li class='li-1'></li><li class='li-2'></li>";
                        break;
                    }
                    default: {
                        $ulHTML += "<li class='li-1'></li><li class='li-2'></li><li class='li-3'></li>";
                        break;
                    }
                }

                if ($ulHTML == "") {
                    console.log('No hay eventos');
                } else {
                    $ulHTML += "</ul>";

                    if (dayIsSelected($row, $currentIndex)) {
                        $row.find('td').eq($currentIndex).find('ul').remove();
                        $row.find('td').eq($currentIndex).append($ulHTML);
                    }
                }
            }

            if (!dayIsSelected($row, $prevIndex) &&
                !dayIsSelected($row, $nextIndex)) {
                return;
            }

            //Prev td
            if ($prevIndex >= 0) {

                //Has prev and next item
                if (dayIsSelected($row, $prevIndex) &&
                    dayIsSelected($row, $nextIndex)) {
                    $row.find('td').eq($currentIndex).removeClass().addClass('isSnake');

                    /* Add sides */
                    var side = "<span class='side-a'></span>";
                    $row.find('td').eq($currentIndex).find('span.side-a').remove();
                    $row.find('td').eq($currentIndex).append(side);
                }


                if (!dayIsSelected($row, $nextIndex)) {
                    $row.find('td').eq($currentIndex).removeClass().addClass('isSnake-last');

                    if ($row.find('td').eq($currentIndex).has('a.datepick-selected').length > 0) {

                        /* Add sides */
                        var side = "<span class='side-a-last'></span>";
                        $row.find('td').eq($currentIndex).find('span.side-a-last').remove();
                        $row.find('td').eq($currentIndex).append(side);
                    }
                }

                if (!dayIsSelected($row, $prevIndex)) {
                    $row.find('td').eq($currentIndex).removeClass().addClass('isSnake-first');

                    if ($row.find('td').eq($currentIndex).has('a.datepick-selected').length > 0) {
                        /* Add sides */
                        var side = "<span class='side-a-first'></span>";
                        $row.find('td').eq($currentIndex).find('span.side-a-first').remove();
                        $row.find('td').eq($currentIndex).append(side);
                    }
                }
            }
            else {
                /* current = 0, prev = -1 */
                if (dayIsSelected($row, $nextIndex)) {
                    $row.find('td').eq($currentIndex).removeClass().addClass('isSnake-first');

                    if ($row.find('td').eq($currentIndex).has('a.datepick-selected').length > 0) {
                        /* Add sides */
                        var side = "<span class='side-a-first'></span>";
                        $row.find('td').eq($currentIndex).find('span.side-a-first').remove();
                        $row.find('td').eq($currentIndex).append(side);
                    }
                }
            }

        });
    });
}

function dayIsSelected($row, $colIndex) {
    return $row.find('td').eq($colIndex).find('a').hasClass('datepick-selected');
}

configDatePicker(_myObject);

function changeSizeDay() {
    var w = $(_dtp).find('table thead tr:first th:first').width();
    $(_dtp).find('table tbody tr td').css('height', w + 'px');
}

$(window).on('resize', function () { changeSizeDay(); });
changeSizeDay();

$(_dtp).on('click', 'tbody td a.datepick-selected', function (e) {
    e.preventDefault();

    if (_myObject != undefined) {
        if (_myObject.Project != undefined) {
            if (_myObject.Project.Event != undefined && _myObject.Project.Event != null) {

                var $events = _myObject.Project.Event;
                $('div.c-events-inner').find('div.event').remove();

                $.each($events, function (i, evento) {
                    var $eventHTML = "<div class='event' style='background-color: " + evento.Color + "'>" +
                        "<span class='event-title'>" + evento.Title + "</span>" +
                        " <p class='event-details'>" + evento.Details + "</p>" +
                        "</div>";

                    $('div.c-events-inner').append($eventHTML);
                });
            }
        }
    }
});