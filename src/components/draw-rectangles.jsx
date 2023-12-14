import { useMemo, useState } from 'react';
import { Button, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';

import testPdfs from '../assets/test-pdfs.json';
import ejson from '@cdxoo/tiny-ejson';

const client = axios.create({
    baseURL: '/nano-pdf',
});

export const DrawRectangles = (ps) => {
    var { selectedPdf } = ps;
    const [responseData, setResponseData] = useState('');
    const [requestData, setRequestData] = useState({
        rect1: {
            x: Math.floor(Math.random() * (300 - 40 + 1) + 40),
            y: Math.floor(Math.random() * (400 - 200 + 1) + 200),
            width: Math.floor(Math.random() * (300 - 200 + 1) + 200),
            height: Math.floor(Math.random() * (90 - 40 + 1) + 40),
            color: 'green',
        },
    });

    const sendRequest = async () => {
        client
            .post(
                '/draw-rectangles',
                {
                    pdf: testPdfs[selectedPdf], //pdf is expected to be encoded as base64
                    data: requestData,
                    flatten: true,
                },
                {
                    responseType: 'blob',
                }
            )
            .then((response) => {
                setResponseData(response?.data);
            })
            .catch(async (err) => {
                //from blob to text
                setResponseData(await err?.response?.data.text());
            });
    };

    var formBag = {
        requestData,
        setRequestData,
    };

    const blobUrl = useMemo(
        () =>
            responseData.type === 'application/pdf'
                ? URL.createObjectURL(responseData)
                : null,
        [responseData]
    );

    return (
        <Row className='bg-light border p-3 mb-3'>
            <Col xs={3}>
                <h2>draw-rectangles</h2>
                <RequestForm {...formBag} />
                <Button onClick={() => sendRequest()}>send request</Button>
                <Button variant='danger' onClick={() => setResponseData('')}>
                    x
                </Button>
            </Col>
            <Col xs={9}>
                <h3>Response:</h3>
                <div className='border p-3'>
                    {!blobUrl && (
                        <pre>
                            {JSON.stringify(ejson(responseData), null, 4)}
                        </pre>
                    )}
                    {blobUrl && (
                        <iframe src={blobUrl} width='100%' height='600px' />
                    )}
                </div>
            </Col>
        </Row>
    );
};

const RequestForm = (ps) => {
    var { requestData, setRequestData } = ps;

    var keys = Object.keys(requestData);

    const addNewRect = () => {
        var newKey = `rect${keys.length + 1}`;
        setRequestData((prev) => ({
            ...prev,
            [newKey]: {
                x: Math.floor(Math.random() * (300 - 40 + 1) + 40),
                y: Math.floor(Math.random() * (400 - 200 + 1) + 200),
                width: Math.floor(Math.random() * (300 - 200 + 1) + 200),
                height: Math.floor(Math.random() * (90 - 40 + 1) + 40),
                color: 'green',
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
                        <Form.Group as={Col}>
                            <Form.Select
                                value={requestData[key].color}
                                onChange={(next) =>
                                    setRequestData((prev) => ({
                                        ...prev,
                                        [key]: {
                                            ...prev[key],
                                            color: next.target.value,
                                        },
                                    }))
                                }
                            >
                                <option value={'green'}>green</option>
                            </Form.Select>
                        </Form.Group>
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
