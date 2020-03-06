/* Configurables */
var _myProjects = getJSONFromDBFake();


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

    dateFormat: "dd/MM/yyyy",
    onSelect: function (dates) {
        ConfigDatePicker(_myProjects);
    },
    onChangeMonthYear: function(year, month) {
        ConfigDatePicker(_myProjects);
        ChangeSizeDay();
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

    $.each(Projects, function (iproj, proj) {

        var range = GetRangeDates(proj.Project.StartDate, proj.Project.EndDate)

        for (var i = 0; i < range.length; i++) {
            allDates.push(range[i]);
        }
    });
    $(_dtp).datepick('setDate', allDates);
}

/* Calling */ GetAllDatesByProjects(_myProjects);

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

    $.each(Projects, function (iproj, proj) {

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

        // $dtp.find('.datepick .li-1').css('background-color', _color);
        // $dtp.find('.datepick .li-2').css('background-color', _title);
        // $dtp.find('.datepick .li-3').css('background-color', _details);
    });

    // if (config.Project != undefined) {
    //     _theme = config.Project.Color == undefined ? "#417AFF" : config.Project.Color;

    //     if (config.Project.Event != undefined) {

    //         switch (config.Project.Event.length) {
    //             case 0: {
    //                 console.log('No hay eventos :(')
    //                 break;
    //             }
    //             case 1: {
    //                 _color = config.Project.Event[0].Color;
    //                 break;
    //             }
    //             case 2: {
    //                 _color = config.Project.Event[0].Color;
    //                 _title = config.Project.Event[1].Color;
    //                 break;
    //             }
    //             default: {
    //                 _color = config.Project.Event[0].Color;
    //                 _title = config.Project.Event[1].Color;
    //                 _details = config.Project.Event[2].Color;
    //                 break;
    //             }
    //         }
    //     }
    // }
    // else {
    //     _theme = '#417AFF';
    //     _color = 'red';
    //     _title = 'white';
    //     _details = 'red';
    // }


}

$(document).on('click', _dtp, function (e) {
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

            // if (config.Project.Event != undefined) {

            //     switch (config.Project.Event.length) {
            //         case 0: {
            //             $ulHTML = "";
            //             break;
            //         }
            //         case 1: {
            //             $ulHTML += "<li class='li-1'></li>";
            //             break;
            //         }
            //         case 2: {
            //             $ulHTML += "<li class='li-1'></li><li class='li-2'></li>";
            //             break;
            //         }
            //         default: {
            //             $ulHTML += "<li class='li-1'></li><li class='li-2'></li><li class='li-3'></li>";
            //             break;
            //         }
            //     }

            //     if ($ulHTML == "") {
            //         console.log('No hay eventos');
            //     } else {
            //         $ulHTML += "</ul>";

            //         if (dayIsSelected($row, $currentIndex)) {
            //             $row.find('td').eq($currentIndex).find('ul').remove();
            //             $row.find('td').eq($currentIndex).append($ulHTML);
            //         }
            //     }
            // }

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
            }
            else {
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

$(window).on('resize', function () { ChangeSizeDay(); });
ChangeSizeDay();

$(_dtp).on('click', 'tbody td a.datepick-selected', function (e) {
    e.preventDefault();

    var tsClass = $(this).prop('class').split(' ')[0];

    if (tsClass.indexOf('dp') == -1) {
        console.log("tbody td a.datepick-selected | event:click() | No se encontró la clase dp##########");
        return;
    }

    var ts = parseInt(tsClass.substring(2));
    var date = new Date(ts);
    var dateDDMMYYYY = TransformDateToDDMMYYY(date);
    // console.log(dateDDMMYYYY);


    // alert(date);

    // if (_myObject != undefined) {
    //     if (_myObject.Project != undefined) {
    //         if (_myObject.Project.Event != undefined && _myObject.Project.Event != null) {

    //             var $events = _myObject.Project.Event;
    //             $('div.c-events-inner').find('div.event').remove();

    //             $.each($events, function (i, evento) {
    //                 var $eventHTML = "<div class='event' style='background-color: " + evento.Color + "'>" +
    //                     "<span class='event-title'>" + evento.Title + "</span>" +
    //                     " <p class='event-details'>" + evento.Details + "</p>" +
    //                     "</div>";

    //                 $('div.c-events-inner').append($eventHTML);
    //             });
    //         }
    //     }
    // }
});

function GetTimeFromElementA(ElementA) {
    var tsClass = $(ElementA).prop('class').split(' ')[0];
    if (tsClass.indexOf('dp') == -1) {
        console.log("GetTimeFromElementA(ElementA) | No se econtró la clase [dp###################]");
        return null;
    }
    return tsClass.substring(2);
}

function TransformDateToDDMMYYY(date) {
    console.log(date);
    if (date != undefined && date != null) {
        var DateDDMMYYYY = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "/" +
            ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "/" +
            date.getFullYear();
        return DateDDMMYYYY;
    }
}

ConfigDatePicker(_myProjects);