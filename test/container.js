import block from '../src/content/block';
import page from '../src/content/page';
import document from '../src/content/document';
import inline from '../src/content/inline';
import rect from '../src/content/vector/rect';
import code39 from '../src/content/barcode/code39';

import text from '../src/content/text';
import a4 from '../src/boxes/a4';
import helvetica from '../src/font/helvetica';

import reduce from '../src/vdom/reduce';
import layouter from '../src/vdom/layouter';
import renderer from '../src/vdom/renderer';

import should from 'should';

/* processes:
  * layout (x,y, width & height)
   *  width needs font (inline)
  * render
*/




function dumpDom(vdom, indent = 0) {
  let out = '';
  //if(vdom.context == null || vdom.props == null) {}
  for (let i = 0; i < indent; i++) { out += '  '; }
  out += `<${vdom.type}`;
  Object.keys(vdom.props || {}).forEach(key => {
    out += ` ${key}=${JSON.stringify(vdom.props[key])}`;
  });
  Object.keys(vdom.context || {}).forEach(key => {
    if (key !== 'font' && key !== 'fonts' && key !== '_contexts') {
      out += ` $${key}=${JSON.stringify(vdom.context[key])}`;
    }
  });
  out += '>';
  console.log(out);
  if (vdom.children) {
    vdom.children.forEach(ch => {
      /*      if (isText(ch)) {
              console.log(ch.str);
            } else {*/
      dumpDom(ch, indent + 1);
      //}
    });
  }
  out = '';
  for (let i = 0; i < indent; i++) { out += '  '; }

  console.log(`${out}</${vdom.type}>`);
}


class Fonts {
  constructor() {
    this._fonts = {};
  }
  add(family, font) {
    this._fonts[family] = font;
    return font;
  }
  get(family) {
    return this._fonts[family];
  }
}
// Author Stena Line
const stenaLogo = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 width="270.5px" height="102.5px" viewBox="-336 39.1 270.5 102.5" style="enable-background:new -336 39.1 270.5 102.5;"
	 xml:space="preserve">
<style type="text/css">
	.st0{fill:#002F87;}
	.st1{fill:#FFFFFF;}
	.st2{fill:#E2231A;}
</style>
<path class="st0" d="M-302,103c-1.1-2.5-3.8-3.6-6.3-3.6c-3.3,0-5.2,1.3-5.2,3.1c0,2.2,3.5,3.1,7.4,4.4c5.8,2,10.2,4.3,10.2,9.4
	c0,7.7-8.4,13.7-19,13.7c-6,0-13.3-2.9-13.8-9.4l8.4-1.5c0.6,2.5,4.2,3.7,6.5,3.7c2.6,0,6.6-0.8,6.6-3.9c0-2.3-3.7-3.2-7.6-4.5
	c-3.9-1.3-9.6-3.6-9.6-9.2c0-9.3,10-12.6,16.8-12.6c5,0,12.6,2.2,13.9,8.6L-302,103z"/>
<path class="st0" d="M-275.3,108.9h-5l-2.2,9.7c-0.2,0.5-0.3,1.1-0.3,1.7c0,1.7,1.6,1.8,3,1.8h1.3l-1.6,6.9
	c-1.9,0.1-3.8,0.2-5.8,0.2c-3.2,0-7.7,0.1-7.7-4.2c0-1.4,0.2-2.8,0.7-5l2.5-11.2h-3.7l1.3-5.5h3.8l1.8-8.1h9.7l-1.8,8.1h5
	L-275.3,108.9z"/>
<path class="st0" d="M-246.4,118.2h-19.8c-0.1,0.5-0.2,1-0.2,1.5c0,2.6,1.9,4.2,4.3,4.2c1.8,0,3.5-0.8,4.5-2.2h9.4
	c-3.2,5.8-9.2,8.1-15.5,8.1c-6.7,0-12.5-3.1-12.5-10.1c0-9.7,8.2-17.1,17.8-17.1c7.7,0,12.5,4.4,12.5,11.4
	C-245.9,115.4-246.2,117.2-246.4,118.2z M-259.1,108.5c-3.2,0-5.3,1.9-6.1,5h10c0.1-0.3,0.1-0.7,0.1-1.1
	C-255.1,109.9-256.9,108.5-259.1,108.5z"/>
<path class="st0" d="M-215.2,113.6l-3.5,15.5h-9.9l3.1-13.5c0.2-0.7,0.3-1.4,0.3-2.1c0-2.1-1-3.1-3.1-3.1c-3.2,0-4.9,2.9-5.5,5.6
	l-3,13.1h-9.9l5.8-25.6h8.9l-1.1,4.6c2.5-2.8,6.6-5.4,10.4-5.4c4.7,0,7.9,2.2,7.9,7C-214.8,111-215,112.3-215.2,113.6z"/>
<path class="st0" d="M-184.6,113.2l-3.6,15.9h-9.4l0.7-3.1c-3.5,2.7-6.5,3.9-10.9,3.9c-3.7,0-7.5-2-7.5-6.2c0-2.8,1.7-5.5,3.7-6.9
	c3.3-2.3,8-2.7,13.1-3.3c2.7-0.4,4.7-1,4.7-3c0-1.6-2-1.9-3.2-1.9c-1.9,0-3.7,0.6-4.4,2.5h-9.5c1.8-7.2,9.6-8.3,16-8.3
	c4.3,0,11,0.3,11,6.1C-184.1,110.2-184.3,111.7-184.6,113.2z M-198.7,118.4c-3.2,0.7-6.2,1.3-6.2,3.5c0,1.9,1.6,2.5,3,2.5
	c4,0,5.9-3.5,6.4-7.1C-196.5,117.8-197.6,118.1-198.7,118.4z"/>
<path class="st0" d="M-150.5,129H-178l8-35.4h11.3l-6.2,27.6h16.2L-150.5,129z"/>
<path class="st0" d="M-131.3,99.5h-9.9l1.5-6.9h9.9L-131.3,99.5z M-138,129h-9.9l5.9-25.6h9.8L-138,129z"/>
<path class="st0" d="M-103.3,113.6l-3.5,15.5h-9.9l3.1-13.5c0.1-0.7,0.2-1.4,0.2-2.1c0-2.1-1-3.1-3-3.1c-3.2,0-4.9,2.9-5.5,5.6
	l-3,13.1h-9.9l5.8-25.6h8.9l-1.1,4.6c2.5-2.8,6.5-5.4,10.3-5.4c4.7,0,7.9,2.2,7.9,7C-102.8,111-103,112.3-103.3,113.6z"/>
<path class="st0" d="M-72.5,118.2h-19.8c-0.1,0.5-0.2,1-0.2,1.5c0,2.6,1.9,4.2,4.3,4.2c1.8,0,3.5-0.8,4.6-2.2h9.4
	c-3.2,5.8-9.2,8.1-15.5,8.1c-6.7,0-12.5-3.1-12.5-10.1c0-9.7,8.2-17.1,17.8-17.1c7.7,0,12.5,4.4,12.5,11.4
	C-71.9,115.4-72.2,117.2-72.5,118.2z M-85.2,108.5c-3.2,0-5.3,1.9-6.1,5h10c0.1-0.3,0.1-0.7,0.1-1.1
	C-81.2,109.9-82.9,108.5-85.2,108.5z"/>
<path class="st1" d="M-240.7,90.9c0,0,2.5-0.9,3.6-1.3c1-0.4,3.1-1.1,6.1-1.1c2.3,0,4,0.8,6.3,0.5c1.5-0.2,4.4-1,7.1-1
	c3.1,0,3.5,0.6,6.2,0.2c2.5-0.3,4.7-0.7,7.4,0.6c2.6,1.3,6.2,0.7,7.8,0.4c1.7-0.3,4.8-0.5,7.6-0.4c2.7,0.1,5.9,1,8.5,1
	c2.3,0,6.2-0.3,6.9-0.5c0.1-3.7-0.6-6.9-0.7-7.5c-0.5-3-0.8-6.7-0.7-8.3c0.1-1.2,0.6-7.5,0.7-8.7c0.1-1.3,0.6-6.4,0.6-11.1
	c0-2.8-0.5-7.4-0.9-8.6c0,0-1.7,0.7-4.1,0.9c-3.6,0.4-5.5,0-7.1-0.4c-1.9-0.4-6.3-0.3-10.2,0.1c-4.1,0.5-5.2,0.2-6.1,0
	c-2.3-0.4-3.9-1.7-7.2-1.6c-1,0-3.2,0.2-4.1,0.2c-1.5,0-4.1-0.6-5.6-0.7c-0.9,0-1.8,0.2-2.7,0.3c-1,0.2-2.5,0.5-4.8,0.6
	c-2.2,0.1-3.1-0.1-4.2-0.2c-1.2-0.2-3.3-0.4-5.4-0.3c-2.8,0.1-7.5,1.3-7.5,1.3c0.5,1.5,2.2,6.5,2.8,9.7c0.4,2.1,1.1,5.6,1.4,8.3
	c0.2,2.5,0.5,5.4,0.3,8c0,1-0.1,2.3-0.2,3.3c-0.1,2.3-0.4,4.8-0.6,6.3C-239.6,83-240.3,89-240.7,90.9"/>
<path class="st2" d="M-180.6,51.9c-2.2,0-5.5-0.7-6.9-0.9c-1.2-0.2-5.7-0.2-6.9,0c-1.8,0.2-4.7,0.5-6.9,0.3
	c-2.2-0.2-4.6-1.4-6.3-1.7c-1.3-0.2-4,0.1-5.5,0.3c-1.5,0.1-3.9-0.6-5.9-0.5c-3,0-5.2,1-7.5,0.9c-1.7,0-3.7-0.3-4.7-0.5
	c-2.4-0.3-3.9-0.2-5.8,0c-1.2,0.2-2.2,0.4-2.9,0.5c0.5,1.6,1,3.6,1.4,5.2c0.4,2,1,5.5,1.3,8.1c0.2,2.4,0.5,5.2,0.4,7.7
	c0,0.9-0.1,2.2-0.2,3.2c-0.1,2.2-0.4,4.2-0.5,5.7c-0.1,0.7-0.2,2-0.3,3.5c0.9-0.3,2.4-0.7,3.3-0.8c1.2-0.2,3.8-0.6,5.1-0.4
	c1,0.1,2.3,0.6,4.3,0.6c2,0,4.7-0.7,6.5-0.8c1.9-0.2,3.1-0.1,4.8,0.1c0.9,0.1,2.4,0,3.2-0.1c1-0.1,3.1-0.5,4.8-0.2
	c2.1,0.4,4,1.6,6,1.6c1.6,0,2.6,0,4.1-0.2c1.5-0.2,4.4-0.7,6.9-0.6c2.5,0.1,5.5,0.8,8.5,1.1c2.8,0.3,4.5,0,5.2-0.2
	c-0.1-0.6-0.2-1.2-0.3-1.7c-0.5-2.9-0.7-7.5-0.6-8.8c0.1-1.2,0.6-7.4,0.8-8.5c0.2-1.2,0.6-6.2,0.5-10.7c0-1.1-0.1-2.1-0.1-2.9
	C-175.9,51.4-177.9,51.9-180.6,51.9z"/>
<path class="st0" d="M-237.1,48c2.2-0.3,4.7-0.3,5.9-0.1c0.9,0.1,2.6,0.5,4.4,0.5c2.6,0.1,6.1-0.9,7.8-0.9c2-0.1,4.1,0.6,5.7,0.5
	c1.5-0.1,4.2-0.5,5.5-0.3c1.7,0.3,4,1.5,6.4,1.8c2.3,0.3,5.2-0.1,6.4-0.2c1.9-0.2,6-0.3,7.3-0.1c1.4,0.2,4.5,0.9,6.7,0.8
	c3.1,0,4.9-0.4,5.7-0.6c-0.1-1.3-0.3-2-0.3-2s-1.3,0.4-3.7,0.6c-3.5,0.4-5.4-0.2-7-0.6c-1.8-0.4-6.2-0.3-9.9,0.1
	c-4,0.5-5.1,0.1-6-0.1c-2.2-0.4-3.8-1.6-7.1-1.6c-1,0-3.1,0.2-3.9,0.2c-1.5,0.1-4-0.6-5.4-0.6c-0.9,0-1.7,0.1-2.6,0.3
	c-0.9,0.2-2.5,0.5-4.6,0.6c-2.2,0.1-3-0.1-4.1-0.2c-1.2-0.2-3.4-0.4-5.5-0.3c-2.3,0.1-5.6,0.9-5.6,0.9s0.2,0.7,0.6,1.9
	C-239.7,48.5-238.6,48.2-237.1,48z"/>
<path class="st0" d="M-180.7,85.9c-3.3-0.3-6.2-0.9-8.5-1c-2.7-0.1-5.4,0.3-6.9,0.5c-1.7,0.2-2.6,0.2-4.3,0.2c-2,0-3.3-1-5.4-1.4
	c-1.6-0.3-4.1,0-5,0.1c-0.8,0.1-2.5,0.2-3.3,0c-1.7-0.2-2.2-0.3-4.1-0.2c-2.6,0.2-4.8,0.9-6.8,0.9c-2,0-3.2-0.4-4.7-0.6
	c-1.6-0.1-3.8,0.2-5,0.4c-1,0.1-2.6,0.6-3.4,0.9c-0.1,1.2-0.3,2.3-0.3,2.3s1-0.4,2-0.7c1-0.4,3.4-0.9,5.9-0.9c2.2,0,3.8,0.9,6,0.5
	c1.4-0.2,4.3-1.1,7-1.1c3,0,3.4,0.6,6,0.2c2.4-0.3,5.5-0.6,8,0.7c2.5,1.2,5.5,0.6,7,0.4c1.4-0.2,4.8-0.6,7.3-0.5
	c2.6,0.1,6,0.9,8.4,1c2.2,0.1,5.3-0.2,6-0.3c0.1-0.6,0-1.2,0-1.9C-175.5,85.7-177.5,86.1-180.7,85.9z"/>
<path class="st1" d="M-205.5,59.9c0,0,1.8,0,2.3,0c0.5,0,2.6,0,2.6,0s0-2.4-0.1-2.8c-0.1-0.4-0.3-1.8-1.5-2.6c-1-0.6-3.4-1-5.7-1
	c-1.7,0-3.9,0.3-5.1,1.1c-0.6,0.4-1.1,0.8-1.5,2c-0.4,1.3-0.3,3.3-0.3,3.8c0,0.4,0.1,1.6,0.5,2.3c0.6,1,1.3,1.5,2.7,2.3
	c1.4,0.8,4.2,2.3,4.8,2.7c0.7,0.4,1,0.9,1,1.5c0.1,0.5,0.1,2.4,0.1,3.4c-0.1,0.9-0.2,1.4-0.7,1.6c-0.5,0.2-1.4,0.2-2.1,0.1
	c-0.9-0.2-0.9-1.1-1-1.6c0-0.6,0-1.7,0-1.7l-5.5,0c0,0,0,2.8,0.1,3.3c0,0.4,0.2,1.9,1,2.9c0.9,0.9,1.7,1.5,3.4,1.4
	c1.6-0.1,2.4-0.2,3.2-0.2c1.1,0,1.9,0.4,3.1,0.2c1.2-0.1,2.6-0.6,3.4-2.3c0.6-1.2,0.5-2.3,0.6-3c0-0.8,0.1-4,0.1-4.5
	c0-1.5-0.4-2.4-1.4-3.3c-1.6-1.4-6.3-3.6-7.2-4.5c-0.5-0.5-0.6-1.3-0.5-1.8c0-0.6,0-1.3,0.7-1.6c0.9-0.3,2.1-0.2,2.5,0.1
	c0.4,0.3,0.4,0.6,0.5,0.9C-205.5,59.1-205.5,59.9-205.5,59.9z"/>
<polygon class="st2" points="-72.3,135.6 -328.9,135.6 -328.9,137.4 -72.3,137.4 "/>
</svg>`;

describe('container', () => {
  it.only('should put absolute position', () => {

    const width = 595.28;
    const height = 841.89;
    const left = 40;
    const top = 100;
    const right = 40;
    /*
        <Document>
          <Page mediaBox={{ mediaBox: a4 }}>
            <Block style={{ fontFamily: 'Helvetica', fontSize: 12, top, left, position: 'absolute' }}>
              <Block style={{ top }}>
                <Inline>
                  Hello World             2!
                </Inline>
                <Inline>Again</Inline>
              </Block>
            </Block>
          </Page>
        </Document>
    */
    /*
        <Document>
          <Page mediaBox={{ mediaBox: a4 }}>
            <Block style={{ fontFamily: 'Helvetica', fontSize: 12, top, left, position: 'absolute' }}>
              <Block style={{ top }}>
                <Inline>
                  Hello World             2!
                </Inline>
                <Inline>Again</Inline>
              </Block>
            </Block>
          </Page>
        </Document>
    */
    const margins = {
      marginTop: 50,
      marginLeft: 50,
      marginRight: 50,
      marginBottom: 50
    };

    const b = document({},
      page(Object.assign({ mediaBox: a4, style: Object.assign({ border: false, fontFamily: 'Helvetica', fontSize: 12, lineHeight: 1.2, textAlign: 'right' }, margins) }), [
        'VEHICLE CONDITION CHECK',
        block({ style: { border: true } }, [
          //code39({ value: 'VNOX44711', style: { width: 100, height: 20 } })
        ])
        //code39({ value: 'VNOX44711', style: { width: 100, height: 20 } }),
        /*          block({ style: { top: 100, border: false, width: 100, textAlign: 'right' } },
                    ['Hello World              2!', 'Again', ' Or', block({ style: { border: false } }, 'New block')]
                  ), block({ style: { right: 50, border: false } }, 'Aloha')]
                  */
        //rect({ style: { left: 200, top: 100 } })
      ])
    );



    const ctx = {
      width,
      height,
      maxWidth: width,
      maxHeight: height,
      mediaBox: a4,
      ax: 0,
      ay: 0,
      fonts: new Fonts()
    };
    ctx.font = ctx.fonts.add('Helvetica', helvetica);
    // defaults

    const rb = reduce(b, ctx);
    layouter(rb, ctx);
    dumpDom(rb);
    const doc = renderer(rb, ctx);
    const out = [];
    try {
      doc.write((e) => {
        out.push(e);
      });
    } catch (e) {
      console.error(e);
    }
    require('fs').writeFileSync('d:\\temp.pdf', out.join(''));
    //console.log('RES\n', out.join(''));

    //    console.log(b.context);
    //b.props.style.width.should.equal(0);
    //console.log('>>', b.children[0].children[0].context);
    //b.children[0].children[0].context.ax.should.equal(left);
    //b.children[0].children[0].context.ay.should.equal(top);
  });
});

