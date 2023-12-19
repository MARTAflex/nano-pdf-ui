import { useMemo, useState, useRef } from 'react';
import { Button, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';

import testPdfs from '../assets/test-pdfs.json';
import ejson from '@cdxoo/tiny-ejson';

const client = axios.create({
    baseURL: '/nano-pdf',
});

export const RectangleHelper = (ps) => {
    var { selectedPdf, uploadedPdf } = ps;
    const [responseData, setResponseData] = useState('');
    const [requestData, setRequestData] = useState({});

    const sendRequest = async () => {
        client
            .post(
                '/get-page-dimensions',
                {
                    pdf: !!uploadedPdf ? uploadedPdf : testPdfs[selectedPdf], //pdf is expected to be encoded as base64
                    data: requestData,
                }
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

    const blobUrl = useMemo(
        () =>
            responseData.type === 'application/pdf'
                ? URL.createObjectURL(responseData)
                : null,
        [responseData]
    );

    var rectanglesBag = {
        ...(responseData && {
            width: responseData[0][2] || 50,
            height: responseData[0][3] || 50,
        }),
    };

    return (
        <Row className='bg-light border p-3 mb-3'>
            <Col xs={3}>
                <h2>rectangle-helper</h2>
                <Button onClick={() => sendRequest()}>send request</Button>
                <Button variant='danger' onClick={() => setResponseData('')}>
                    x
                </Button>
            </Col>
            <Col xs={9}>
                <h3>Response:</h3>
                <div className='border p-3'>
                    {/* {!blobUrl && (
                        <pre>
                            {JSON.stringify(ejson(responseData), null, 4)}
                        </pre>
                    )}
                    {blobUrl && (
                        <iframe src={blobUrl} width='100%' height='600px' />
                    )} */}
                    {responseData && <RectangleDrawing {...rectanglesBag} />}
                </div>
            </Col>
        </Row>
    );
};

const RectangleDrawing = ({ height, width }) => {
    const canvasRef = useRef(null);
    const [drawing, setDrawing] = useState(false);
    const [rectangle, setRectangle] = useState({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });
    const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;

        setDrawing(true);
        setStartPoint({ x, y });

        // Clear previous drawings
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const handleMouseMove = (e) => {
        if (drawing) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const x = e.nativeEvent.offsetX;
            const y = e.nativeEvent.offsetY;

            // Clear previous drawings
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw the current rectangle
            ctx.strokeRect(
                startPoint.x,
                startPoint.y,
                x - startPoint.x,
                y - startPoint.y
            );
        }
    };

    const handleMouseUp = (e) => {
        if (drawing) {
            setDrawing(false);
            const x = e.nativeEvent.offsetX;
            const y = e.nativeEvent.offsetY;
            const width = x - startPoint.x;
            const height = y - startPoint.y;

            const rectangle = {
                x: startPoint.x,
                y: startPoint.y,
                width,
                height,
            };
            
            //if rectangle was drawn in negativ directions we need to translate that for consistency
            if (rectangle.width < 0) {
                rectangle.width *= -1;
                rectangle.x -= rectangle.width;
            }
            if (rectangle.height < 0) {
                rectangle.height *= -1;
                rectangle.y -= rectangle.height;
            }
            setRectangle(rectangle);
        }
    };
    
    return (
        <>
            {`x: ${rectangle.x} y: ${rectangle.y} width: ${rectangle.width} height: ${rectangle.height}`}
            <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                width={width}
                height={height}
                style={{ border: '1px solid black' }}
            />
        </>
    );
};
