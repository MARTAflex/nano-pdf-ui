import { useMemo, useState } from 'react';
import { Button, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';

import testPdfs from '../assets/test-pdfs.json';
import ejson from '@cdxoo/tiny-ejson';

const client = axios.create({
    baseURL: '/nano-pdf',
});

export const SetFormFields = (ps) => {
    var { selectedPdf, uploadedPdf } = ps;
    const [responseData, setResponseData] = useState('');
    const [requestData, setRequestData] = useState({
        firstname: {
            'x': 111,
            'y': 751.2,
            'width': 125.399994,
            'height': 31,
            'page': 0,
            'type': 'text',
            'font': 'Helvetica',
            'fontColor': '0 g',
            'fontSize': '12',
            'quadding': '0',
        },
    });

    const sendRequest = async () => {
        client
            .post(
                '/set-form-fields',
                {
                    pdf: !!uploadedPdf ? uploadedPdf : testPdfs[selectedPdf], //pdf is expected to be encoded as base64
                    data: requestData,
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

    const blobUrl = useMemo(() => (
        responseData.type === 'application/pdf'
        ? URL.createObjectURL(responseData)
        : null
    ), [ responseData ]);

    return (
        <Row className='bg-light border p-3 mb-3'>
            <Col xs={3}>
                <h2>set-form-fields</h2>
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
    var { requestData, setRequestData, fetchFormFields } = ps;

    const [newKey, setNewKey] = useState(`key${Object.keys(requestData).length}`);

    const removeKey = (keyToRemove) => {
        setRequestData(prevState => {
            const { [keyToRemove]: removedKey, ...rest } = prevState;
            return rest;
        });
    }; 

    return (
        <div className='mb-5'>
            <div className='d-flex mb-3'>
                <Button
                    onClick={(next) => {
                        setRequestData((prev) => ({
                            ...prev,
                            [newKey]: {
                                'x': 100,
                                'y': 100,
                                'width': 125,
                                'height': 30,
                                'page': 0,
                                'type': 'text',
                                'font': 'Helvetica',
                                'fontColor': '0 rg',
                                'fontSize': '12',
                                'quadding': '1',
                            },
                        }))
                    }}
                >
                    add Key
                </Button>
                <Form.Control
                    type='text'
                    value={newKey}
                    onChange={(next) =>
                        setNewKey(next.target.value)
                    }
                />
            </div>

            { Object.keys(requestData).map( (key, i) => (
                <div key={key + i} className='border p-2'>
                    <Row>
                        <Col>
                            <h5 className='border-bottom p-1'>{`'${key}'`}
                                <Button 
                                    variant='danger' 
                                    size='sm'
                                    onClick={() => removeKey(key)}
                                >
                                    del
                                </Button>
                            </h5>
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
                    <Row>
                        <Form.Group as={Col}>
                            <Form.Label>font</Form.Label>
                            <Form.Select
                                value={requestData[key].font}
                                onChange={(next) =>
                                    setRequestData((prev) => ({
                                        ...prev,
                                        [key]: {
                                            ...prev[key],
                                            font: next.target.value,
                                        },
                                    }))
                                }
                            >
                                <option value="Helvetica">Helvetica</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>size</Form.Label>
                            <Form.Control
                                type='number'
                                value={requestData[key].fontSize}
                                onChange={(next) =>
                                    setRequestData((prev) => ({
                                        ...prev,
                                        [key]: {
                                            ...prev[key],
                                            fontSize: next.target.value,
                                        },
                                    }))
                                }
                            />
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group as={Col}>
                            <Form.Label>color</Form.Label>
                            <Form.Select
                                value={requestData[key].fontColor}
                                onChange={(next) =>
                                    setRequestData((prev) => ({
                                        ...prev,
                                        [key]: {
                                            ...prev[key],
                                            fontColor: next.target.value,
                                        },
                                    }))
                                }
                            >
                                <option value="0 rg">black</option>
                                <option value="1 1 1 rg">white</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>alignment</Form.Label>
                            <Form.Select
                                value={requestData[key].quadding}
                                onChange={(next) =>
                                    setRequestData((prev) => ({
                                        ...prev,
                                        [key]: {
                                            ...prev[key],
                                            quadding: next.target.value,
                                        },
                                    }))
                                }
                                >
                                <option value="0">left</option>
                                <option value="1">center</option>
                                <option value="2">right</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>page</Form.Label>
                            <Form.Control
                                type='number'
                                value={requestData[key].page}
                                onChange={(next) =>
                                    setRequestData((prev) => ({
                                        ...prev,
                                        [key]: {
                                            ...prev[key],
                                            page: next.target.value,
                                        },
                                    }))
                                }
                            />
                        </Form.Group>
                    </Row>
                </div>
            ))}
        </div>
    );
};
