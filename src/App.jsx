import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import testPdfs from './assets/test-pdfs.json';
import { Form, Tabs } from 'react-bootstrap';
import {
    CheckIfForm,
    ChunkToText,
    FormFill,
    GetPDFLength,
    ToText,
    DrawRectangles,
    GetPageDimensions,
    AreasToText,
    RectangleHelper,
    GroupPages,
    PatternToText,
    GetFormFields,
} from './components';
import { Tab } from 'bootstrap';

function App() {
    const [selectedPdf, setSelectedPdf] = useState('to-text');
    const [uploadedPdf, setUploadedPdf] = useState(null);

    var formBag = {
        selectedPdf,
        setSelectedPdf,
        uploadedPdf,
        setUploadedPdf,
    };

    var componentBag = {
        selectedPdf,
        uploadedPdf,
    };
    
    return (
        <div className='p-5'>
            <RequestForm {...formBag} />

            <Tabs
                defaultActiveKey='meta'
            >
                <Tab eventKey='meta' title='Metadata'>
                    <GetPDFLength {...componentBag} />
                    <CheckIfForm {...componentBag} />
                </Tab>
                <Tab eventKey='totext' title='ToText'>
                    <ToText {...componentBag} />
                    <ChunkToText {...componentBag} />
                    <AreasToText {...componentBag} />
                    <RectangleHelper {...componentBag} />
                    <PatternToText {...componentBag} />
                </Tab>
                <Tab eventKey='forms' title='Forms'>
                    <FormFill {...componentBag} />
                    <GetFormFields {...componentBag} />
                    <RectangleHelper {...componentBag} />
                </Tab>
                <Tab eventKey='group' title='Group'>
                    <GroupPages {...componentBag} />
                </Tab>
                <Tab eventKey='helper' title='Helpers'>
                    <DrawRectangles {...componentBag} />
                    <GetPageDimensions {...componentBag} />
                    <RectangleHelper {...componentBag} />
                </Tab>
            </Tabs>
        </div>
    );
}

const RequestForm = (ps) => {
    var { selectedPdf, setSelectedPdf, uploadedPdf, setUploadedPdf } = ps;

    var handleUploadFile = (e) => {
        console.log(e.target);
        let selectedFile = e.target.files;
        let file = null;
        let fileName = '';
        //Check File is not Empty
        if (selectedFile.length > 0) {
            // Select the very first file from list
            let fileToLoad = selectedFile[0];
            
            fileName = fileToLoad.name;
            // FileReader function for read the file.
            let fileReader = new FileReader();
            // Onload of file read the file content
            fileReader.onload = function (fileLoadedEvent) {
                file = fileLoadedEvent.target.result;
                const base64String = file
                    .replace('data:', '')
                    .replace(/^.+,/, '');

                setUploadedPdf(base64String);
            };
            // Convert data to base64
            fileReader.readAsDataURL(fileToLoad);
        }
    };

    return (
        <div className='mb-5'>
            <Form.Group>
                <Form.Label>PDF File</Form.Label>
                <Form.Select
                    disabled={!!uploadedPdf}
                    value={selectedPdf}
                    onChange={(next) => setSelectedPdf(next.target.value)}
                >
                    {Object.keys(testPdfs).map((key, i) => (
                        <option value={key} key={i}>
                            {key}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>
            or
            <Form.Group className='mt-3'>
                <Form.Label>Upload File</Form.Label>
                <Form.Control type='file' onChange={handleUploadFile} />
            </Form.Group>
        </div>
    );
};

export default App;
