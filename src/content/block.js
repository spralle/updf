import _render from './_render';
import bind from './bind';

const block = (props, context) => {
  const ctx = Object.assign({}, context);
  let cx = props.style.left;
  let cy = context.style.$height - props.style.top;
  //  cx += props.style.left;
  // used so that we can wrap text in container &
  // make sure all elements are layed out "properly"...
  let i = 0;
  ctx.text = function (text, options) {
    if(!i++) {
      context.out(' 1 0 0 rg ');
    }
    cy -= 25;
    console.log('ATXT', text);
    context.out('BT /G 24 Tf');
    context.out(` ${cx} ${cy} Td `);
    context.out(`(${text})`).out(' Tj ET\n');
    // update cx, cy based on text
  };
  ctx.block = function(block, options) {

  }
  console.log('>BLOCK');
   // collect children and sizes of children
  props.children.forEach(ch => _render(ch, ctx));
  console.log('<BLOCK');
  // every day I'm rendering
};

export default bind('block', block);