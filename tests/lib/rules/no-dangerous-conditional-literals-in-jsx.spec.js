const noConditionalLiterals = require('../../../lib/rules/no-dangerous-conditional-literals-in-jsx');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
});

const dangerousConditionalErrors = [{ messageId: 'dangerousConditional' }],
  dangerousLiteralErrors = [{ messageId: 'dangerousLiteral' }];

ruleTester.run(
  'no-dangerous-conditional-literals-in-jsx',
  noConditionalLiterals,
  {
    valid: [
      {
        code: `<div>{conditional && 'string'}</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>{conditional || 'string'}</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>
          {conditional && <span>string</span>}
          {property}
          </div>`,
      },
      // text node followed by conditionally-rendered stuff wrapped in div or span is fine
      {
        code: `<div>text {conditional && <div>wrapped is ok</div>}</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>text {conditional ? <div>wrapped is ok</div> : null}</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        // Logic within an attribute doesn't affect the DOM
        code: `<Avatar alt={conditional && 'string'} />`,
        errors: dangerousConditionalErrors,
      },
      // JSX auto-adds whitespace when there are newlines. Make sure they don't trigger
      {
        code: `<div>
          {conditional && 'string'}
        </div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>
          {conditional ? 'string' : null}
        </div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>
          {conditional && <span>string</span>}
          <p>text</p>
        </div>`,
        errors: dangerousConditionalErrors,
      },
      // conditional dom node not immediately followed by text node is ok
      {
        code: `<div>
        {conditional && <span>string</span>}
        <p>foo</p>
        text
      </div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>
        {conditional || <span>string</span>}
        <p>foo</p>
        text
      </div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>
        {conditional ? <span>string</span> : null}
        <p>foo</p>
        text
      </div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>
        {conditional ? <span>string</span> : undefined}
        <p>foo</p>
        text
      </div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>
        {conditional ? <span>string</span> : false}
        <p>foo</p>
        text
      </div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>
        {conditional ? null : <span>string</span>}
        <p>foo</p>
        text
      </div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>
        {conditional ? undefined : <span>string</span>}
        <p>foo</p>
        text
      </div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>
        {conditional ? false : <span>string</span>}
        <p>foo</p>
        text
      </div>`,
        errors: dangerousConditionalErrors,
      },
    ],
    invalid: [
      // doesn't crash but will stop updating
      {
        code: `<div>{conditional ? 'a' : 'b'} text</div>`,
        errors: dangerousConditionalErrors,
      },
      // text node followed by conditional text node
      {
        code: `<div>text {conditional && 'string'}</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>text {conditional || 'string'}</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>text {conditional ? 'string' : null}</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>text {conditional ? null : 'string'}</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>text {conditional ? 'string' : undefined}</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>text {conditional ? undefined : 'string'}</div>`,
        errors: dangerousConditionalErrors,
      },
      // conditional text node followed by text node
      {
        code: `<div>{conditional && 'string'} text</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>{conditional || 'string'} text</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>{conditional ? 'string' : null} text</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>{conditional ? 'string' : undefined} text</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>{conditional ? 'string' : false} text</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>{conditional ? null: 'string'} text</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>{conditional ? undefined : 'string'} text</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>{conditional ? false : 'string'} text</div>`,
        errors: dangerousConditionalErrors,
      },
      // conditional DOM node followed by text node
      {
        code: `<div>{conditional && <span>string</span>} text</div>`,
        errors: dangerousLiteralErrors,
      },
      {
        code: `<div>{conditional || <span>string</span>} text</div>`,
        errors: dangerousLiteralErrors,
      },
      {
        code: `<div>{conditional ? <span>string</span> : null} text</div>`,
        errors: dangerousLiteralErrors,
      },
      {
        code: `<div>{conditional ? <span>string</span> : undefined} text</div>`,
        errors: dangerousLiteralErrors,
      },
      {
        code: `<div>{conditional ? <span>string</span> : false} text</div>`,
        errors: dangerousLiteralErrors,
      },
      {
        code: `<div>{conditional ? null: <span>string</span>} text</div>`,
        errors: dangerousLiteralErrors,
      },
      {
        code: `<div>{conditional ? undefined : <span>string</span>} text</div>`,
        errors: dangerousLiteralErrors,
      },
      {
        code: `<div>{conditional ? false : <span>string</span>} text</div>`,
        errors: dangerousLiteralErrors,
      },
      {
        code: `<div>
        {conditional && <span>string</span>}
        text
      </div>`,
        errors: dangerousLiteralErrors,
      },
      {
        code: `<div>
        {conditional || <span>string</span>}
        text
      </div>`,
        errors: dangerousLiteralErrors,
      },
      {
        code: `<div>
        {conditional ? <span>string</span> : null}
        text
      </div>`,
        errors: dangerousLiteralErrors,
      },
      {
        code: `<div>
        {conditional ? <span>string</span> : undefined}
        text
      </div>`,
        errors: dangerousLiteralErrors,
      },
      {
        code: `<div>
        {conditional ? <span>string</span> : false}
        text
      </div>`,
        errors: dangerousLiteralErrors,
      },
      {
        code: `<div>
        {conditional ? null: <span>string</span>}
        text
      </div>`,
        errors: dangerousLiteralErrors,
      },
      {
        code: `<div>
        {conditional ? undefined : <span>string</span>}
        text
      </div>`,
        errors: dangerousLiteralErrors,
      },
      {
        code: `<div>
        {conditional ? false : <span>string</span>}
        text
      </div>`,
        errors: dangerousLiteralErrors,
      },
      {
        // More complicated logic
        code: `<div>text {(conditional1 && conditional2) || 'string'}</div>`,
        errors: dangerousConditionalErrors,
      },
      // This results in 2 text nodes with no JSX containers
      {
        code: `<div>{property}{conditional && 'string'}</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>{property}{conditional || 'string'}</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>{property}{conditional ? 'string' : null}</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>{property}{conditional ? 'string' : undefined}</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>{property}{conditional ? 'string' : false}</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>{property}{conditional ? null: 'string'}</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>{property}{conditional ? undefined: 'string'}</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>{property}{conditional ? false: 'string'}</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>{object.property}{conditional && 'string'}</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>{object.property}{conditional || 'string'}</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>{object.property}{conditional ? 'string' : null}</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>{object.property}{conditional ? 'string' : undefined}</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>{object.property}{conditional ? 'string' : false}</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>{object.property}{conditional ? null: 'string'}</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>{object.property}{conditional ? undefined: 'string'}</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div>{object.property}{conditional ? false: 'string'}</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div> {conditional && 'string'}</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div> {conditional || 'string'}</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div> {conditional ? 'string' : null}</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div> {conditional ? 'string' : undefined}</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div> {conditional ? 'string' : false}</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div> {conditional ? null: 'string'}</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div> {conditional ? undefined: 'string'}</div>`,
        errors: dangerousConditionalErrors,
      },
      {
        code: `<div> {conditional ? false: 'string'}</div>`,
        errors: dangerousConditionalErrors,
      },
      // the space is a text node, so it's dangerous
      {
        code: `<div>{conditional && <span>string</span>} <span>text</span></div>`,
        errors: dangerousLiteralErrors,
      },
      {
        code: `<div>{conditional || <span>string</span>} <span>text</span></div>`,
        errors: dangerousLiteralErrors,
      },
      {
        code: `<div>{conditional ? <span>string</span> : null} <span>text</span></div>`,
        errors: dangerousLiteralErrors,
      },
      {
        code: `<div>{conditional ? <span>string</span> : undefined} <span>text</span></div>`,
        errors: dangerousLiteralErrors,
      },
      {
        code: `<div>{conditional ? <span>string</span> : false} <span>text</span></div>`,
        errors: dangerousLiteralErrors,
      },
      {
        code: `<div>{conditional ? null : <span>string</span>} <span>text</span></div>`,
        errors: dangerousLiteralErrors,
      },
      {
        code: `<div>{conditional ? undefined : <span>string</span>} <span>text</span></div>`,
        errors: dangerousLiteralErrors,
      },
      {
        code: `<div>{conditional ? false : <span>string</span>} <span>text</span></div>`,
        errors: dangerousLiteralErrors,
      },
      {
        code: `<div>{conditional && <span>string</span>} </div>`,
        errors: dangerousLiteralErrors,
      },
      {
        code: `<div>{conditional || <span>string</span>} </div>`,
        errors: dangerousLiteralErrors,
      },
      {
        code: `<div>{conditional ? <span>string</span> : null} </div>`,
        errors: dangerousLiteralErrors,
      },
      {
        code: `<div>{conditional ? <span>string</span> : undefined} </div>`,
        errors: dangerousLiteralErrors,
      },
      {
        code: `<div>{conditional ? <span>string</span> : false} </div>`,
        errors: dangerousLiteralErrors,
      },
      {
        code: `<div>{conditional ? null : <span>string</span>} </div>`,
        errors: dangerousLiteralErrors,
      },
      {
        code: `<div>{conditional ? undefined : <span>string</span>} </div>`,
        errors: dangerousLiteralErrors,
      },
      {
        code: `<div>{conditional ? false : <span>string</span>} </div>`,
        errors: dangerousLiteralErrors,
      },
    ],
  }
);
