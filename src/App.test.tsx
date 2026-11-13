import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('shows the title and the unofficial disclaimer', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'ASVS Selection Tool' })).toBeInTheDocument();
    expect(screen.getByText(/not affiliated with or endorsed by OWASP/i)).toBeInTheDocument();
  });
});
