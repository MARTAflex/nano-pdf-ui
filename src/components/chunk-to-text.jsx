import { useState } from 'react';
import { Button, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';

import testPdfs from '../assets/test-pdfs.json';
import ejson from '@cdxoo/tiny-ejson';

const client = axios.create({
    baseURL: '/nano-pdf',
});

export const ChunkToText = (ps) => {
    var { selectedPdf } = ps;
    const [responseData, setResponseData] = useState({});
    const [requestData, setRequestData] = useState({
        chunkSize: 1,
        chunkIndex: 0,
    });

    const sendRequest = async () => {
        client
            .post('/chunk-to-text', {
                pdf: testPdfs[selectedPdf], //pdf is expected to be encoded as base64
                data: requestData,
            })
            .then((response) => {
                setResponseData(response?.data);
            })
            .catch((err) => {
                setResponseData(err);
            });
    };

    var formBag = {
        requestData,
        setRequestData,
    };

    return (
        <Row className='bg-light border p-3'>
            <Col xs={3}>
                <h2>chunk-to-text</h2>
                <RequestForm {...formBag} />
                <Button onClick={() => sendRequest()}>send request</Button>
                <Button variant='danger' onClick={() => setResponseData({})}>
                    x
                </Button>
            </Col>
            <Col xs={9}>
                <h3>Response:</h3>
                <div className='border p-3'>
                    <pre>{JSON.stringify(ejson(responseData), null, 4)}</pre>
                </div>
            </Col>
        </Row>
    );
};

const RequestForm = (ps) => {
    var { requestData, setRequestData } = ps;
    return (
        <div className='mb-5'>
            <Form.Group>
                <Form.Label>chunkIndex</Form.Label>
                <Form.Control
                    type='number'
                    value={requestData.chunkIndex}
                    onChange={(next) =>
                        setRequestData((prev) => ({
                            ...prev,
                            chunkIndex: next.target.value,
                        }))
                    }
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>chunkSize</Form.Label>
                <Form.Control
                    type='number'
                    value={requestData.chunkSize}
                    onChange={(next) =>
                        setRequestData((prev) => ({
                            ...prev,
                            chunkSize: next.target.value,
                        }))
                    }
                />
            </Form.Group>
        </div>
    );
};
