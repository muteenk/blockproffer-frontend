import React, { useState, useEffect, useRef } from 'react'
import * as faceapi from 'face-api.js';
import Webcam from "react-webcam";




function Camera() {

    const videoConstraints = {
        width: 854,
        height: 480,
        facingMode: "environment",
        mirrored: false,

    };

    const [initializing, setInitializing] = useState("");

    const webcamRef = useRef(null);
    
    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = process.env.PUBLIC_URL + '/models';
            Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
            ]).then(startVideo);
        }
        loadModels();
    }, []);

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ 
            video: {} 
        }, (stream) => {
            webcamRef.current.srcObject = stream;
        });

    }

    const onUserMedia = (e) => {
        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(webcamRef.current.video, new faceapi.TinyFaceDetectorOptions());
            
            if (detections.length === 0) {
                setInitializing("");
            }
            else if (detections.length > 1) {
                setInitializing("Multiple Faces Detected");
            }
            else if (detections.length === 1) {
                setInitializing("Face Detected");
            }

        }, 1000);     

    };

    return (
        <div className='h-screen flex flex-col justify-center text-center align-center pt-[6rem]'>
            <div className='pb-[3rem] flex justify-center items-center flex-col'>
                <div className='flex justify-center items-center gap-[0.5rem]'>
                    <span className='' >{(initializing === "") ? <svg aria-hidden="true" class="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-pink-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg> : <i class="fa-solid fa-circle-check text-green-500"></i>}</span>
                    <span className='text-xl'>{(initializing !== "" && initializing !== "Multiple Faces Detected") ? "Face Detected" : ""}</span>
                </div>
                <div className='flex justify-center items-center gap-[0.5rem]'>
                    <span className='text-xl'>{(initializing === "Multiple Faces Detected") ? <i class="fa-solid fa-circle-xmark text-red-500"></i> : ""}</span>
                    <span className='text-xl'>{(initializing === "Multiple Faces Detected") ? <><input type="checkbox" id="my-modal" className="modal-toggle" checked/><div className="modal"><div className="modal-box"><h3 className="font-bold text-lg">There are More than One Person in the Frame</h3><p className="py-4">Please don't let this happen again we will have to forcefully kick you out from the room...</p><div className="modal-action"><label htmlFor="my-modal" className="btn">Sorry man, Won't Happen again...</label></div></div></div></> : ""}</span>
                    <span className='text-xl text-accent-focus'>{(initializing === "Multiple Faces Detected") ? initializing : ""}</span>
                </div>
            </div>
            <div className=' border-solid border-accent-content rounded flex justify-center'>
                <Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg" videoConstraints={videoConstraints} onUserMedia={onUserMedia}/>
            </div>
            <div className='pt-[1rem] flex justify-center gap-[1rem] align-center'>
                {(initializing !== "" && initializing !== "Multiple Faces Detected") ? <button className='btn' onClick={e => {console.log("Next")}}>Next</button> : <button class="btn loading">loading</button>}
            </div>
        </div>
    )
}

export default Camera