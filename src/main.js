// 引入scss
import './style.scss';

import './drag';

const $ = window.$;

const _oDefultParams = {
  showEvent: 'click',
  onShow: $.noop,
  onBeforeShow: $.noop,
  onHide: $.noop,
  onChange: $.noop,
  onSubmit: $.noop,
  color: '3289c7',
  parent: document.body,
  submit: 1,
  submitText: 'OK',
  height: 152,
};

const _colpick = () => {
  console.log(978);
  return {
    init: (opt) => {
      opt = $.extend({}, _oDefultParams, opt || {});

      // const _$colorpick = $('#lee-colorpick');
      // const _$color = _$colorpick.find('#lee-colorpick_color');
      // const _$inner = _$colorpick.find('#lee-inner');
      console.log('opt', opt);
      // _$color.on('mousedown.lee', () => {
      //   console.log(111);
      // });
      $('#lee-inner').drag({
        drag: '#lee-inner',
        limit: true,
        move: (moveEvent, x, y) => {
          console.log(x, y);
        },
      });
      // 设置某个位置
      // setTimeout(() => {
      //   $.dragpos($('#lee-inner'), 0, 0);
      // }, 2000);
    }, // end init
  };
};

$.fn.extend({
  colpick: _colpick().init,
});
