import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './Input'

describe('Input', () => {
  describe('Rendering', () => {
    it('should render input field', () => {
      render(<Input placeholder="Enter text" />)
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
    })

    it('should render with label', () => {
      render(<Input label="Username" />)
      expect(screen.getByLabelText('Username')).toBeInTheDocument()
    })

    it('should render with error message', () => {
      render(<Input error="This field is required" />)
      expect(screen.getByText('This field is required')).toBeInTheDocument()
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('should render with helper text', () => {
      render(<Input helperText="Enter your username" />)
      expect(screen.getByText('Enter your username')).toBeInTheDocument()
    })

    it('should not show helper text when error is present', () => {
      render(<Input helperText="Helper text" error="Error message" />)
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument()
      expect(screen.getByText('Error message')).toBeInTheDocument()
    })

    it('should render with left icon', () => {
      render(<Input leftIcon={<span data-testid="left-icon">🔍</span>} />)
      expect(screen.getByTestId('left-icon')).toBeInTheDocument()
    })

    it('should render with right icon', () => {
      render(<Input rightIcon={<span data-testid="right-icon">✓</span>} />)
      expect(screen.getByTestId('right-icon')).toBeInTheDocument()
    })
  })

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Input disabled placeholder="Disabled input" />)
      const input = screen.getByPlaceholderText('Disabled input')
      expect(input).toBeDisabled()
      expect(input).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed')
    })

    it('should apply error styles when error prop is provided', () => {
      render(<Input error="Error" placeholder="Error input" />)
      const input = screen.getByPlaceholderText('Error input')
      expect(input).toHaveClass('border-error')
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })

    it('should not have aria-invalid when no error', () => {
      render(<Input placeholder="Valid input" />)
      const input = screen.getByPlaceholderText('Valid input')
      expect(input).toHaveAttribute('aria-invalid', 'false')
    })
  })

  describe('Interactions', () => {
    it('should handle text input', async () => {
      const user = userEvent.setup()
      render(<Input placeholder="Type here" />)
      const input = screen.getByPlaceholderText('Type here')

      await user.type(input, 'Hello World')
      expect(input).toHaveValue('Hello World')
    })

    it('should call onChange handler', async () => {
      const handleChange = vi.fn()
      const user = userEvent.setup()

      render(<Input onChange={handleChange} placeholder="Type here" />)
      const input = screen.getByPlaceholderText('Type here')

      await user.type(input, 'a')
      expect(handleChange).toHaveBeenCalled()
    })

    it('should call onFocus handler', async () => {
      const handleFocus = vi.fn()
      const user = userEvent.setup()

      render(<Input onFocus={handleFocus} placeholder="Focus me" />)
      const input = screen.getByPlaceholderText('Focus me')

      await user.click(input)
      expect(handleFocus).toHaveBeenCalledTimes(1)
    })

    it('should call onBlur handler', async () => {
      const handleBlur = vi.fn()
      const user = userEvent.setup()

      render(<Input onBlur={handleBlur} placeholder="Blur me" />)
      const input = screen.getByPlaceholderText('Blur me')

      await user.click(input)
      await user.tab() // Move focus away
      expect(handleBlur).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility', () => {
    it('should associate label with input', () => {
      render(<Input label="Email" />)
      const input = screen.getByLabelText('Email')
      expect(input).toBeInTheDocument()
    })

    it('should have aria-describedby for error', () => {
      render(<Input error="Error message" id="test-input" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-describedby')
      expect(input.getAttribute('aria-describedby')).toContain('error')
    })

    it('should have aria-describedby for helper text', () => {
      render(<Input helperText="Helper text" id="test-input" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-describedby')
      expect(input.getAttribute('aria-describedby')).toContain('helper')
    })

    it('should generate unique id if not provided', () => {
      const { container } = render(<Input label="Test" />)
      const input = container.querySelector('input')
      expect(input).toHaveAttribute('id')
      expect(input?.id).toBeTruthy()
    })

    it('should use provided id', () => {
      render(<Input id="custom-id" label="Test" />)
      expect(screen.getByLabelText('Test')).toHaveAttribute('id', 'custom-id')
    })

    it('should forward ref', () => {
      const ref = vi.fn()
      render(<Input ref={ref} />)
      expect(ref).toHaveBeenCalled()
    })
  })

  describe('Styling', () => {
    it('should apply padding for left icon', () => {
      render(<Input leftIcon={<span>Icon</span>} placeholder="With left icon" />)
      const input = screen.getByPlaceholderText('With left icon')
      expect(input).toHaveClass('pl-10')
    })

    it('should apply padding for right icon', () => {
      render(<Input rightIcon={<span>Icon</span>} placeholder="With right icon" />)
      const input = screen.getByPlaceholderText('With right icon')
      expect(input).toHaveClass('pr-10')
    })

    it('should merge custom className with default classes', () => {
      render(<Input className="custom-class" placeholder="Custom" />)
      const input = screen.getByPlaceholderText('Custom')
      expect(input).toHaveClass('custom-class')
      expect(input).toHaveClass('w-full') // default class should still be present
    })
  })

  describe('Input types', () => {
    it('should support type="email"', () => {
      render(<Input type="email" placeholder="Email" />)
      const input = screen.getByPlaceholderText('Email')
      expect(input).toHaveAttribute('type', 'email')
    })

    it('should support type="password"', () => {
      render(<Input type="password" placeholder="Password" />)
      const input = screen.getByPlaceholderText('Password')
      expect(input).toHaveAttribute('type', 'password')
    })

    it('should support type="number"', () => {
      render(<Input type="number" placeholder="Number" />)
      const input = screen.getByPlaceholderText('Number')
      expect(input).toHaveAttribute('type', 'number')
    })
  })
})
