(function () {
  var $input = $("#customDD");
  var selected = undefined;
  
  $input.on("keyup", function() {
    var optionsContainer = $("#optionsContainer");
    var value = parseFloat(this.value);
    var options = data.filter(function(x) {
      return Math.floor(x.text) == Math.floor(value)
    })
    var option = data.filter(function(x) {
      return parseFloat(x.text) == value
    })

    var index = data.indexOf(options[0])
    if (index >= 0 && option.length) {
      selected = option[0].id;
      var elemId = "item-" + option[0].id;
      $(".item-selected").removeClass("item-selected");
      $("#" + elemId).addClass("item-selected");
    }
    //optionsContainer.animate({scrollTop: index * 42}, 300, "swing")
  })
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
  
function handleKeyPresses(event) {
  if(event.keyCode === 40) {
    if (selected === undefined)
      selected = 1
    else if (selected < data.length)
      selected = selected + 1
      
  }
  else if (event.keyCode === 38) {
    if (selected === undefined)
      selected = 1
    else if (selected > 1)
      selected = selected - 1
  }
  else if (event.keyCode === 13) {
    if (selected)
      setValue()
  }

  var $itemElem = $("#item-" + selected);
  var $container = $("#optionsContainer");
  $(".item-selected").removeClass("item-selected");
  $itemElem.addClass("item-selected");
  var containerTop = $container[0].offsetTop;
  var elemTop = $itemElem[0].offsetTop - containerTop;
  var fitContainer = elemTop + 42 < 200;
  
  if (!fitContainer) {
    $container[0].scrollTop += 42;
  } else if ($container[0].scrollTop > elemTop + 42) {
    $container[0].scrollTop -= 60;
  }
  //if ($itemElem[0].offsetTop - containerTop) {}
  //var scrollTopValue = "+=" + ((selected - 1) * 42) + "px"
  //$("#optionsContainer").animate({scrollTop: scrollTopValue}, 300, "swing")
  
  return false;
}

function getItemElem(elem) {
  var $elem = $(elem);
  return $elem.hasClass("item") ? $elem : getItemElem($elem.parent())
}

function setValue() {
  var item = data.find(function(x) { return x.id === selected })
  $input.val(item.text)
  $input.webuiPopover('hide');
}

function handleClickItem(event) {
    var itemElem = getItemElem(event.target)
    selected = itemElem.data('id')
    setValue()
}
  
$input.webuiPopover({
    arrow: false,
    offsetTop: 5,
    padding: 0,
    style: 'custom',
    width: 250,
    onShow: function($element) {
      $("body").on("keyup", handleKeyPresses)
      $element.on("click", ".item", handleClickItem)
    },
    onHide: function($element) {
      $("body").off("keyup", handleKeyPresses)
      $element.off("click", ".item", handleClickItem)
    },
    content: function() {
      var content = "<div>";
      content += "<div class='item item-optimal'>"
      content += "<span class='label-text'>"
      content += "<span>$5.00</span>"
      content += "<span class='label-bid'>(Optimal Bid)</span>"
      content += "</span>"
      content += "<span class='label-units bg-green'>30</span>"
      content += "</div>"

      content += "<div id='optionsContainer' class='container'>"
      content += data.map(function (item) {
        var itemContent = "<div data-id='" + item.id + "' id='item-" + item.id + "' class='item'>";
        itemContent += "<span class='label-text'>";
        itemContent += "<span>$" + item.text.toFixed(2) + "</span>";
        if (item.id === 2)
          itemContent += "<span class='label-bid'>(Low Bid)</span>";
        itemContent += "</span>"
        itemContent += "<span class='label-units'>" + item.units + "</span>"
        itemContent += "</div>"
        return itemContent
      }).join('')
      content += "</div>"
      content += "</div>"
      return content;
    }
  })
}())