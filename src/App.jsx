import { useState } from "react";
import "./App.css";
import axios from "axios";

import testPdfs from "./assets/test-pdfs.json";
import ejson from "@cdxoo/tiny-ejson";

const client = axios.create({
    baseURL: "/nano-pdf",
});

function App() {
    const [data, setData] = useState(null);

    const getPdfLength = async () => {
        client
            .post("/to-text",{
                pdf: testPdfs["to-text"], //pdf is expected to be encoded as base64
            }, )
            .then((response) => {
                setData(response?.data)
            })
            .catch((err) => { 
                setData(err)
            });
    };

    return (
        <div>
            <h2>get-pdf-length</h2>
            <button onClick={() => getPdfLength()}>send request</button>
            <div>
                <pre>
                    { JSON.stringify(
                        ejson(data),
                        null, 4
                    )}
                </pre>
            </div>
        </div>
    );
}

export default App;
