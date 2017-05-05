const npec = {
  A: 7, a: 7, C: 6, c: 6, H: 1, h: 1, L: 2, l: 2, M: 2, m: 2, Q: 4, q: 4, S: 4, s: 4, T: 2, t: 2, V: 1, v: 1, Z: 0, z: 0
};

const collect = (str, p) => {
  let result = [];
  let match;
  while ((match = p.exec(str)) !== null) {
    result.push(match);
  }
  return result;
};

const process = (cmd, args, gfx) => {
  const n = npec[cmd];
  if (args.length !== n) {
    throw new Error(cmd + ' ' + args);
  }
  if (cmd && gfx[cmd]) {
    gfx[cmd](...args);
  } else {
    console.log('Skipping ', cmd, ...args);
  }
};

export default function pathParser(pathDef, gfx) {
  const cmdPattern = /([astvzqmhlcASTVZQMHLC])((?:[\s,-]*\d+(?:\.\d+)?)+)*/g;
  collect(pathDef, cmdPattern).forEach(cmd => {
    const c = cmd[1];
    const nDef = cmd[2];
    const args = collect(nDef, /(-?\d+(?:\.\d+)?)/g).map(arg => parseFloat(arg[1], 10));
    process(c, args, gfx);
  });
}