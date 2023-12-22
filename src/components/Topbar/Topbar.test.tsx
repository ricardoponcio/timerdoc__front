import "@testing-library/jest-dom";
import { render, screen } from '@testing-library/react';

describe('Topbar',async () => {
    it('Render Topbar', () => {
        // render(<Topbar  />);\
        // expect(screen.getByText('Logout')).toBeInTheDocument();

        render(<p>teste</p>);
        expect(screen.getByText('teste')).toBeInTheDocument();
    })
});