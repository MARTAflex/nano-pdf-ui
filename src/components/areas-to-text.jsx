import { useState } from 'react';
import { Button, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';

import testPdfs from '../assets/test-pdfs.json';
import ejson from '@cdxoo/tiny-ejson';

const client = axios.create({
    baseURL: '/nano-pdf',
});

export const AreasToText = (ps) => {
    var { selectedPdf, uploadedPdf } = ps;
    const [responseData, setResponseData] = useState({});
    const [requestData, setRequestData] = useState({
        firstname: {
            x: 110,
            y: 60,
            width: 125,
            height: 30,
        },
    });

    const sendRequest = async () => {
        client
            .post('/areas-to-text', {
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
                <h2>areas-to-text</h2>
                <RequestForm {...formBag} />
                <Button onClick={() => sendRequest()}>
                    send request
                </Button>
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

    const addNewRect = () => {
        var newKey = `foo${keys.length + 1}`;
        setRequestData((prev) => ({
            ...prev,
            [newKey]: {
                x: Math.floor(Math.random() * (50 - 40 + 1) + 40),
                y: Math.floor(Math.random() * (100 - 150 + 1) + 150),
                width: Math.floor(Math.random() * (300 - 200 + 1) + 200),
                height: Math.floor(Math.random() * (50 - 30 + 1) + 30),
            },
        }));
    };

    return (
        <>
            <Button className='mb-3' onClick={addNewRect}>+ add rectangle</Button>
            {keys.map((key) => (
                <div key={key} className='mb-3 p-2 border'>
                    <Row>
                        <Col>
                            <h5>{`"${key}"`}</h5>
                        </Col>
                    </Row>
                    <Row>
                        <Form.Group as={Col}>
                            <Form.Label>x</Form.Label>
                            <Form.Control
                                type='number'
                                value={requestData[key].x}
                                onChange={(next) =>
                                    setRequestData((prev) => ({
                                        ...prev,
                                        [key]: {
                                            ...prev[key],
                                            x: next.target.value,
                                        },
                                    }))
                                }
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>y</Form.Label>
                            <Form.Control
                                type='number'
                                value={requestData[key].y}
                                onChange={(next) =>
                                    setRequestData((prev) => ({
                                        ...prev,
                                        [key]: {
                                            ...prev[key],
                                            y: next.target.value,
                                        },
                                    }))
                                }
                            />
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group as={Col}>
                            <Form.Label>width</Form.Label>
                            <Form.Control
                                type='number'
                                value={requestData[key].width}
                                onChange={(next) =>
                                    setRequestData((prev) => ({
                                        ...prev,
                                        [key]: {
                                            ...prev[key],
                                            width: next.target.value,
                                        },
                                    }))
                                }
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>height</Form.Label>
                            <Form.Control
                                type='number'
                                value={requestData[key].height}
                                onChange={(next) =>
                                    setRequestData((prev) => ({
                                        ...prev,
                                        [key]: {
                                            ...prev[key],
                                            height: next.target.value,
                                        },
                                    }))
                                }
                            />
                        </Form.Group>
                    </Row>
                </div>
            ))}
        </>
    );
};