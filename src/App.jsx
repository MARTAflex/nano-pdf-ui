import { useState } from "react";
import "./App.css";
import axios from "axios";

import testPdfs from "./assets/test-pdfs.json";

const client = axios.create({
    baseURL: "/nano-pdf",
});

function App() {
    const [data, setData] = useState(null);

    const getPdfLength = async () => {
        client
            .post("/get-pdf-length",{
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
                    {JSON.stringify(data)}
                </pre>
            </div>
        </div>
    );
}

export default App;
