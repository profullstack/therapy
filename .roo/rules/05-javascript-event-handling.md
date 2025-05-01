# JavaScript Event Handling Rules

## Event Binding

- Always use `addEventListener` for binding events instead of inline attributes or property assignments
- Never use inline event attributes in HTML (e.g., `onclick`, `onchange`)
- Never use direct property assignments (e.g., `element.onclick = function() {}`)
- Always use event delegation for dynamically created elements

## Examples

### ❌ Avoid: Inline HTML event attributes

```html
<button onclick="handleClick()">Click me</button>
```

### ❌ Avoid: Direct property assignment

```javascript
document.getElementById('button').onclick = function() {
  // handle click
};
```

### ✅ Correct: Using addEventListener

```javascript
document.getElementById('button').addEventListener('click', function() {
  // handle click
});
```

### ✅ Correct: Using event delegation

```javascript
document.querySelector('.container').addEventListener('click', function(event) {
  if (event.target.matches('.button')) {
    // handle click on any .button element, even if added dynamically
  }
});
```

## Benefits

- Allows attaching multiple event handlers to a single element
- Provides more control over event propagation (capture/bubble phases)
- Supports event delegation for dynamically created elements
- Keeps separation of concerns between HTML and JavaScript
- Makes code more maintainable and easier to debug
- Follows modern JavaScript best practices