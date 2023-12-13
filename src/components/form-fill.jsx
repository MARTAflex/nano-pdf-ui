import { useState } from 'react';
import { Button, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';

import testPdfs from '../assets/test-pdfs.json';
import ejson from '@cdxoo/tiny-ejson';

const client = axios.create({
    baseURL: '/nano-pdf',
});

export const FormFill = (ps) => {
    var { selectedPdf } = ps;
    const [responseData, setResponseData] = useState('');
    const [requestData, setRequestData] = useState({
        firstname: 'foo',
        lastname: 'bar',
    });

    const sendRequest = async () => {
        client
            .post('/form-fill', {
                pdf: testPdfs[selectedPdf], //pdf is expected to be encoded as base64
                data: requestData,
                flatten: true,
            })
            .then((response) => {
                setResponseData(response?.data);
            })
            .catch((err) => {
                console.log(err?.response?.data);
                setResponseData(err?.response?.data);
            });
    };

    var formBag = {
        requestData,
        setRequestData,
    };

    return (
        <Row className='bg-light border p-3 mb-3'>
            <Col xs={3}>
                <h2>form-fill</h2>
                <RequestForm {...formBag} />
                <Button onClick={() => sendRequest()}>send request</Button>
                <Button variant='danger' onClick={() => setResponseData(null)}>
                    x
                </Button>
            </Col>
            <Col xs={9}>
                <h3>Response:</h3>
                <div className='border p-3'>
                    {responseData?.length < 200 && (
                        <pre>
                            {JSON.stringify(ejson(responseData), null, 4)}
                        </pre>
                    )}
                    {responseData?.length > 200 && (
                        <iframe src={responseData} width='100%' height='100%'/>
                    )}
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
                <Form.Label>firstname</Form.Label>
                <Form.Control
                    type='text'
                    value={requestData.firstname}
                    onChange={(next) =>
                        setRequestData((prev) => ({
                            ...prev,
                            firstname: next.target.value,
                        }))
                    }
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>lastname</Form.Label>
                <Form.Control
                    type='text'
                    value={requestData.lastname}
                    onChange={(next) =>
                        setRequestData((prev) => ({
                            ...prev,
                            lastname: next.target.value,
                        }))
                    }
                />
            </Form.Group>
        </div>
    );
};
