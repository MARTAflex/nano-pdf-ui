import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import testPdfs from './assets/test-pdfs.json';
import { Form } from 'react-bootstrap';
import { CheckIfForm, GetPDFLength, ToText } from './components';

function App() {
    const [selectedPdf, setSelectedPdf] = useState('to-text');

    var formBag = {
        selectedPdf,
        setSelectedPdf,
    };

    var componentBag = {
        selectedPdf,
    };

    return (
        <div className='p-5'>
            <RequestForm {...formBag} />
            <GetPDFLength {...componentBag} />
            <CheckIfForm {...componentBag} />
            <ToText {...componentBag} />
        </div>
    );
}

const RequestForm = (ps) => {
    var { selectedPdf, setSelectedPdf } = ps;
    return (
        <div className='mb-5'>
            <Form.Group>
                <Form.Label>PDF File</Form.Label>
                <Form.Select
                    value={selectedPdf}
                    onChange={(next) => setSelectedPdf(next.target.value)}
                >
                    {Object.keys(testPdfs).map((key, i) => (
                        <option value={key} key={i}>
                            {key}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>
        </div>
    );
};

export default App;
