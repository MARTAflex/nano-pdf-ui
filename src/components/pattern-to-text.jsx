import { useState } from 'react';
import { Button, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';

import testPdfs from '../assets/test-pdfs.json';
import ejson from '@cdxoo/tiny-ejson';

const client = axios.create({
    baseURL: '/nano-pdf',
});

export const PatternToText = (ps) => {
    var { selectedPdf, uploadedPdf } = ps;
    const [responseData, setResponseData] = useState({});
    const [requestData, setRequestData] = useState({
        foo0: 'name',
    });

    const sendRequest = async () => {
        client
            .post('/pattern-to-text', {
                pdf: !!uploadedPdf ? uploadedPdf : testPdfs[selectedPdf], //pdf is expected to be encoded as base64
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
        <Row className='bg-light border p-3 mb-3'>
            <Col xs={3}>
                <h2>pattern-to-text</h2>
                <RequestForm {...formBag} />
                <Button onClick={() => sendRequest()}>send request</Button>
                <Button variant='danger' onClick={() => setResponseData({})}>
                    x
                </Button>
            </Col>
            <Col xs={9}>
                <h3>Response:</h3>
                <div className='bg-light border p-3'>
                    <pre>{JSON.stringify(ejson(responseData), null, 4)}</pre>
                </div>
            </Col>
        </Row>
    );
};

const RequestForm = (ps) => {
    var { requestData, setRequestData } = ps;

    var keys = Object.keys(requestData);

    const addNewPattern = () => {
        var newKey = `foo${keys.length + 1}`;
        setRequestData((prev) => ({
            ...prev,
            [newKey]: '[a-z]+',
        }));
    };

    return (
        <>
            <Button className='mb-3' onClick={addNewPattern}>
                + add pattern
            </Button>
            {keys.map((key) => (
                <div key={key} className='mb-3 p-2 border'>
                    <Form.Group>
                        <Form.Label>{`"${key}"`}</Form.Label>
                        <Form.Control
                            value={requestData[key]}
                            onChange={(next) =>
                                setRequestData((prev) => ({
                                    ...prev,
                                    [key]: next.target.value,
                                }))
                            }
                        />
                    </Form.Group>
                </div>
            ))}
        </>
    );
};
