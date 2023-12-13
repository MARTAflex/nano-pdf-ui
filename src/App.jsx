import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Container } from 'react-bootstrap';
import { GetPDFLength } from './components';

function App() {
    return (
        <Container>
            <GetPDFLength />
        </Container>
    );
}

export default App;
