/*
 * jQuery Slide Form 1.0
 *
*/

+function ($) { "use strict";

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle=slide]'
  var Slide = function (element) {
    $(element).on('click.bs.slide', this.toggle)
  }

  Slide.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = ($parent.hasClass('open') && !$parent.hasClass('animation'))

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      $parent.trigger(e = $.Event('show.bs.slide'))

      if (e.isDefaultPrevented()) return

      $parent
        .css("top", -($parent.children('ul').outerHeight()))
        .toggleClass('open')
        .addClass('animation')
        .animate({
            top:"+="+$parent.children('ul').outerHeight()
          }, 600)
          
      $this.animate({
            top:"+="+$parent.children('ul').outerHeight()
          }, 600)

      $parent
        .removeClass('animation')
        .trigger('shown.bs.slide')
        .focus()
    }

    return false
  }

  Slide.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).focus()
      return $this.click()
    }

    var $items = $('[role=menu] li:not(.divider):visible a', $parent)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index=0

    $items.eq(index).focus()
  }

  function clearMenus() {
    $(backdrop).remove()
    $(toggle).each(function (e) {
      var $parent = getParent($(this))
      if (!$parent.hasClass('open') || $parent.hasClass('animation')) return
      $parent.trigger(e = $.Event('hide.bs.slide'))
      if (e.isDefaultPrevented()) return
      $parent.addClass('animation')
      .animate({
        top:"-="+$parent.children('ul').outerHeight()
      }, 600)
      $(this).animate({
        top:"-="+$parent.children('ul').outerHeight()
      }, 600, function(){
        $parent.removeClass('open').removeClass('animation').trigger('hidden.bs.slide')
      })
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-slide')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  // SLIDE PLUGIN DEFINITION
  // ==========================

  var old = $.fn.slide

  $.fn.slide = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.slide')

      if (!data) $this.data('bs.slide', (data = new Slide(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.slide.Constructor = Slide


  // SLIDE NO CONFLICT
  // ====================

  $.fn.slide.noConflict = function () {
    $.fn.slide = old
    return this
  }
  
  
  // APPLY TO STANDARD SLIDE ELEMENTS
  // ===================================
  
  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.slide.data-api', '.dropdown-menu, form', function (e) { e.stopPropagation() })
    .on('click.bs.slide.data-api'  , toggle, Slide.prototype.toggle)
    .on('keydown.bs.slide.data-api', toggle + ', [role=menu]' , Slide.prototype.keydown)

}(jQuery);
