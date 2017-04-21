
import './drag';
import Constant from './constant';

const $ = window.$;

function bindDom(self, parmas) {
  self.parmas = parmas;
  self.id = parmas.parent;
  self.bIdDrag = parmas.parentIsDrag;
  self.$id = $(self.id);// 移动的元素
  self.$parent = self.$id.parent();// 移动的元素
  self.data(`limit.${parmas.eventSpace}`, parmas.limit);
  self.down = parmas.down;
  self.move = parmas.move;
  self.up = parmas.up;
  self.$doc = $(document);
  self.$win = $(window);
  self.winHeight = self.$win.outerHeight();
  self.winWidth = self.$win.outerWidth();
  self.dragHeight = self.$id.outerHeight();
  self.dragWidth = self.$id.outerWidth();
  self.oParentOffset = self.$parent.offset();
  // 点击时候的位置记录
  self.originPos = {};
}

function touchmoveHandler(self, e) {
  const { _pageX, _pageY } = e.originalEvent.changedTouches[0];
  let newTop = _pageY - self.originPos.y - self.oParentOffset.top;
  let newLeft = _pageX - self.originPos.x - self.oParentOffset.left;

  if (self.limit) {
    if (newTop < self.scrollTop) {
      newTop = self.scrollTop;
    } else if (newTop > (self.winHeight - self.dragHeight) + self.scrollTop) {
      newTop = (self.winHeight - self.dragHeight) + self.scrollTop;
    }
    if (newLeft < self.scrollLeft) {
      newLeft = self.scrollLeft;
    } else if (newLeft > (self.winWidth - self.dragWidth) + self.scrollLeft) {
      newLeft = (self.winWidth - self.dragWidth) + self.scrollLeft;
    }
  }
  // 如果不让拖动的元素动
  if (self.bIdDrag) {
    self.$id.css({
      top: newTop,
      bottom: 'auto',
      left: newLeft,
    });
  }
  /**
   * @return
   * e 事件对象
   * e.clientX - self.originPos.x: 移动的 x
   * e.clientY - self.originPos.y: 移动的 y
   */
  self.move(e, _pageX - self.originPos.x, _pageY - self.originPos.y);
} // end touchmoveHandler

function mousemoveHandler(self, e) {
  let newTop = e.clientY - self.originPos.y - self.oParentOffset.top;
  let newLeft = e.clientX - self.originPos.x - self.oParentOffset.left;

  if (self.limit) {
    if (newTop < self.scrollTop) {
      newTop = self.scrollTop;
    } else if (newTop > (self.winHeight - self.dragHeight) + self.scrollTop) {
      newTop = (self.winHeight - self.dragHeight) + self.scrollTop;
    }
    if (newLeft < self.scrollLeft) {
      newLeft = self.scrollLeft;
    } else if (newLeft > (self.winWidth - self.dragWidth) + self.scrollLeft) {
      newLeft = (self.winWidth - self.dragWidth) + self.scrollLeft;
    }
  }
  // 如果不让拖动的元素动
  if (self.bIdDrag) {
    self.$id.css({
      top: newTop,
      left: newLeft,
    });
  }
  /**
   * @return
   * e 事件对象
   * e.clientX - self.originPos.x: 移动的 x
   * e.clientY - self.originPos.y: 移动的 y
   */
  self.move(e, e.clientX - self.originPos.x, e.clientY - self.originPos.y);
} // end mousemoveHandler

function touchupHandler(self) {
  self.$doc.off('.adhoc');
  self.originPos = {};
  self.up();
  return false;
}

function mouseupHandler(self) {
  self.$doc.off('.adhoc');
  self.originPos = {};
  self.up();
  return false;
}

function touchstartHandler(self, e) {
  const _oDownOffset = self.$id.offset();

  self.originPos.x = e.originalEvent.changedTouches[0].pageX - _oDownOffset.left;
  self.originPos.y = e.originalEvent.changedTouches[0].pageY - _oDownOffset.top;
  self.scrollTop = self.$doc.scrollTop();
  self.scrollLeft = self.$doc.scrollLeft();
  self.limit = $(this).data(`limit.${self.parmas.eventSpace}`);

  self.$doc.on({
    'touchmove.adhoc': (moveEvent) => {
      touchmoveHandler(self, moveEvent);
    },
    'touchend.adhoc': (upEvent) => {
      touchupHandler(self, upEvent);
    },
  });
  /**
   * @return
   * self.originPos.x: 鼠标距离点击元素的 x
   * self.originPos.y: 鼠标距离点击元素的 y
   */
  self.down(e, self.originPos.x, self.originPos.y);

  return false;
} // end touchstartHandler

function mousedownHandler(self, e) {
  const _oDownOffset = self.$id.offset();
  console.log(111, _oDownOffset);
  self.originPos.x = e.clientX - _oDownOffset.left;
  self.originPos.y = e.clientY - _oDownOffset.top;
  self.scrollTop = self.$doc.scrollTop();
  self.scrollLeft = self.$doc.scrollLeft();
  self.limit = $(this).data(`limit.${self.parmas.eventSpace}`);

  self.$doc.on({
    'mousemove.adhoc': (moveEvent) => {
      mousemoveHandler(self, moveEvent);
    },
    'mouseup.adhoc': (upEvent) => {
      mouseupHandler(self, upEvent);
    },
  });
  /**
   * @return
   * self.originPos.x: 鼠标距离点击元素的 x
   * self.originPos.y: 鼠标距离点击元素的 y
   */
  self.down(e, self.originPos.x, self.originPos.y);

  return false;
} // end mousedownHandler

function bindEvent(self) {
  self.on(Constant.TESTEVENT(), (e) => {
    if (Constant.BMOBILEEVENT()) {
      touchstartHandler(self, e);
    } else {
      mousedownHandler(self, e);
    }
    return false;
  });
}
/**
  * 拖拽
  * parent: String 不必须 父级，也是要移动的元素。传入的是jq选择器的字符串，比如'#test'。默认是'#adhoc-contextmenu'
  * eventSpace: 默认是事件的命名空间是adhoc
  * parentIsDrag: Boolean 不必须  是否被拖拽，默认是true
  * limit : Boolean 不必须 是否限制范围，默认true(限制范围)
  * down: function maybe 点下事件 ,return x:点击的x,y:点击的y
  * move: function maybe 移动事件
  * up: function maybe 抬起事件
  */
function dragFn(parmas) {
  parmas = $.extend({}, {
    parent: '#adhoc-contextmenu',
    eventSpace: 'adhoc',
    parentIsDrag: true,
    limit: true,
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
const _sMethod = $.fn.drag ? 'leedrag' : 'drag';
const _oExtend = {};

_oExtend[_sMethod] = dragFn;

$.fn.extend(_oExtend);
