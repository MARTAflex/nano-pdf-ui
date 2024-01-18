import { useMemo, useState } from 'react';
import { Button, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';

import testPdfs from '../assets/test-pdfs.json';
import ejson from '@cdxoo/tiny-ejson';

const client = axios.create({
    baseURL: '/nano-pdf',
});

export const GroupPages = (ps) => {
    var { selectedPdf, uploadedPdf } = ps;
    const [responseData, setResponseData] = useState('');
    const [requestData, setRequestData] = useState({
        test: "[0]",
    });

    const sendRequest = async () => {
        client
            .post(
                '/group-pages',
                {
                    pdf: !!uploadedPdf ? uploadedPdf : testPdfs[selectedPdf], //pdf is expected to be encoded as base64
                    data: {
                        test: JSON.parse(requestData.test)
                    },
                },
                // {
                //     responseType: 'blob',
                // }
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

    const blobUrl = useMemo(() => {
        var result = null;

        if (typeof responseData === 'object') {
            const byteNumbers = atob(responseData.test).split('');
            const byteArray = new Uint8Array(
                new ArrayBuffer(byteNumbers.length)
            );

            for (let i = 0; i < byteNumbers.length; i++) {
                const ascii = byteNumbers[i].charCodeAt(0);
                byteArray[i] = ascii > 127 ? (ascii & 0x7f) | 0x80 : ascii;
            }
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            result = URL.createObjectURL(blob);
        }

        return result;
    }, [responseData]);

    // const blobUrl = useMemo(() => (
    //     responseData.type === 'application/pdf'
    //     ? URL.createObjectURL(responseData)
    //     : null
    // ), [ responseData ]);

    return (
        <Row className='bg-light border p-3 mb-3'>
            <Col xs={3}>
                <h2>group-pages</h2>
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
    return (
        <div className='mb-5'>
            <Form.Group>
                <Form.Label>test</Form.Label>
                <Form.Control
                    type='text'
                    value={requestData.test}
                    onChange={(next) =>
                        setRequestData((prev) => ({
                            ...prev,
                            test: next.target.value, 
                        }))
                    }
                />
            </Form.Group>
        </div>
    );
};
