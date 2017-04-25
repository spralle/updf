import bind from '../bind';
import rect from '../vector/rect';
import block from '../block';

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%*';
const encoding = 'g65mzbi8nnitg5zn05i9hg3bmzhi8tn4nidznk5h7bn9hiitgonn4tie5h7hn5zifbnkhh8nn9tij5gxzn75ighh9tmdze3bmhhdsnmete45dpzme5e3hdhhdhtdn5g0hrlm';

function sym(ch) {
  const index = alphabet.indexOf(ch);
  if (index === -1) {
    return -1;
  } else {
    const symbol = encoding.substring(index * 3, index * 3 + 3);
    return parseInt(symbol, 36).toString(2);
  }
};

export function enc(text) {
  const STAR = sym('*');
  let res = STAR;
  // starts and ends with *
  const data = text.toUpperCase();
  for (const ch of data) {
    res += `${sym(ch)}0`;
  }
  return res + STAR;
}

const code39 = (props) => {
  const b = enc(props.value);
  const height = (props.style && props.style.height) || props.height || 20;
  const width = (props.style && props.style.width) || props.height || 100;
  const elemWidth = width / (b.length);
  let x = 0;
  let cWidth = 0;
  const children = [...b].map((s, i) => {
    let r = null;
    if (s === '1') {
      cWidth++;
    } else if (cWidth > 0) {
      x = i * elemWidth;
      r = rect({ style: { left: x - elemWidth * cWidth, top: 0, width: elemWidth * cWidth, height, position: 'absolute' } });
      cWidth = 0;
    }
    return r;
  });
  // children.push(rect({ style: { left: x - elemWidth * (cWidth - 1), top: 0, width: elemWidth * cWidth, height, position: 'absolute' } }));
  return block({ style: { border: true, left: 30, top: 30, height, width } }, children.filter(n => n !== undefined));
};

export default bind(code39);