import { render, screen } from '@testing-library/react'
import App from '../App'
import React from 'react'

describe('json editor', () => {
  test('place code from int json editor', () => {
    render(<App />);
  })
})