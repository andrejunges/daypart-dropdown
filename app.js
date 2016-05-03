(function () {

    var data = [
        { id: 1, text: 2.25, units: 30 },
        { id: 2, text: 2.50, units: 20 },
        { id: 3, text: 2.75, units: 10 },
        { id: 4, text: 3.00, units: 33 },
        { id: 5, text: 3.25, units: 10 },
        { id: 6, text: 3.50, units: 24 },
        { id: 7, text: 3.75, units: 4 },
        { id: 8, text: 4.00, units: 13 },
        { id: 9, text: 4.25, units: 15 },
    ]
    var $input = $("#customDD");
    $input.cpmDropdown({
        data: data
    });

}())