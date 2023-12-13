import { useState } from "react";
import { Button, Row, Col } from "react-bootstrap";
import axios from "axios";

import testPdfs from "../assets/test-pdfs.json";
import ejson from "@cdxoo/tiny-ejson";

const client = axios.create({
    baseURL: "/nano-pdf",
});

export const GetPDFLength = (ps) => {
    const [data, setData] = useState({});

    const getPdfLength = async () => {
        client
            .post("/get-pdf-length", {
                pdf: testPdfs["to-text"], //pdf is expected to be encoded as base64
            })
            .then((response) => {
                setData(response?.data);
            })
            .catch((err) => {
                setData(err);
            });
    };

    return (
        <Row>
            <Col xs={3}>
                <h2>get-pdf-length</h2>
                <Button onClick={() => getPdfLength()}>send request</Button>
                <Button variant="danger" onClick={() => setData({})}>x</Button>
            </Col>
            <Col >
                <h3>Response:</h3>
                <div className="bg-light border p-3">
                    <pre>{JSON.stringify(ejson(data), null, 4)}</pre>
                </div>
            </Col>
        </Row>
    );
};
