var assert = require('assert');
var main = require('./index');

// generate linked link with named field
const gen = field => (...args) => args
  .reverse()
  .reduce((next, state) => ({
    [field]: state,
    next
  }), null)
;
const r = gen('state');

describe('life', () => {
  it('prepare cell fx', () => {
    const row1 = r(0, 0);
    const res1 = {
      state: 0,
      save: 0,
      line: 0,
      next: {
        state: 0,
        line: 0,
        save: 0,
        next: null
      }
    };
    assert.deepEqual(main.prepareCell(row1, 0), res1);

    const row2 = r(1, 1);
    const res2 = {
      state: 1,
      save: 1,
      line: 2,
      next: {
        state: 1,
        line: 2,
        save: 1,
        next: null
      }
    };
     assert.deepEqual(main.prepareCell(row2, 0), res2);
  });
  
  it('prepare row fx', () => {
    const pole = gen('row')(
      r(0, 0),
      r(1, 1)
    );
    const res = { 
      row :{
        state: 0,
        save: 0,
        line: 0,
        next: {
          state: 0,
          line: 0,
          save: 0,
          next: null
        }
      },
      next: {
        row: {
          state: 1,
          save: 1,
          line: 2,
          next: {
            state: 1,
            line: 2,
            save: 1,
            next: null
          }
        },
        next: null
      }
    };
    assert.deepEqual(main.prepareRow(pole, null), res);
  });

  it('generate cell fx one line', () => {
    const row1 = main.prepareCell(r(1, 1, 1), 0);
    const res1 = {
      state: 0,
      line: 2,
      save: 1,
      next: {
        state: 1,
        line: 3,
        save: 1,
        next: {
          state: 0,
          line: 2,
          save: 1,
          next: null
        }
      }
    };
    assert.deepEqual(main.generateCell(row1, 0, null, null), res1);

    const row2 = main.prepareCell(r(1, 1, 0, 1), 0);
    const res2 = {
      state: 0,
      line: 2,
      save: 1,
      next: {
        state: 0,
        line: 2,
        save: 1,
        next: {
          state: 0,
          line: 2,
          save: 0,
          next: {
            state: 0,
            line: 1,
            save: 1,
            next: null
          }
        }
      }
    };
    assert.deepEqual(main.generateCell(row2, 0, null, null), res2);
  });

  it('generate cell fx with top', () => {
    const top = {
      line: 2,
      next: {
        line: 2,
        next: {
          line: 2,
          next: {
            line: 1,
            next: null
          }
        }
      }
    };
    const row = main.prepareCell(r(1, 0, 0, 1), 0);
    const res = {
      state: 1,
      line: 1,
      save: 1,
      next: {
        state: 1,
        line: 1,
        save: 0,
        next: {
          state: 1,
          line: 1,
          save: 0,
          next: {
            state: 0,
            line: 1,
            save: 1,
            next: null
          }
        }
      }
    };
    assert.deepEqual(main.generateCell(row, 0, top, null), res);
  });

  it('one row', () => {
    const pole = gen('row')(
      r(0, 1, 1, 1)
    );
    const next = gen('row')(
      r(0, 0, 1, 0)
    );

    assert.deepEqual(main.next(pole), next);
  });

  it('all is work', () => {
    const pole1 = gen('row')(
      r(1, 0, 0, 0, 0, 0),
      r(1, 0, 0, 0, 0, 0),
      r(0, 0, 0, 1, 0, 0),
      r(0, 0, 1, 1, 0, 0),
      r(0, 0, 0, 0, 0, 0)
    );
    const next1 = gen('row')(
      r(0, 0, 0, 0, 0, 0),
      r(0, 0, 0, 0, 0, 0),
      r(0, 0, 1, 1, 0, 0),
      r(0, 0, 1, 1, 0, 0),
      r(0, 0, 0, 0, 0, 0)
    );
    assert.deepEqual(main.next(pole1), next1);

    const pole2 = gen('row')(
      r(0, 0, 0, 0, 0, 1),
      r(0, 0, 0, 0, 0, 0),
      r(0, 1, 1, 1, 0, 0),
      r(0, 0, 0, 0, 0, 0),
      r(0, 0, 0, 0, 0, 1)
    );
    const next2 = gen('row')(
      r(0, 0, 0, 0, 0, 0),
      r(0, 0, 1, 0, 0, 0),
      r(0, 0, 1, 0, 0, 0),
      r(0, 0, 1, 0, 0, 0),
      r(0, 0, 0, 0, 0, 0)
    );
    assert.deepEqual(main.next(pole2), next2);
  });
});

