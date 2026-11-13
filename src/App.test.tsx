import { fireEvent, render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('shows the title and the unofficial disclaimer', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'ASVS Selection Tool' })).toBeInTheDocument();
    expect(screen.getByText(/not affiliated with or endorsed by OWASP/i)).toBeInTheDocument();
  });

  it('shows attribution and the license notice', () => {
    render(<App />);
    expect(screen.getByRole('link', { name: 'CC BY-SA 4.0' })).toBeInTheDocument();
  });

  it('lists all requirements, then filters by level', () => {
    render(<App />);
    expect(screen.getByText('(345 shown)')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Level 1' }));
    expect(screen.getByText('(70 shown)')).toBeInTheDocument();
  });

  it('shows an empty state when nothing matches', () => {
    render(<App />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'zzzz-nothing' } });
    expect(screen.getByRole('status')).toHaveTextContent('No requirements match');
  });

  it('selects all shown, then deselects them', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Level 1' }));
    fireEvent.click(screen.getByRole('button', { name: /Select all shown \(70\)/ }));
    expect(screen.getByText('70')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Deselect shown' }));
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('lets the user add a note to a selected requirement', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select 1.1.1' }));
    const note = screen.getByRole('textbox', { name: 'Note for 1.1.1' });
    fireEvent.change(note, { target: { value: 'not applicable' } });
    expect(note).toHaveValue('not applicable');
  });

  it('refuses to save without a name', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Save to file' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Give the selection a name');
  });

  it('shows a clear error for an invalid file and never renders its content', async () => {
    const { container } = render(<App />);
    const file = new File(['<img src=x onerror=alert(1)>'], 'bad.json', {
      type: 'application/json',
    });
    const input = container.querySelector('input[type="file"]');
    if (!(input instanceof HTMLInputElement)) throw new Error('file input missing');
    fireEvent.change(input, { target: { files: [file] } });
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('not valid JSON');
    expect(container.querySelector('img')).toBeNull();
  });
});
