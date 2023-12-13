import { useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';

import testPdfs from '../assets/test-pdfs.json';
import ejson from '@cdxoo/tiny-ejson';

const client = axios.create({
    baseURL: '/nano-pdf',
});

export const CheckIfForm = (ps) => {
    var { selectedPdf } = ps;
    const [responseData, setResponseData] = useState({});

    const sendRequest = async () => {
        client
            .post('/check-if-form', {
                pdf: testPdfs[selectedPdf], //pdf is expected to be encoded as base64
            })
            .then((response) => {
                setResponseData(response?.data);
            })
            .catch((err) => {
                setResponseData(err);
            });
    };

    return (
        <Row>
            <Col xs={3}>
                <h2>check-if-form</h2>
                <Button onClick={() => sendRequest()}>
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
