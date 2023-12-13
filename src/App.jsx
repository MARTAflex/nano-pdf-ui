import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Container } from 'react-bootstrap';
import { CheckIfForm, GetPDFLength } from './components';

function App() {


    return (
        <div className='p-5'>
            <GetPDFLength />
            <CheckIfForm />
        </div>
    );
}

export default App;
