let ua = '';
const browser = () => {
  const explorer = navigator.userAgent;
  if (explorer.indexOf('MSIE') >= 0) { //ie
    ua = 'ie';
  }
  else if (explorer.indexOf('Firefox') >= 0) { //firefox
    ua = 'firefox';
  }
  else if (explorer.indexOf('Chrome') >= 0) { //Chrome
    ua = 'chrome';
  }
  else if (explorer.indexOf('Opera') >= 0) { //Opera
    ua = 'opera';
  }
  else if (explorer.indexOf('Safari') >= 0) { //Safari
    ua = 'safari';
  }
  else if (explorer.indexOf('Netscape') >= 0) { //Netscape
    ua = 'netscape';
  }
}
browser();
export default ua;
