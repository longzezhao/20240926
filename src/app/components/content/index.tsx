"use client"

import React, {useEffect, useState} from 'react';
import ImageItem from "@/app/components/ImageItem";
import PubSub from "pubsub-js";
import {pdfjs} from "react-pdf"
import "./index.css"

export default function Index(props:{}){

    const [images, setImages] = useState<any>([]);

    const [pdfFile, setPdfFile] = useState(null);
    const [isLoading,setIsLoading]=useState(false)

    const [width,setWidth]=useState(200)
    const [height,setHeight]=useState(280)
    const [currentFile,setCurrentFile]=useState<File | null>(null)

    const [zoomInDisabled,setZoomInDisabled]=useState(false)
    const [zoomOutDisabled,setZoomOutDisabled]=useState(false)

    const onUpload= async (e:React.ChangeEvent<HTMLInputElement>)=>{
        const file=e.target.files?.[0]
        if(file){
            setCurrentFile(file)
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file)
            fileReader.onload=async ()=>{
                const base64=fileReader.result as any
                setPdfFile(base64)
            }
        }
    }

    useEffect(()=>{

        pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

        if (pdfFile) {
            setIsLoading(true)
            const loadPDF = async () => {
                const pdf= await pdfjs.getDocument(pdfFile).promise
                const images = [] as any;
                for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
                    const img = await convertPageToImage(pdf, pageNumber);
                    images.push(img);
                }
                setIsLoading(false)
                setImages(images);
            };

            loadPDF();
        }
    },[pdfFile])

    const convertPageToImage = async (doc:any, pageNumber:number) => {
        const page = await doc.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1.0 });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };

        const renderTask = page.render(renderContext);
        await renderTask.promise

        const img = new Image();
        img.src = canvas.toDataURL('image/png');
        return img;
    };

    const onRemove=()=>{
        setCurrentFile(null)
        setPdfFile(null)
        setImages([])
    }

    const onAllRotate=()=>{
        PubSub.publish("rotate")
    }

    const onDownload=()=>{
        const blob = new Blob([currentFile as File], { type: (currentFile as File).type });

        const fileUrl = URL.createObjectURL(blob);

        // 创建下载链接并模拟点击
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = (currentFile as File).name || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 释放 URL 对象
        setTimeout(() => {
            URL.revokeObjectURL(fileUrl);
        }, 100);
    }

    const onZoomIn=()=>{
        if(width > 500){
            return
        }
        setWidth(width+50)
        setHeight(height+50)
    }

    const onZoomOut=()=>{
        if(width - 50 < 100){
            return
        }
        setWidth(width-50)
        setHeight(height-50)
    }

    useEffect(() => {
        setZoomInDisabled(width > 500)
        setZoomOutDisabled(width - 50 < 100)
    }, [width]);

    return (
        <div className="container mx-auto py-20 space-y-5 content">
            <div className="flex flex-col text-center !mb-10 space-y-5">
                <h1 className="text-5xl font-serif">Rotate PDF Pages</h1>
                <p className="mt-2 text-gray-600 max-w-lg mx-auto">Simply click on a page to rotate it. You can then
                    download your modified PDF.</p>
            </div>
            {
                pdfFile ?
                    <React.Fragment>
                        {
                            isLoading ?
                                <div style={{textAlign:"center"}}>
                                    加载中...
                                </div>
                                :
                                <React.Fragment>
                                    <div className="flex justify-center items-center space-x-3 selecto-ignore">
                                        <button className="download" onClick={onAllRotate}>Rotate all</button>
                                        <button className="download" style={{background:"#1f2937"}}
                                                aria-label="Remove this PDF and select a new one"
                                                data-microtip-position="top"
                                                role="tooltip" onClick={onRemove}
                                        >
                                            Remove PDF
                                        </button>
                                        <button
                                            className="bg-[#ff612f] shadow rounded-full p-2 flex items-center justify-center hover:scale-105 grow-0 shrink-0 disabled:opacity-50 !bg-white"
                                            aria-label="Zoom in" data-microtip-position="top" role="tooltip" onClick={onZoomIn}
                                            style={{opacity:zoomInDisabled?.5:1}}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth="1.5"
                                                 stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"></path>
                                            </svg>
                                        </button>
                                        <button
                                            className="bg-[#ff612f] shadow rounded-full p-2 flex items-center justify-center hover:scale-105 grow-0 shrink-0 disabled:opacity-50 !bg-white"
                                            aria-label="Zoom out" data-microtip-position="top" role="tooltip" onClick={onZoomOut}
                                            style={{opacity:zoomOutDisabled?.5:1}}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth="1.5"
                                                 stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"></path>
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap justify-center">
                                        {
                                            images.length && images.map((item: any, index: number) => {
                                                return <ImageItem
                                                        key={index}
                                                        index={index}
                                                        src={item.src}
                                                        width={width}
                                                        height={height}
                                                        />
                                            })
                                        }
                                    </div>
                                    <div className="flex flex-col justify-center items-center space-y-3 selecto-ignore">
                                        <button className="download"
                                                aria-label="Split and download PDF"
                                                data-microtip-position="top" role="tooltip"
                                                onClick={onDownload}
                                        >
                                            Download
                                        </button>
                                    </div>
                                </React.Fragment>
                        }
                    </React.Fragment>
                    :
                    <div className="w-full flex justify-center">
                        <div className="h-[350px] relative text-center w-[275px]">
                            <input className="cursor-pointer hidden"
                                   onChange={onUpload}
                                   type="file" id="input-file-upload"
                                   accept=".pdf"
                            />
                            <label
                                className="h-full flex items-center justify-center border rounded transition-all bg-white border-dashed border-stone-300"
                                htmlFor="input-file-upload"
                            >
                                <div className="cursor-pointer flex flex-col items-center space-y-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="1.5"
                                         stroke="currentColor" className="w-8 h-8">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"></path>
                                    </svg>
                                    <p className="pointer-events-none font-medium text-sm leading-6 pointer opacity-75">
                                        Click to upload or drag and drop
                                    </p>
                                </div>
                            </label></div>
                    </div>
            }
        </div>
    );
}
