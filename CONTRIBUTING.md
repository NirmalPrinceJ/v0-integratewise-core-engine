# Contributing to Customer Zero

## Code Standards

### TypeScript Requirements

All code must be written in TypeScript with strict mode enabled.

```typescript
// ✅ Good
interface Props {
  name: string
  isActive: boolean
  onSubmit: (data: FormData) => Promise<void>
}

export function MyComponent({ name, isActive, onSubmit }: Props) {
  // implementation
}

// ❌ Bad - No types
export function MyComponent({ name, isActive, onSubmit }) {
  // implementation
}
```

### Component Structure

Components should follow this structure:

```typescript
'use client'

import { ReactNode, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'

/**
 * Component description and purpose
 */
interface Props {
  title: string
  children: ReactNode
}

export function MyComponent({ title, children }: Props) {
  // Hooks first
  const memoValue = useMemo(() => {
    // expensive computation
  }, [])

  // Callbacks
  const handleClick = useCallback(() => {
    // handler logic
  }, [])

  // JSX
  return (
    <div>
      <h2>{title}</h2>
      {children}
      <Button onClick={handleClick}>Click me</Button>
    </div>
  )
}
```

### Naming Conventions

- **Components**: PascalCase (`CommandCenterView`, `ErrorBoundary`)
- **Hooks**: camelCase prefixed with `use` (`useGateway`, `useWorkbench`)
- **Functions**: camelCase (`formatDate`, `validateEmail`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`, `API_TIMEOUT`)
- **Types**: PascalCase (`CommandCenterState`, `ApiResponse`)

### Accessibility Requirements

All interactive elements must be accessible:

```typescript
// ✅ Good - Proper ARIA labels and semantic HTML
<button
  onClick={handleClick}
  aria-label="Store in Spine"
  disabled={isLoading}
>
  <Database className="w-5 h-5" aria-hidden="true" />
  Store
</button>

// ❌ Bad - No labels, using divs
<div onClick={handleClick} className="cursor-pointer">
  <Database className="w-5 h-5" />
  Store
</div>
```

### Error Handling

All async operations must handle errors gracefully:

```typescript
// ✅ Good - Try/catch with error logging
const handleSubmit = async () => {
  try {
    setIsLoading(true)
    const result = await api.submit(data)
    logger.info('Submission successful', { result })
  } catch (error) {
    logger.error('Submission failed', error)
    setError('Failed to submit. Please try again.')
  } finally {
    setIsLoading(false)
  }
}

// ❌ Bad - No error handling
const handleSubmit = async () => {
  const result = await api.submit(data)
  console.log(result)
}
```

### Logging

Use the enterprise logger instead of console:

```typescript
import { logger } from '@/lib/utils/logger'

// ✅ Good
logger.info('User logged in', { userId: user.id })
logger.error('API call failed', error, { endpoint: '/api/data' })
logger.warn('High memory usage detected', { usage: 85 })
logger.debug('Rendering component', { props })

// ❌ Bad
console.log('User logged in')
console.error(error)
alert('Something went wrong')
```

## Git Workflow

### Branch Naming

- Feature: `feature/feature-name`
- Bug fix: `fix/bug-name`
- Refactor: `refactor/component-name`
- Docs: `docs/what-was-documented`

Example:
```bash
git checkout -b feature/add-twin-modal
git checkout -b fix/account-grid-responsive
```

### Commit Messages

Use clear, descriptive commit messages:

```
# ✅ Good
feat: add twin modal for asking questions
fix: responsive account grid on mobile devices
docs: update API integration guide
refactor: extract alert component into separate file

# ❌ Bad
update code
fixed bug
changes
wip
```

### Pull Request Template

```markdown
## Description
Describe what this PR does.

## Related Issue
Closes #123

## Type of Change
- [ ] Feature
- [ ] Bug Fix
- [ ] Refactor
- [ ] Documentation

## Testing
Describe how you tested this change.

## Accessibility
- [ ] Checked WCAG AA compliance
- [ ] Added ARIA labels
- [ ] Tested keyboard navigation

## Performance
- [ ] No unnecessary re-renders
- [ ] Proper memoization
- [ ] No console errors/warnings
```

## Code Review Checklist

Before requesting a review, ensure:

- [ ] TypeScript strict mode passes (no type errors)
- [ ] No console.log or debug code left
- [ ] All functions have JSDoc comments
- [ ] Accessibility requirements met
- [ ] Mobile responsive verified
- [ ] No performance regressions
- [ ] Error handling implemented
- [ ] Tests written and passing

## Testing Guidelines

### Unit Tests
```typescript
describe('CommandCenterView', () => {
  it('should render all shell modules', () => {
    render(<CommandCenterView />)
    expect(screen.getByText('Heads Up')).toBeInTheDocument()
    expect(screen.getByText('Decide Queue')).toBeInTheDocument()
  })

  it('should handle OODA button clicks', async () => {
    render(<CommandCenterView />)
    fireEvent.click(screen.getByLabelText('Store in Spine'))
    // assert modal opened
  })
})
```

### Integration Tests
```typescript
describe('Platform API Integration', () => {
  it('should fetch workspace data on mount', async () => {
    const mockData = { /* ... */ }
    mockFetch.mockResolvedValueOnce(mockData)
    render(<CommandCenterView />)
    await waitFor(() => {
      expect(screen.getByText('Acme Corporation')).toBeInTheDocument()
    })
  })
})
```

## Documentation Requirements

Every component must have:
1. JSDoc comment explaining purpose
2. PropTypes or TypeScript interface
3. Example usage in Storybook (if applicable)

```typescript
/**
 * Renders the canonical workbench shell with 3-part layout
 * 
 * Part 1: L1 Global Shell (sticky header)
 * - Heads Up alerts
 * - Decide Queue (Twin proposals)
 * - Knowledge Hub
 * - Daily Priorities
 * 
 * Part 2: Dynamic Department Canvas (scrollable)
 * - Role-specific content from Platform API
 * 
 * Part 3: Twin Footer (sticky)
 * - 4 OODA action buttons
 * 
 * @component
 * @example
 * return <CommandCenterView />
 */
export function CommandCenterView() { }
```

## Performance Standards

### Guidelines

- Components should re-render < 16ms (60 FPS target)
- Use memoization for expensive computations
- Lazy load modals and heavy components
- Implement proper loading states
- Cache API responses appropriately

### Lighthouse Targets

- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90

## Submitting Changes

1. Create a feature branch from `main`
2. Make your changes following code standards
3. Write tests for new functionality
4. Update documentation
5. Push to your branch
6. Create a Pull Request
7. Address review comments
8. Merge once approved

## Code of Conduct

- Be respectful and professional
- Focus on the code, not the person
- Assume good intent
- Ask questions politely
- Help others improve

## Getting Help

- **Questions**: Open a GitHub Discussion
- **Bugs**: File an Issue with reproduction steps
- **Design**: Ping the design team in Slack
- **Architecture**: Consult ARCHITECTURE.md

---

Thank you for contributing to Customer Zero! 🚀
