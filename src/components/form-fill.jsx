import { useMemo, useState } from 'react';
import { Button, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';

import testPdfs from '../assets/test-pdfs.json';
import ejson from '@cdxoo/tiny-ejson';

const client = axios.create({
    baseURL: '/nano-pdf',
});

export const FormFill = (ps) => {
    var { selectedPdf, uploadedPdf } = ps;
    const [responseData, setResponseData] = useState('');
    const [requestData, setRequestData] = useState({
        firstname: 'foo',
        lastname: 'bar',
    });
    const [flatten, setFlatten] = useState(false);

    const sendRequest = async () => {
        client
            .post(
                '/form-fill',
                {
                    pdf: !!uploadedPdf ? uploadedPdf : testPdfs[selectedPdf], //pdf is expected to be encoded as base64
                    data: requestData,
                    flatten,
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

    const fetchFormFields = async () => {
        client
            .post(
                '/get-form-fields',
                {
                    pdf: !!uploadedPdf ? uploadedPdf : testPdfs[selectedPdf], //pdf is expected to be encoded as base64
                },
            )
            .then((response) => {
                var newFields = {};
                for (const field of response?.data) {
                    newFields[field.name] = ''
                }
                setRequestData(newFields);
            })
            .catch(async (err) => {
                console.log(await err?.response?.data.text());
            });
    };

    var formBag = {
        requestData,
        setRequestData,
        fetchFormFields,
    };

    const blobUrl = useMemo(() => (
        responseData.type === 'application/pdf'
        ? URL.createObjectURL(responseData)
        : null
    ), [ responseData ]);

    return (
        <Row className='bg-light border p-3 mb-3'>
            <Col xs={3}>
                <h2>form-fill</h2>
                <RequestForm {...formBag} />
                <Form.Check
                    className='mb-3 me-5'
                    type='checkbox'
                    value={flatten}
                    onChange={() => setFlatten((prev) => !prev)}
                    label='flatten'
                />
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

    return (
        <div className='mb-5'>
            <Button
                className='mb-3'
                onClick={() => fetchFormFields()}
            >
                fetch from document (get-form-fields)
            </Button>
            <div className='d-flex'>
                <Button
                    onClick={(next) =>
                        setRequestData((prev) => ({
                            ...prev,
                            [newKey]: 'foobar',
                        }))
                    }
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

            { Object.keys(requestData).map( key => (
                <Form.Group>
                    <Form.Label>{key}</Form.Label>
                    <Form.Control
                        type='text'
                        as='textarea'
                        value={requestData[key]}
                        onChange={(next) =>
                            setRequestData((prev) => ({
                                ...prev,
                                [key]: next.target.value,
                            }))
                        }
                    />
                </Form.Group>
            ))}
        </div>
    );
};
