const canEmptyRender = (n) =>
  (n.type === 'Literal' && !n.value) ||
  (n.type === 'Identifier' && n.name === 'undefined');

module.exports = {
  meta: {
    docs: {
      description:
        'Browser auto-translation will break if pieces of text nodes are rendered conditionally.',
    },
    schema: [],
    messages: {
      dangerousConditional:
        'Conditionally rendered text node with siblings must be wrapped in <div> or <span>',
      dangerousLiteral:
        'Text node is a sibling of conditional expression and must be wrapped in <div> or <span>',
    },
    type: 'problem',
  },
  create: function (context) {
    // referring to the failure cases in https://github.com/facebook/react/issues/11538#issuecomment-390386520
    return {
      // case 1: conditional text node:
      //   {conditional && 'string'}
      //   {conditional ? 'string' : null}
      //   {conditional ? 'string' : foo}
      //   {conditional ? 'string' : 'foo'}
      //   {conditional ? 'string' : <span>string</span>}
      // and it's not the only child
      ':matches(JSXElement, JSXFragment) > JSXExpressionContainer:matches([expression.type="ConditionalExpression"], [expression.type="LogicalExpression"])'(
        node
      ) {
        const { expression, parent } = node;
        const siblingNodes = (parent.children || []).filter(
          (n) =>
            !(
              ['JSXText', 'Literal'].includes(n.type) &&
              // newlines followed by empty string doesn't create a sibling
              !n.value.trim() &&
              n.value.startsWith('\n')
            )
        );

        // only child is fine
        if (siblingNodes.length <= 1) {
          return;
        }

        if (expression.type === 'LogicalExpression') {
          if (expression.right.type === 'Literal') {
            context.report({ node, messageId: 'dangerousConditional' });
          }
        } else {
          if (
            [expression.consequent, expression.alternate].some(
              (n) => n.type === 'Literal' && !!n.value
            )
          ) {
            context.report({ node, messageId: 'dangerousConditional' });
          }
        }
      },
      // case 2: conditionally rendered JSX element followed by text node
      //  <div>
      //    {conditional && <span>text</span>}
      //    text
      //  </div>
      'JSXExpressionContainer:matches([expression.type="LogicalExpression"][expression.right.type="JSXElement"], [expression.type="ConditionalExpression"]) + :matches(Literal, JSXText)'(
        textNode
      ) {
        const index = textNode.parent.children.indexOf(textNode);
        // if empty text starting with newline, it's only dangerous if the following node can become a text node
        if (!textNode.value.trim() && textNode.value.startsWith('\n')) {
          const followingNode = textNode.parent.children[index + 1];
          if (
            !followingNode ||
            followingNode.type !== 'JSXExpressionContainer' ||
            followingNode.expression.type !== 'Literal'
          ) {
            return;
          }
        }
        const expression = textNode.parent.children[index - 1].expression;
        if (expression.type === 'LogicalExpression') {
          if (expression.right.type === 'JSXElement') {
            context.report({ node: textNode, messageId: 'dangerousLiteral' });
          }
        } else {
          const operandExpressions = [
            expression.consequent,
            expression.alternate,
          ];
          if (
            operandExpressions.some((n) => n.type === 'JSXElement') &&
            operandExpressions.some(canEmptyRender)
          ) {
            context.report({ node: textNode, messageId: 'dangerousLiteral' });
          }
        }
      },
    };
  },
};
