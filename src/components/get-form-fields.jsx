import { useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';

import testPdfs from '../assets/test-pdfs.json';
import ejson from '@cdxoo/tiny-ejson';
import { copyTextToClipboard } from './util';

const client = axios.create({
    baseURL: '/nano-pdf',
});

export const GetFormFields = (ps) => {
    var { selectedPdf, uploadedPdf } = ps;
    const [responseData, setResponseData] = useState(JSON.stringify(ejson({}), null, 4));

    const sendRequest = async () => {
        client
            .post('/get-form-fields', {
                pdf: !!uploadedPdf ? uploadedPdf : testPdfs[selectedPdf], //pdf is expected to be encoded as base64
            })
            .then((response) => {
                setResponseData(JSON.stringify(ejson(response.data), null, 4));
            })
            .catch((err) => {
                setResponseData(err);
            });
    };

    return (
        <Row className='bg-light border p-3 mb-3'>
            <Col xs={3}>
                <h2>get-form-fields</h2>
                <Button onClick={() => sendRequest()}>
                    send request
                </Button>
                <Button variant='danger' onClick={() => setResponseData({})}>
                    x
                </Button>
            </Col>
            <Col xs={9}>
                <h3>Response:</h3>
                <Button
                    onClick={ () => copyTextToClipboard(responseData)}
                >
                    Copy to Clipboard
                </Button>
                <div className='bg-light border p-3'>
                    <pre>{responseData}</pre>
                </div>
            </Col>
        </Row>
    );
};
