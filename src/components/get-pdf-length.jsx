import { useState } from 'react';
import { Button, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';

import testPdfs from '../assets/test-pdfs.json';
import ejson from '@cdxoo/tiny-ejson';

const client = axios.create({
    baseURL: '/nano-pdf',
});

export const GetPDFLength = (ps) => {
    const [selectedPdf, setSelectedPdf] = useState('to-text');
    const [responseData, setResponseData] = useState({});

    const getPdfLength = async () => {
        client
            .post('/get-pdf-length', {
                pdf: testPdfs[selectedPdf], //pdf is expected to be encoded as base64
            })
            .then((response) => {
                setResponseData(response?.data);
            })
            .catch((err) => {
                setResponseData(err);
            });
    };

    var formBag = {
        selectedPdf,
        setSelectedPdf,
    }

    return (
        <Row>
            <Col xs={3}>
                <h2>get-pdf-length</h2>
                <RequestForm {...formBag} />

                <Button onClick={() => getPdfLength()}>
                    send request
                </Button>
                <Button variant='danger' onClick={() => setResponseData({})}>
                    x
                </Button>
            </Col>
            <Col>
                <h3>Response:</h3>
                <div className='bg-light border p-3'>
                    <pre>{JSON.stringify(ejson(responseData), null, 4)}</pre>
                </div>
            </Col>
        </Row>
    );
};

const RequestForm = (ps) => {
    var { selectedPdf, setSelectedPdf } = ps;
    return (
        <Form.Group>
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
    );
};
