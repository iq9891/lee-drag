
import './drag';

const $ = window.$;

function bindDom(self, parmas) {
  self.parmas = parmas;
  self.id = parmas.drag;
  self.bIdDrag = parmas.bIsDrag;
  self.$id = $(self.id);// 移动的元素
  self.$parent = self.$id.parent();// 移动的元素
  self.eventSpace = parmas.eventSpace;
  self.$id.data(`limit.${self.eventSpace}`, parmas.limit);
  self.limit = parmas.limit;
  self.down = parmas.down;
  self.move = parmas.move;
  self.up = parmas.up;
  self.$doc = $(document);
  self.$win = $(window);
  self.iShadowWidth = 3; // 白色 1 px ， 黑色 2 px
  self.iPaddingSize = 10; // 最外层padding的宽度
  self.winHeight = self.$win.outerHeight();
  self.winWidth = self.$win.outerWidth();
  self.dragHeight = self.$id.outerHeight();
  self.dragWidth = self.$id.outerWidth();
  self.dragParentHeight = self.$parent.outerHeight();
  self.dragParentWidth = self.$parent.outerWidth();
  self.oParentOffset = self.$parent.offset();
  // 点击时候的位置记录
  self.originPos = {};
}

function dragPos($obj, top, left) {
  $obj.css({
    top,
    left,
  });
}

function mousemoveHandler(self, e) {
  let newTop = e.clientY - self.originPos.y - self.oParentOffset.top;
  let newLeft = e.clientX - self.originPos.x - self.oParentOffset.left;
  const _iMinTop = self.scrollTop - (self.dragHeight / 2);
  const _iMinLeft = self.scrollLeft - (self.dragWidth / 2);
  let iMaxTop = self.dragParentHeight + self.scrollTop;
  let iMaxLeft = self.dragParentWidth + self.scrollLeft;
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
  // 如果不让拖动的元素动
  if (self.bIdDrag) {
    dragPos(self.$id, newTop, newLeft);
  }
  /**
   * @return
   * e 事件对象
   * JSON {
     元素的 left
     元素的 top
   }
   * JSON {
     鼠标的 left
     鼠标的 top
   }
   */
  self.move(e, {
    left: newLeft,
    top: newTop,
  }, {
    left: e.clientX - self.originPos.x,
    top: e.clientY - self.originPos.y,
  });
} // end mousemoveHandler

function mouseupHandler(self) {
  self.$doc.off(`.${self.eventSpace}`);
  self.originPos = {};
  self.up();
  return false;
}

function mousedownHandler(self, e) {
  const _oDownOffset = self.$id.offset();
  const oEvents = {};

  self.originPos.x = e.clientX - _oDownOffset.left;
  self.originPos.y = e.clientY - _oDownOffset.top;
  self.scrollTop = self.$doc.scrollTop();
  self.scrollLeft = self.$doc.scrollLeft();

  oEvents[`mousemove.${self.eventSpace}`] = (moveEvent) => {
    mousemoveHandler(self, moveEvent);
  };
  oEvents[`mouseup.${self.eventSpace}`] = (upEvent) => {
    mouseupHandler(self, upEvent);
  };
  self.$doc.on(oEvents);
  /**
   * @return
   * self.originPos.x: 鼠标距离点击元素的 x
   * self.originPos.y: 鼠标距离点击元素的 y
   */
  self.down(e, self.originPos.x, self.originPos.y);

  return false;
} // end mousedownHandler

function bindEvent(self) {
  self.on(`mousedown.${self.eventSpace}`, (e) => {
    mousedownHandler(self, e);
    return false;
  });
}
/**
  * 拖拽
  * drag: String 不必须 父级，也是要移动的元素。传入的是jq选择器的字符串，比如 '#test' 。默认是 '#adhoc-contextmenu'
  * eventSpace: 默认是事件的命名空间是 adhoc
  * bIsDrag: Boolean 不必须  是否被拖拽，默认是 true
  * limit : Boolean 不必须 是否限制范围，默认 false (限制范围)， 相对于父级
  * down: function maybe 点下事件 ,return x:点击的x,y:点击的y
  * move: function maybe 移动事件
  * up: function maybe 抬起事件
  */
function dragFn(parmas) {
  parmas = $.extend({}, {
    drag: '#adhoc-contextmenu',
    eventSpace: 'adhoc',
    bIsDrag: true,
    limit: false,
    down: $.noop,
    move: $.noop,
    up: $.noop,
  }, parmas);
  // 绑定dom
  bindDom(this, parmas);
  // 绑定事件
  bindEvent(this);
} // end dragFn

// 重名处理
const _sDragMethod = $.fn.drag ? 'leedrag' : 'drag';
const _sDragPosMethod = $.fn.drag ? 'leedragpos' : 'dragpos';
const _oExtend = {};
const _oExtend2 = {};

_oExtend[_sDragMethod] = dragFn;
_oExtend2[_sDragPosMethod] = dragPos;

$.fn.extend(_oExtend);
$.extend(_oExtend2);
