# Router Transition Rules

## General Principles
- Avoid unnecessary workarounds or hacks to fix problems
- Implement proper solutions that address the root cause
- Maintain clean DOM structure during transitions
- Ensure theme consistency throughout the transition process

## SPA Router Transitions
- Use clean DOM replacement after transitions complete
- Prevent content leakage between routes
- Maintain proper styling during transitions
- Ensure smooth user experience with appropriate fade effects

## DOM Manipulation
- Avoid moving DOM elements during transitions
- Prefer complete replacement of content when transitions complete
- Use proper containment to prevent content leakage
- Ensure proper cleanup of transition elements
- Use display: none/block instead of opacity for complete isolation
- Prepare new DOM with display: none before removing old DOM
- Use a full-screen overlay with fade transitions during route changes
- Apply smooth fade-in/fade-out effects to minimize visual disruption
- Use an initial loading overlay in index.html to prevent flashes of unstyled content
- Move route-specific content to web components to prevent hardcoded content flashes
- Implement a global click handler that works with Shadow DOM to intercept all internal links

## Styling During Transitions
- Maintain consistent theme colors during transitions
- Use proper z-indexing for transition layers
- Ensure text remains properly styled throughout transitions
- Prevent flashes of unstyled content