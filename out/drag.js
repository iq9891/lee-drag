(function () {
'use strict';

var $ = window.$;

function bindDom(self, parmas) {
  self.parmas = parmas;
  self.id = parmas.drag;
  self.bIdDrag = parmas.bIsDrag;
  self.$id = $(self.id);
  self.$parent = self.$id.parent();
  self.eventSpace = parmas.eventSpace;
  self.$id.data('limit.' + self.eventSpace, parmas.limit);
  self.limit = parmas.limit;
  self.down = parmas.down;
  self.move = parmas.move;
  self.up = parmas.up;
  self.$doc = $(document);
  self.$win = $(window);
  self.iShadowWidth = 3;
  self.iPaddingSize = 10;
  self.winHeight = self.$win.outerHeight();
  self.winWidth = self.$win.outerWidth();
  self.dragHeight = self.$id.outerHeight();
  self.dragWidth = self.$id.outerWidth();
  self.dragParentHeight = self.$parent.outerHeight();
  self.dragParentWidth = self.$parent.outerWidth();
  self.oParentOffset = self.$parent.offset();

  self.originPos = {};
}

function dragPos($obj, top, left) {
  $obj.css({
    top: top,
    left: left
  });
}

function mousemoveHandler(self, e) {
  var newTop = e.clientY - self.originPos.y - self.oParentOffset.top;
  var newLeft = e.clientX - self.originPos.x - self.oParentOffset.left;
  var _iMinTop = self.scrollTop - self.dragHeight / 2;
  var _iMinLeft = self.scrollLeft - self.dragWidth / 2;
  var iMaxTop = self.dragParentHeight + self.scrollTop;
  var iMaxLeft = self.dragParentWidth + self.scrollLeft;
  iMaxTop -= self.iPaddingSize - self.iShadowWidth;
  iMaxLeft -= self.iPaddingSize - self.iShadowWidth;
  if (self.limit) {
    if (newTop < _iMinTop) {
      newTop = _iMinTop;
    } else if (newTop > iMaxTop) {
      newTop = iMaxTop;
    }
    if (newLeft < _iMinLeft) {
      newLeft = _iMinLeft;
    } else if (newLeft > iMaxLeft) {
      newLeft = iMaxLeft;
    }
  }

  if (self.bIdDrag) {
    dragPos(self.$id, newTop, newLeft);
  }

  self.move(e, {
    left: newLeft,
    top: newTop
  }, {
    left: e.clientX - self.originPos.x,
    top: e.clientY - self.originPos.y
  });
}

function mouseupHandler(self) {
  self.$doc.off('.' + self.eventSpace);
  self.originPos = {};
  self.up();
  return false;
}

function mousedownHandler(self, e) {
  var _oDownOffset = self.$id.offset();
  var oEvents = {};

  self.originPos.x = e.clientX - _oDownOffset.left;
  self.originPos.y = e.clientY - _oDownOffset.top;
  self.scrollTop = self.$doc.scrollTop();
  self.scrollLeft = self.$doc.scrollLeft();

  oEvents['mousemove.' + self.eventSpace] = function (moveEvent) {
    mousemoveHandler(self, moveEvent);
  };
  oEvents['mouseup.' + self.eventSpace] = function (upEvent) {
    mouseupHandler(self, upEvent);
  };
  self.$doc.on(oEvents);

  self.down(e, self.originPos.x, self.originPos.y);

  return false;
}

function bindEvent(self) {
  self.on('mousedown.' + self.eventSpace, function (e) {
    mousedownHandler(self, e);
    return false;
  });
}

function dragFn(parmas) {
  parmas = $.extend({}, {
    drag: '#adhoc-contextmenu',
    eventSpace: 'adhoc',
    bIsDrag: true,
    limit: false,
    down: $.noop,
    move: $.noop,
    up: $.noop
  }, parmas);

  bindDom(this, parmas);

  bindEvent(this);
}
var _sDragMethod = $.fn.drag ? 'leedrag' : 'drag';
var _sDragPosMethod = $.fn.drag ? 'leedragpos' : 'dragpos';
var _oExtend = {};
var _oExtend2 = {};

_oExtend[_sDragMethod] = dragFn;
_oExtend2[_sDragPosMethod] = dragPos;

$.fn.extend(_oExtend);
$.extend(_oExtend2);

}());
