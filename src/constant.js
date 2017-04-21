const $ = window.$;

const _Contant = {
  // 是否是手机端
  BMOBILEVIEW: () => $(window).outerWidth() <= 1024,
  // 是否有手机端事件
  BMOBILEEVENT: () => /Android|iPhone|SymbianOS|Windows Phone|iPad|iPod/g.test(navigator.userAgent),
  TESTEVENT: () => (_Contant.BMOBILEEVENT() ? 'touchend.adhoc' : 'mousedown.adhoc'),
};

export default _Contant;
