'use strict';
// Pure Node export QA. No browser automation, network request or OS download.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const toolchain = process.env.LOCAL_DEPENDENCIES;
const esbuild = require(path.join(toolchain, 'esbuild'));
const Q = path.resolve(__dirname, '..');
const ENTRY = path.resolve(process.env.ENTRY || path.join(Q, 'examples/palette-packet.ts'));
const REPORT_PATH = path.resolve(process.env.REPORT_PATH || path.join(Q, 'qa/palette-packet.json'));
const inputPaths = [ENTRY, __filename, path.join(Q, 'examples/styles.d.ts'), path.join(Q, 'reference/CONTRACT.md')];
const sha = (value) => crypto.createHash('sha256').update(value).digest('hex');
const snapshot = () => Object.fromEntries(inputPaths.map((file) => [file, sha(fs.readFileSync(file))]));
const inputsBefore = snapshot();
const tests = [];
const test = (name, run) => tests.push({ name, run });
let api;
let checkedConfigurations = 0;
let checkedArchives = 0;
let checkedEntries = 0;
const allSections = ['swatches', 'tokens', 'contrast', 'metadata'];
const allFormats = ['html', 'json', 'css', 'csv', 'svg'];
const palette = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#777777', '#FF0000'];
const settings = { sections: allSections, formats: allFormats };
const subsets = (values) => Array.from({ length: 2 ** values.length - 1 }, (_, index) => values.filter((_, bit) => (index + 1) & (1 << bit)));
const makeForm = (sections = ['swatches'], formats = ['json']) => {
  const form = new FormData();
  for (const section of sections) form.append('sections', section);
  for (const format of formats) form.append('formats', format);
  return form;
};

// Independent table CRC and Buffer-based ZIP reader; never uses the encoder's code.
const crcTable = Array.from({ length: 256 }, (_, index) => {
  let crc = index;
  for (let bit = 0; bit < 8; bit += 1) crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
  return crc >>> 0;
});
function checksum(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
assert.equal(checksum(Buffer.from('123456789')), 0xcbf43926, 'independent CRC known vector');

function readZip(packet) {
  const buffer = Buffer.from(packet.bytes);
  const end = buffer.length - 22;
  assert.ok(end > 0);
  assert.equal(buffer.readUInt32LE(end), 0x06054b50, 'EOCD signature');
  assert.equal(buffer.readUInt16LE(end + 4), 0, 'single disk');
  assert.equal(buffer.readUInt16LE(end + 6), 0, 'central disk');
  assert.equal(buffer.readUInt16LE(end + 8), packet.files.length);
  assert.equal(buffer.readUInt16LE(end + 10), packet.files.length);
  assert.equal(buffer.readUInt16LE(end + 20), 0, 'no ZIP comment');
  const centralSize = buffer.readUInt32LE(end + 12);
  const centralOffset = buffer.readUInt32LE(end + 16);
  assert.equal(centralOffset + centralSize, end, 'central bounds');
  let centralCursor = centralOffset;
  let localCursor = 0;
  const entries = [];
  for (const expected of packet.files) {
    const c = centralCursor;
    assert.equal(buffer.readUInt32LE(c), 0x02014b50);
    assert.equal(buffer.readUInt16LE(c + 4), 20);
    assert.equal(buffer.readUInt16LE(c + 6), 20);
    assert.equal(buffer.readUInt16LE(c + 8), 0x0800, 'UTF-8 without data descriptor');
    assert.equal(buffer.readUInt16LE(c + 10), 0, 'stored compression');
    assert.equal(buffer.readUInt16LE(c + 12), 0, 'deterministic DOS time');
    assert.equal(buffer.readUInt16LE(c + 14), 33, '1980-01-01 DOS date');
    const crc = buffer.readUInt32LE(c + 16);
    const compressed = buffer.readUInt32LE(c + 20);
    const size = buffer.readUInt32LE(c + 24);
    const nameSize = buffer.readUInt16LE(c + 28);
    assert.equal(buffer.readUInt16LE(c + 30), 0, 'no central extra field');
    assert.equal(buffer.readUInt16LE(c + 32), 0, 'no entry comment');
    assert.equal(buffer.readUInt16LE(c + 34), 0, 'entry on disk zero');
    assert.equal(buffer.readUInt16LE(c + 36), 0, 'no internal attrs');
    assert.equal(buffer.readUInt32LE(c + 38), 0, 'no external attrs');
    assert.equal(buffer.readUInt32LE(c + 42), localCursor, 'exact local offset');
    const name = buffer.subarray(c + 46, c + 46 + nameSize).toString('utf8');
    assert.equal(name, expected.name);
    assert.match(name, /^palette\.(html|json|css|csv|svg)$/);
    assert.equal(compressed, size);
    const l = localCursor;
    assert.equal(buffer.readUInt32LE(l), 0x04034b50);
    assert.equal(buffer.readUInt16LE(l + 4), 20);
    assert.equal(buffer.readUInt16LE(l + 6), 0x0800);
    assert.equal(buffer.readUInt16LE(l + 8), 0);
    assert.equal(buffer.readUInt16LE(l + 10), 0);
    assert.equal(buffer.readUInt16LE(l + 12), 33);
    assert.equal(buffer.readUInt32LE(l + 14), crc);
    assert.equal(buffer.readUInt32LE(l + 18), size);
    assert.equal(buffer.readUInt32LE(l + 22), size);
    assert.equal(buffer.readUInt16LE(l + 26), nameSize);
    assert.equal(buffer.readUInt16LE(l + 28), 0);
    assert.equal(buffer.subarray(l + 30, l + 30 + nameSize).toString('utf8'), name);
    const payloadStart = l + 30 + nameSize;
    const payload = buffer.subarray(payloadStart, payloadStart + size);
    assert.equal(payload.length, size);
    assert.equal(checksum(payload), crc, `CRC for ${name}`);
    assert.deepEqual(payload, Buffer.from(expected.bytes), `exact file bytes for ${name}`);
    assert.deepEqual(payload, Buffer.from(expected.text, 'utf8'), `UTF-8 text for ${name}`);
    entries.push({ name, text: payload.toString('utf8'), crc, bytes: size });
    centralCursor += 46 + nameSize;
    localCursor = payloadStart + size;
  }
  assert.equal(localCursor, centralOffset, 'no local gaps or trailing entry');
  assert.equal(centralCursor, end, 'no central gaps or trailing entry');
  checkedArchives += 1;
  checkedEntries += entries.length;
  return entries;
}

// Strict independent RFC 4180 parser, including doubled quotes and CRLF.
function readCsv(text) {
  const rows = [];
  let cursor = 0;
  while (cursor < text.length) {
    const row = [];
    while (true) {
      assert.equal(text[cursor++], '"');
      let cell = '';
      while (true) {
        assert.ok(cursor < text.length, 'terminated CSV cell');
        const char = text[cursor++];
        if (char !== '"') { cell += char; continue; }
        if (text[cursor] === '"') { cell += '"'; cursor += 1; continue; }
        break;
      }
      row.push(cell);
      if (text[cursor] === ',') { cursor += 1; continue; }
      assert.equal(text.slice(cursor, cursor + 2), '\r\n');
      cursor += 2;
      break;
    }
    rows.push(row);
  }
  assert.deepEqual(rows.shift(), ['section', 'record', 'field', 'type', 'value']);
  assert.ok(rows.length > 0);
  for (const row of rows) {
    assert.equal(row.length, 5);
    assert.ok(allSections.includes(row[0]));
    assert.match(row[1], /^[1-9]\d*$/);
    assert.ok(['string', 'number', 'boolean', 'array'].includes(row[3]));
    if (row[3] === 'number') assert.ok(Number.isFinite(Number(row[4])));
    if (row[3] === 'boolean') assert.ok(['true', 'false'].includes(row[4]));
    if (row[3] === 'array') assert.ok(Array.isArray(JSON.parse(row[4])));
  }
  return rows;
}

function verifyContent(file, sections, colors) {
  const format = file.name.split('.').pop();
  assert.ok(file.text.length > 60, 'substantive file content');
  assert.ok(file.bytes instanceof Uint8Array);
  assert.ok(!/<script\b|javascript:|\bon\w+\s*=|https?:\/\//i.test(file.text.replace('http://www.w3.org/2000/svg', '')), 'no active or remote resources');
  let foundSections;
  if (format === 'json') {
    const object = JSON.parse(file.text);
    foundSections = Object.keys(object);
    for (const section of sections) {
      if (section === 'metadata') {
        assert.deepEqual(object.metadata.colors, colors);
        assert.equal(object.metadata.colorCount, colors.length);
        assert.equal(object.metadata.uniqueColorCount, new Set(colors).size);
      } else {
        assert.equal(object[section].length, colors.length);
        const key = section === 'tokens' ? 'value' : 'hex';
        assert.deepEqual(object[section].map((record) => record[key]), colors);
      }
    }
  } else if (format === 'html' || format === 'svg') {
    foundSections = [...file.text.matchAll(/data-section="([a-z]+)"/g)].map((match) => match[1]);
    assert.ok(file.text.includes(format === 'html' ? '<!doctype html>' : '<svg xmlns='));
    for (const color of colors) assert.ok(file.text.includes(color));
  } else if (format === 'css') {
    foundSections = [...file.text.matchAll(/\/\* section:([a-z]+) \*\//g)].map((match) => match[1]);
    assert.ok(file.text.includes(':root {'));
    for (const color of colors) assert.ok(file.text.includes(color));
  } else if (format === 'csv') {
    const rows = readCsv(file.text);
    foundSections = [...new Set(rows.map((row) => row[0]))];
    for (const color of colors) assert.ok(rows.some((row) => row[4].includes(color)));
  } else assert.fail(`Unknown generated format ${format}`);
  assert.deepEqual(foundSections, sections, `${format} includes exactly selected sections in requested order`);
}

test('options and canonical colors retain dense duplicate order', () => {
  assert.deepEqual(api.sectionOptions.map((option) => option.value), allSections);
  assert.deepEqual(api.formatOptions.map((option) => option.value), allFormats);
  assert.ok(Object.isFrozen(api.sectionOptions) && Object.isFrozen(api.formatOptions));
  for (const option of [...api.sectionOptions, ...api.formatOptions]) {
    assert.deepEqual(Object.keys(option), ['value', 'label']);
    assert.equal(typeof option.label, 'string');
    assert.ok(option.label.length > 0 && Object.isFrozen(option));
  }
  const input = ['#abCdef', '#000000', '#ABCDEF'];
  const output = api.canonicalizePaletteColors(input);
  assert.deepEqual(output, ['#ABCDEF', '#000000', '#ABCDEF']);
  assert.deepEqual(input, ['#abCdef', '#000000', '#ABCDEF']);
  assert.notEqual(output, input);
  assert.ok(Object.isFrozen(output));
  class OverriddenArray extends Array {
    map() { throw Error('Do not call input map'); }
    *[Symbol.iterator]() { throw Error('Do not call input iterator'); }
  }
  assert.deepEqual(api.canonicalizePaletteColors(new OverriddenArray('#abcdef')), ['#ABCDEF']);
  assert.deepEqual(api.buildPalettePacket(['#123456'], { sections: new OverriddenArray('swatches'), formats: new OverriddenArray('json') }).sections, ['swatches']);
});

test('all 465 configurations with 1 and 24 colors produce deterministic interoperable ZIPs', () => {
  const golden = api.buildPalettePacket(['#000000'], { sections: ['tokens'], formats: ['json'] });
  assert.equal(sha(golden.bytes), 'c09dec206c2206edfc5bbc722c05a7e805ba3342217954d86151aefc8f4ac285', 'fixed stored-ZIP byte fixture');
  const filenames = new Set();
  const palettes = [['#aBcDef'], Array.from({ length: 24 }, (_, index) => `#${(index * 659483 % 0x1000000).toString(16).padStart(6, '0')}`)];
  for (const sections of subsets(allSections)) for (const formats of subsets(allFormats)) {
    checkedConfigurations += 1;
    let configurationFilename;
    for (const colors of palettes) {
      const form = makeForm(sections, formats);
      const selected = api.parsePacketFormData(form);
      assert.deepEqual(selected, { sections, formats });
      const packet = api.buildPalettePacket(colors, selected);
      const expectedColors = colors.map((color) => color.toUpperCase());
      assert.deepEqual(packet.sections, sections);
      assert.deepEqual(packet.formats, formats);
      assert.deepEqual(packet.colors, expectedColors);
      assert.deepEqual(packet.files.map((file) => file.name), formats.map((format) => `palette.${format}`));
      assert.match(packet.filename, /^palette-packet-[a-z-]+\.zip$/);
      assert.ok(packet.filename.length <= 110);
      if (configurationFilename) assert.equal(packet.filename, configurationFilename);
      configurationFilename = packet.filename;
      assert.deepEqual(packet.bytes, api.buildPalettePacket(colors, selected).bytes, 'deterministic bytes');
      assert.deepEqual(readZip(packet).map((entry) => entry.name), packet.files.map((file) => file.name));
      packet.files.forEach((file) => verifyContent(file, sections, expectedColors));
    }
    assert.ok(!filenames.has(configurationFilename), 'different settings have distinct filenames');
    filenames.add(configurationFilename);
  }
  assert.equal(checkedConfigurations, 465);
  assert.equal(filenames.size, 465);
});

test('all formats contain meaningful section data and parse independently', () => {
  const { JSDOM } = require(path.join(toolchain, 'jsdom'));
  const css = require(path.join(toolchain, 'css-tree'));
  for (const sections of [...allSections.map((section) => [section]), allSections]) {
    const packet = api.buildPalettePacket(palette, { sections, formats: allFormats });
    readZip(packet);
    for (const file of packet.files) {
      verifyContent(file, sections, palette);
      const changed = api.buildPalettePacket(['#123456'], { sections, formats: [file.name.split('.').pop()] });
      assert.notEqual(file.text, changed.files[0].text, 'palette affects every section and format');
      if (file.name === 'palette.html' || file.name === 'palette.svg') {
        const svg = file.name.endsWith('svg');
        const dom = new JSDOM(file.text, svg ? { contentType: 'image/svg+xml' } : {});
        try {
          const doc = dom.window.document;
          assert.equal(doc.querySelector('parsererror'), null);
          assert.equal(doc.querySelectorAll('script,iframe,object,embed,link,img,image,audio,video,foreignObject').length, 0);
          assert.deepEqual([...doc.querySelectorAll('[data-section]')].map((element) => element.getAttribute('data-section')), sections);
          for (const element of doc.querySelectorAll('*')) for (const attr of element.attributes) {
            assert.ok(!/^on/i.test(attr.name));
            assert.ok(!['href', 'src', 'xlink:href'].includes(attr.name));
          }
          if (svg) {
            assert.equal(doc.documentElement.namespaceURI, 'http://www.w3.org/2000/svg');
            const height = Number(doc.documentElement.getAttribute('height'));
            for (const text of doc.querySelectorAll('text')) assert.ok(Number(text.getAttribute('y')) < height);
            if (sections.includes('swatches')) {
              const group = doc.querySelector('[data-section="swatches"]');
              const rectangles = [...group.querySelectorAll('rect')];
              const rows = [...group.querySelectorAll('text')].slice(1);
              assert.equal(rectangles.length, palette.length);
              rectangles.forEach((rect, index) => assert.equal(Number(rows[index].getAttribute('y')), Number(rect.getAttribute('y')) + 18));
            }
          } else {
            assert.equal(doc.documentElement.lang, 'en');
            assert.equal(doc.querySelector('title').textContent, 'Palette Packet');
          }
        } finally { dom.window.close(); }
      } else if (file.name === 'palette.css') {
        const ast = css.parse(file.text, { parseCustomProperty: true, onParseError: (error) => { throw error; } });
        let declarations = 0;
        css.walk(ast, (node) => {
          assert.notEqual(node.type, 'Atrule');
          assert.notEqual(node.type, 'Url');
          if (node.type === 'Declaration') { declarations += 1; assert.match(node.property, /^--(?:palette|swatch|contrast)-[\da-z-]+$/); }
        });
        assert.ok(declarations > 0);
      }
    }
  }
});

test('known contrast vectors and threshold semantics', () => {
  const file = api.buildPalettePacket(palette, { sections: ['contrast'], formats: ['json'] }).files[0];
  const records = JSON.parse(file.text).contrast;
  const expected = [
    [0, 1, 21, '#FFFFFF', 21, true],
    [1, 21, 1, '#000000', 21, true],
    [0.2126, 5.252, 3.9985, '#000000', 5.252, false],
    [0.7152, 15.304, 1.3722, '#000000', 15.304, true],
    [0.0722, 2.444, 8.5925, '#FFFFFF', 8.5925, true],
    [0.184475, 4.6895, 4.4781, '#000000', 4.6895, false],
    [0.2126, 5.252, 3.9985, '#000000', 5.252, false],
  ];
  records.forEach((record, index) => {
    const [luminance, black, white, text, ratio, aaa] = expected[index];
    assert.equal(record.hex, palette[index]);
    assert.equal(record.luminance, luminance);
    assert.equal(record.againstBlack, black);
    assert.equal(record.againstWhite, white);
    assert.equal(record.recommendedText, text);
    assert.equal(record.contrastRatio, ratio);
    assert.equal(record.normalTextAA, true);
    assert.equal(record.normalTextAAA, aaa);
  });
});

test('requested order, snapshots, native DOM form order and duplicate colors', () => {
  const sections = ['metadata', 'contrast', 'tokens', 'swatches'];
  const formats = ['svg', 'csv', 'css', 'json', 'html'];
  const form = new FormData();
  form.append('formats', 'svg');
  sections.forEach((section) => form.append('sections', section));
  formats.slice(1).forEach((format) => form.append('formats', format));
  const selected = api.parsePacketFormData(form);
  assert.deepEqual(selected, { sections, formats });
  const colors = ['#abcdef', '#123456', '#abcdef'];
  const packet = api.buildPalettePacket(colors, { sections, formats });
  packet.files.forEach((file) => verifyContent(file, sections, ['#ABCDEF', '#123456', '#ABCDEF']));
  readZip(packet);
  colors[0] = '#000000'; sections.reverse(); formats.reverse(); form.set('sections', 'tokens');
  assert.equal(packet.colors[0], '#ABCDEF');
  assert.equal(packet.sections[0], 'metadata');
  assert.equal(packet.formats[0], 'svg');
  assert.equal(selected.sections[0], 'metadata');
  for (const value of [packet, packet.colors, packet.sections, packet.formats, packet.files, ...packet.files]) assert.ok(Object.isFrozen(value));
  const { JSDOM } = require(path.join(toolchain, 'jsdom'));
  const dom = new JSDOM('<form><select multiple name="sections"><option value="swatches">Swatches</option><option value="tokens">Tokens</option><option value="contrast">Contrast</option><option value="metadata">Metadata</option></select><select multiple name="formats"><option value="html">HTML</option><option value="json">JSON</option><option value="css">CSS</option><option value="csv">CSV</option><option value="svg">SVG</option></select></form>');
  try {
    const doc = dom.window.document;
    // Selection happens in reverse order; successful fields still follow DOM order.
    for (const value of ['metadata', 'tokens', 'swatches', 'svg', 'css', 'html']) doc.querySelector(`option[value="${value}"]`).selected = true;
    const native = new dom.window.FormData(doc.querySelector('form'));
    const transferred = new FormData();
    for (const [key, value] of native) transferred.append(key, value);
    assert.deepEqual(api.parsePacketFormData(transferred), { sections: ['swatches', 'tokens', 'metadata'], formats: ['html', 'css', 'svg'] });
  } finally { dom.window.close(); }
});

test('invalid color arrays reject sparse inherited type range and unknown fields', () => {
  const sparse = new Array(1);
  const inherited = new Array(1); Object.setPrototypeOf(inherited, Object.assign(Object.create(Array.prototype), { 0: '#000000' }));
  const extra = ['#000000']; extra.unknown = true;
  const symbol = ['#000000']; symbol[Symbol('unknown')] = true;
  const hidden = ['#000000']; Object.defineProperty(hidden, 'unknown', { value: true });
  const accessor = ['#000000']; Object.defineProperty(accessor, '0', { get() { throw Error('Do not call getter'); } });
  const values = [undefined, null, {}, '', '#000000', new Set(['#000000']), [], sparse, inherited, extra, symbol, hidden, accessor,
    Array(25).fill('#000000'), ['#fff'], ['000000'], ['#1234567'], ['#GGGGGG'], [' #000000'], ['#000000\n'], [''], [0], [null], [undefined], [new String('#000000')], [new Blob(['#000000'])], ['<script>'], ['#000000', , '#FFFFFF']];
  for (const value of values) {
    assert.throws(() => api.canonicalizePaletteColors(value), TypeError);
    assert.throws(() => api.buildPalettePacket(value, settings), TypeError);
  }
});

test('invalid settings reject sparse inherited unknown duplicate and nonstring values', () => {
  const badValues = [undefined, null, {}, '', new Set(), [], new Array(1), [''], [null], [0], [undefined], [new String('swatches')], [new Blob(['swatches'])]];
  for (const key of ['sections', 'formats']) {
    const valid = key === 'sections' ? 'swatches' : 'json';
    const inherited = new Array(1); Object.setPrototypeOf(inherited, Object.assign(Object.create(Array.prototype), { 0: valid }));
    const extra = [valid]; extra.unknown = 1;
    const symbol = [valid]; symbol[Symbol('unknown')] = true;
    for (const value of [...badValues, inherited, extra, symbol, [valid, valid], [valid, 'unknown'], [valid, , valid], [valid.toUpperCase()], [` ${valid}`]]) {
      assert.throws(() => api.buildPalettePacket(['#000000'], { sections: ['swatches'], formats: ['json'], [key]: value }), TypeError);
    }
  }
  const base = { sections: ['swatches'], formats: ['json'] };
  const symbol = { ...base, [Symbol('unknown')]: true };
  const inherited = Object.create(base);
  const hidden = { ...base }; Object.defineProperty(hidden, 'unknown', { value: true });
  const accessor = { ...base }; Object.defineProperty(accessor, 'sections', { get() { throw Error('Do not call getter'); } });
  for (const value of [undefined, null, 1, '', [], new Date(), {}, { sections: ['swatches'] }, { formats: ['json'] }, { ...base, unknown: true }, symbol, inherited, hidden, accessor]) {
    assert.throws(() => api.buildPalettePacket(['#000000'], value), TypeError);
  }
  assert.doesNotThrow(() => api.buildPalettePacket(['#000000'], Object.assign(Object.create(null), base)));
});

test('FormData rejects missing duplicate unknown Blob and fake fields without filtering', () => {
  for (const form of [new FormData(), makeForm([], ['json']), makeForm(['swatches'], []), makeForm(['swatches', 'swatches']), makeForm(['swatches'], ['json', 'json']), makeForm(['Swatches']), makeForm(['swatches'], ['JSON']), makeForm(['unknown']), makeForm(['swatches'], ['unknown']), makeForm(['']), makeForm(['swatches'], [''])]) {
    assert.throws(() => api.parsePacketFormData(form), TypeError);
  }
  for (const key of ['unknown', 'colors', 'section', 'format', 'submit', '__proto__']) {
    const form = makeForm(); form.append(key, 'value');
    assert.throws(() => api.parsePacketFormData(form), TypeError);
  }
  for (const key of ['sections', 'formats']) {
    const form = makeForm(); form.append(key, new Blob(['swatches'], { type: 'text/plain' }), 'entry.txt');
    assert.throws(() => api.parsePacketFormData(form), TypeError);
  }
  for (const value of [undefined, null, {}, [], { entries: () => [['sections', 'swatches'], ['formats', 'json']][Symbol.iterator]() }]) {
    assert.throws(() => api.parsePacketFormData(value), TypeError);
  }
  const form = makeForm(); form.entries = () => { throw Error('Do not trust overridden iterator'); };
  assert.deepEqual(api.parsePacketFormData(form), { sections: ['swatches'], formats: ['json'] });
});

const report = { suite: 'palette-packet', entry: ENTRY, entryShaBefore: inputsBefore[ENTRY], inputsShaBefore: inputsBefore,
  filter: process.env.FILTER || null, tests: [], status: 'failed', coverage: {}, limitations: ['Pure Node/JSDOM parsing only; no real browser interaction, OS download, device or assistive-technology verification.'] };
let temporary;
try {
  const filter = process.env.FILTER ? new RegExp(process.env.FILTER, 'i') : null;
  const selected = tests.filter((item) => !filter || filter.test(item.name));
  assert.ok(selected.length > 0, `FILTER matched no tests: ${process.env.FILTER}`);
  temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'wix68-packet-tests-'));
  const output = path.join(temporary, 'palette-packet.cjs');
  esbuild.buildSync({ entryPoints: [ENTRY], outfile: output, bundle: true, platform: 'node', format: 'cjs', target: 'node22', logLevel: 'silent' });
  api = require(output);
  for (const item of selected) {
    const start = performance.now();
    try { item.run(); report.tests.push({ name: item.name, status: 'passed', milliseconds: Math.round(performance.now() - start) }); }
    catch (error) { report.tests.push({ name: item.name, status: 'failed', message: String(error.stack || error) }); }
  }
  if (report.tests.some((item) => item.status === 'failed')) throw Error('One or more tests failed.');
  report.status = 'passed';
} catch (error) {
  report.error = String(error.stack || error);
  process.exitCode = 1;
} finally {
  if (temporary) fs.rmSync(temporary, { recursive: true, force: true });
  report.inputsShaAfter = snapshot();
  report.entryShaAfter = report.inputsShaAfter[ENTRY];
  report.sourceUnchanged = JSON.stringify(report.inputsShaBefore) === JSON.stringify(report.inputsShaAfter);
  if (!report.sourceUnchanged) { report.status = 'failed'; report.error = 'Source inputs changed during test execution.'; process.exitCode = 1; }
  report.coverage = { selectedTests: report.tests.length, availableTests: tests.length, configurations: checkedConfigurations, archives: checkedArchives, zipEntries: checkedEntries };
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ status: report.status, ...report.coverage, entryShaBefore: report.entryShaBefore, entryShaAfter: report.entryShaAfter, sourceUnchanged: report.sourceUnchanged, report: REPORT_PATH }));
  for (const item of report.tests.filter((item) => item.status === 'failed')) console.error(item.name + '\n' + item.message);
  if (report.error) console.error(report.error);
}
