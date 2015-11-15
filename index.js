/* eslint one-var: 0 */
const clean = field => obj => {
  if (!obj) return null;

  return {
    [field]: obj[field],
    next: clean(field)(obj.next)
  };
}

function isLife(sum, curr) {
  return sum + curr === 3 ? 1 : (sum + curr === 4 ? curr : 0);
}

export function prepareCell(curr, prev) {
  if (!curr) return null;

  const _next = prepareCell(curr.next, curr.state);
  const _save = _next ? _next.save : 0;

  return {
    state: curr.state,
    next: _next,
    save: curr.state,
    line: prev + _save + curr.state
  };
}

export function prepareRow(curr, prev) {
  if (!curr) return null;

  const _cell = prepareCell(curr.row, 0);
  const _next = prepareRow(curr.next, _cell);

  return {
    row: _cell,
    next: _next,
  };
}

export function generateCell(curr, prev, top, bottom) {
  if (!curr) return null;
  
  const _top = top ? top.next : null;
  const _bottom = bottom ? bottom.next : null;

  const _next = generateCell(curr.next, curr.state, _top, _bottom);
  const _save = _next ? _next.save : 0;

  const _tLine = top ? top.line : 0;
  const _bLine = bottom ? bottom.line : 0;
  const _sum = _tLine + prev + _save + _bLine;

  return {
    state: isLife(_sum, curr.state),
    next: _next,
    line: curr.line,
    save: curr.state
  };
}

export function generateRow(curr, top) {
  if (!curr) return null;

  const bottom = curr.next ? curr.next.row : null;

  const _cell = generateCell(curr.row, 0, top, bottom);
  const _next = generateRow(curr.next, _cell);

  return {
    row: clean('state')(_cell),
    next: _next,
  };
}

export function next(end) {
  const _end = prepareRow(end, null);
  return clean('row')(generateRow(_end));
}

