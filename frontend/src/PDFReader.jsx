import { memo } from 'react';
import { Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { Viewer } from '@react-pdf-viewer/core';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import React, { useState, useRef, useEffect } from 'react'
import { Button } from "./components/ui/button"
import { motion } from 'framer-motion';
import { Input } from "./components/ui/input"
import { ScrollArea } from "./components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerOverlay } from "./components/ui/drawer"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"
import { Progress } from "./components/ui/progress"
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Plus, ZoomIn, ZoomOut, Upload, MessageCircle, FileText, Menu, X, Folder, Book, FolderPlus, Send, Trash2, Speaker, Lightbulb } from "lucide-react"
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { initDB, storeFileInIndexedDB, fetchAllFiles, clearAllFiles, deleteFileByIndex } from "./indexedDB";
import sendPrompt from './api.js'

import Loader from './Loader.jsx';

export default function Component() {
    const [numPages, setNumPages] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [scale, setScale] = useState(1.0)
    const [pdfFile, setPdfFile] = useState({})
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [folders, setFolders] = useState([{ name: 'All PDFs', files: [] }])
    const [currentFolder, setCurrentFolder] = useState('All PDFs')
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [showChat, setShowChat] = useState(false)
    const [selectedText, setSelectedText] = useState('')
    const [newFolderName, setNewFolderName] = useState('')
    const [uploadProgress, setUploadProgress] = useState(0)
    const [selectedFolder, setSelectedFolder] = useState('All PDFs')
    const fileInputRef = useRef(null)
    const [isMobile, setIsMobile] = useState(false)
    const [isFullScreen, setIsFullScreen] = useState(false)
    const pdfViewerRef = useRef(null)
    const pageNavigationPluginInstance = pageNavigationPlugin();
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const tempFolderNameRef = useRef('');
    const [showMessage, setShowMessage] = useState(false);
    const [pdfBlob, setPdfBlob] = useState(null);
    const [pdfUrl, setPdfUrl] = useState('');
    const [files, setFiles] = useState([]);
    const [length, setLength] = useState(0);
    const [beforeWords, setBeforeWords] = useState('');
    const [afterWords, setAftereWords] = useState('');
    const [textAround, setTextAround] = useState('')
    const [meaning, setMeaning] = useState('');
    const [example, setExample] = useState('')
    const [sound, setSound] = useState('')
    const [coming, setComing] = useState(false)

    const Card = ({ className, children }) => (
        <div className={`rounded-lg shadow-lg ${className}`}>
            {children}
        </div>
    );

    const CardHeader = ({ className, children }) => (
        <div className={`px-6 py-4 ${className}`}>
            {children}
        </div>
    );

    const CardTitle = ({ className, children }) => (
        <h2 className={`text-3xl font-bold ${className}`}>
            {children}
        </h2>
    );

    const CardContent = ({ className, children }) => (
        <div className={`px-6 py-4 ${className}`}>
            {children}
        </div>
    );

    const Button = ({ className, children, onClick, ariaLabel }) => (
        <button
            className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background ${className}`}
            onClick={onClick}
            aria-label={ariaLabel}
        >
            {children}
        </button>
    );

    const handleKeyDown = (e) => {

        e.preventDefault(); // Prevent typing
        toast.error("Please select a text in the pdf.", {
            position: "top-center",
            autoClose: 3000, // Set time in milliseconds before the toast disappears
            closeOnClick: true, // Allow closing the toast by clicking
            pauseOnHover: false, // Disable pause on hover
            draggable: false, // Disable dragging to dismiss
        });
    };



    const truncateFileName = (file) => {
        const maxLength = 14; // Maximum number of characters allowed
        if (file.length > maxLength) {
            return `${file.slice(0, maxLength)}...`; // Truncate and add ellipsis
        }
        return file; // Return the original string if it's within the limit
    };

    const deleteByIndex = (index) => {
        // Create a new array excluding the file at the given index
        const updatedFiles = files.filter((_, i) => i !== index);
        // Update the state with the new array
        setFiles(updatedFiles);
    };



    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const handlePronunciation = () => {
        // In a real app, this would trigger text-to-speech
        console.log("Playing pronunciation")
    }

    function getImmediateSiblings(node) {
        let prev = []
        let next = []

        for (let i = 0; i < 100; i++) {
            if (prev.length > 0) {
                prev.push(prev[prev.length - 1] && prev[prev.length - 1].previousSibling)
            } else {
                prev.push(node.previousSibling)
            }


        }

        for (let i = 0; i < 100; i++) {
            if (next.length > 0) {
                next.push(next[next.length - 1] && next[next.length - 1].nextSibling)
            } else {
                next.push(node.nextSibling)
            }


        }



        let prev1 = []
        let next1 = []
        for (let sib in prev1) {
            if (sib.tagName !== 'SPAN') {
                let i = prev1.indexOf(sib)
                prev1.splice(i, 1)

            }
        }
        for (let sib in prev1) {
            if (sib.tagName !== 'SPAN') {
                let i = prev1.indexOf(sib)
                prev1.splice(i, 1)

            }
        }

        for (let sib in next1) {
            if (sib.tagName !== 'SPAN') {
                let i = next1.indexOf(sib)
                next1.splice(i, 1)

            }
        }
        // let hey = full[0].innerHTML
        // let hey2 = full[1].innerHTML
        // let hey3 = full[2].innerHTML




        for (let i = 0; i < prev.length; i++) {


            prev[i] && prev1.push(prev[i].innerHTML)

        }
        for (let i = 0; i < next.length; i++) {


            next[i] && next1.push(next[i].innerHTML)

        }

        //prev1 = prev1.slice(0, 5)
        next1 = next1.slice(0, 5)


        return [prev1, next1];
    }
    const speak = (text) => {
        const speech = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(speech);
    };

    useEffect(() => {
        const handleSelection = () => {
            const selection = window.getSelection();
            if (selection && selection.toString().trim() !== '' && pdfViewerRef.current && pdfViewerRef.current.contains(selection.anchorNode)) {
                const selectedText = selection.toString().trim();
                const range = selection.getRangeAt(0);


                const startNeighbors = getImmediateSiblings(range.startContainer.parentNode);

                setTextAround(startNeighbors[0].join('').concat("&", startNeighbors[1].join('')))

                // Get the text content of the parent node of the selection
                const parentText = range.startContainer.textContent;

                // Get the start and end indices of the selected text within the parent text
                const startIndex = range.startOffset;
                const endIndex = range.endOffset;

                // Get the surrounding text
                const textBefore = parentText.substring(0, startIndex).trim();
                const textAfter = parentText.substring(endIndex).trim();

                // Optionally limit the number of words before and after the selected text
                const numWords = 10; // Adjust this number as needed

                setBeforeWords(parentText);
                setAftereWords(textAfter.split(/\s+/).slice(0, numWords).join(' '));


                setSelectedText(selectedText);
            }
        };

        document.addEventListener('selectionchange', handleSelection);
        return () => document.removeEventListener('selectionchange', handleSelection);
    }, []);
    const prompt = `Given the following text fragments:

        
    -The Text around it ,before and after separated by & :${textAround}
    -The Text the word is in: ${beforeWords}
    - The word: ${selectedText}
    
    
    Please provide a concise contextual  meaning of the word in the following format:
    
    "in the given context, ..."
    
    The meaning should be between 30 to  40 words. and separated 

    Add also an example of the usage of the word separate by #*#
    And add the word separated by #*#
    
    `

    const handleSubmit = async () => {
        setComing(true)
        const response = await sendPrompt(prompt)
        console.log('response from chatgpt', response)
        const result = response.split("#*#")
        console.log(result)
        setMeaning(result[0]);
        setExample(result[1]);
        setSound(result[2])
        setSelectedText('')
        setComing(false)
    }

    const loadPdfFromIndexedDB = async (item = 0) => {
        try {
            await initDB();
            console.log('retrieved');
            const files = await fetchAllFiles();
            const sortedFiles = files.sort((a, b) => b.lastModified - a.lastModified);
            const newFiles = sortedFiles.map(file => file.fileName);
            setLength(newFiles.length - 1);
            setFiles(prev => [...newFiles]);
            console.log("files", files)
            const storedFile = sortedFiles[item];
            //console.log(storedFile);

            if (storedFile) {
                const fileBlob = storedFile.fileBlob;
                if (fileBlob) {
                    const blob = new Blob([fileBlob], { type: 'application/pdf' });

                    // Use FileReader to read the Blob
                    const reader = new FileReader();
                    reader.onloadend = function (event) {
                        const result = event.target.result; // base64 encoded PDF file
                        console.log(result)
                        if (result) {
                            setPdfUrl(result);
                            setLoading(true);
                        }
                    };
                    reader.readAsDataURL(blob); // Reads the Blob as a base64 URL
                }
            }
        } catch (error) {
            console.error("Error loading PDF:", error);
        }
    };


    useEffect(() => {



        loadPdfFromIndexedDB();

        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [pdfFile]);






    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages)
        setPageNumber(1)
        setError(null)
        setLoading(false)
    }

    function changePage(offset) {
        setPageNumber(prevPageNumber => Math.min(Math.max(prevPageNumber + offset, 1), numPages))
    }

    function handleZoomIn() {
        setScale(prevScale => Math.min(prevScale + 0.1, 2.0))
    }

    function handleZoomOut() {
        setScale(prevScale => Math.max(prevScale - 0.1, 0.5))
    }

    function handleFileChange(event) {
        const file = event.target.files[0]; // Get the selected file
        if (file) {
            const reader = new FileReader(); // Create a FileReader instance
            reader.onload = async (e) => {
                const newBlob = new Blob([e.target.result], { type: 'application/pdf' });
                const newFile = { data: newBlob, name: file.name };
                const url = URL.createObjectURL(newBlob); // Create a Blob URL
                setPdfUrl(url); // Set the Blob URL in state

                // Store the file in IndexedDB
                try {
                    await storeFileInIndexedDB(file); // Store the file in the current folder
                    console.log("stored")
                } catch (error) {
                    console.error("Error saving to IndexedDB:", error);
                    setError("Error saving the file to the database. Please try again.");
                    return; // Exit if there's an error
                }

                // Update local state with the new file
                setPdfBlob(newBlob); // Use only the Blob for the viewer
                setPdfFile(newFile);
                setError(null);
                setLoading(true);
            };

            reader.onerror = (e) => {
                console.error("FileReader error:", e);
                setError("Error reading the file. Please try again.");
            };

            reader.onprogress = (e) => {
                if (e.lengthComputable) {
                    const progress = (e.loaded / e.total) * 100; // Calculate upload progress
                    setUploadProgress(progress); // Update progress state
                }
            };

            reader.readAsArrayBuffer(file); // Read the file as an ArrayBuffer
            setIsUploadDialogOpen(false); // Close the upload dialog
            setIsSidebarOpen(false); // Close the sidebar
            setShowChat(false); // Hide the chat
        }
    }

    function handleNewPDF() {
        setIsUploadDialogOpen(true)
        setUploadProgress(0)
    }

    function handleUpload() {
        fileInputRef.current.click()
    }

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
            setIsFullScreen(true)
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen()
                setIsFullScreen(false)
            }
        }
    }

    function clearSelectedText() {
        setSelectedText('')
        if (window.getSelection) {
            window.getSelection().removeAllRanges()
        }
    }





    const SidebarContent = () => (
        <>
            <div className="p-4 ">
                {isMobile ? (
                    <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen} >
                        <DialogTrigger asChild>
                            <Button
                                className="w-full mb-4 p-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold rounded-md shadow-md hover:from-blue-500 hover:to-blue-700 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                variant="outline"
                                onClick={handleNewPDF}
                            >
                                <Plus className="mr-2 h-5 w-5" /> New PDF
                            </Button>

                        </DialogTrigger>
                        <DialogContent className="bg-white p-0">
                            <DialogHeader className="bg-white">
                                <DialogTitle>Upload PDF</DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col items-center justify-center p-6">
                                <div className="p-6 border border-gray-300 rounded-lg shadow-md">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept=".pdf"
                                        className="hidden"
                                    />
                                    <Button
                                        onClick={handleUpload}
                                        variant="outline"
                                        className="w-full py-2 px-4 border-2 border-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-300 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                                    >
                                        <Upload className="mr-2 h-4 w-4" /> Choose PDF
                                    </Button>
                                    {uploadProgress > 0 && uploadProgress < 100 && (
                                        <Progress value={uploadProgress} className="w-full mt-4 bg-blue-100" />
                                    )}
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>


                ) : (
                    <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                className="w-full mb-4 p-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold rounded-md shadow-md hover:from-blue-500 hover:to-blue-700 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                variant="outline"
                                onClick={handleNewPDF}
                            >
                                <Plus className="mr-2 h-5 w-5" /> New PDF
                            </Button>

                        </DialogTrigger>
                        <DialogContent className="bg-white m-0">
                            <DialogHeader className="bg-white mb-0">
                                <DialogTitle className="m-0">Upload PDF</DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col items-center justify-center p-6">
                                <div className="p-6 border border-gray-300 rounded-lg shadow-md">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept=".pdf"
                                        className="hidden"
                                    />
                                    <Button
                                        onClick={handleUpload}
                                        variant="outline"
                                        className="w-full py-2 px-4 border-2 border-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-300 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                                    >
                                        <Upload className="mr-2 h-4 w-4" /> Choose PDF
                                    </Button>
                                    {uploadProgress > 0 && uploadProgress < 100 && (
                                        <Progress value={uploadProgress} className="w-full mt-4 bg-blue-100" />
                                    )}
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
            <ScrollArea className="flex-1">
                <div className="space-y-4">
                    <div className="px-3 py-2">

                    </div>
                    <div className="px-3 py-2">
                        <h3 className="mb-2 px-4 text-lg font-semibold tracking-tight ">
                            Recent
                        </h3>
                        <div className="space-y-1">

                            {
                                files.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-2 border-b border-gray-300"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                onClick={() => {
                                                    loadPdfFromIndexedDB(index);
                                                    setIsSidebarOpen(false);
                                                }}
                                                className="p-2"
                                            >
                                                <FileText className="h-5 w-5" />
                                            </Button>
                                            <span className="text-gray-700">{!isMobile ? truncateFileName(file) : file}</span>
                                            <Button
                                                onClick={() => {
                                                    deleteFileByIndex(length - index);
                                                    deleteByIndex(index)
                                                }}
                                                variant="ghost"
                                                size="icon"
                                                className="text-gray-400 hover:text-red-500 p-2"
                                            >
                                                <Trash2 className="h-6 w-6" />
                                            </Button>
                                        </div>


                                    </div>

                                ))}
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </>
    )

    const MemoizedCard = memo(Card);

    const ChatInterface = () => (
        <div className="flex flex-col h-full">
            <h3 className="text-lg font-semibold mb-2">Chat</h3>
            <ScrollArea className="flex-1">
                <div className="space-y-4">
                    <div className="bg-secondary p-3 rounded-lg">
                        <h4 className="font-semibold mb-2">Greeting Message:</h4>
                        <p className="text-sm">
                            Hello! I'm here to help you understand the content of your PDF. You can select text from the document and I'll provide explanations or answer questions about it.
                        </p>
                    </div>
                    {coming ? <Loader /> : sound ? (
                        <MemoizedCard className="w-full max-w-2xl mx-auto overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
                            <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                                <CardTitle className="flex items-center justify-between">
                                    <Button
                                        className="p-2 text-white hover:bg-white/20 transition-colors duration-200"
                                        disabled={!sound}
                                        onClick={() => speak(sound)}
                                        aria-label="Pronounce word"
                                    >
                                        <Speaker className="h-6 w-6" />
                                        <span className="ml-2 text-sm text-gray-600">Pronounce</span>
                                    </Button>

                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-start space-x-3 text-green-700 dark:text-green-300">
                                    <Lightbulb className="h-5 w-5 flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="text-lg font-semibold mb-1">Contextual Meaning</h3>
                                        <p className="text-justify">{meaning.replace(/['"]+/g, '')}</p>
                                    </div>
                                </div>
                                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 mt-4">
                                    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Examples</h3>
                                    <ul className="list-disc text-justify pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                                        {example.replace(/['"]+/g, '')}
                                    </ul>
                                </div>
                            </CardContent>
                        </MemoizedCard>
                    ) : <></>}
                </div>
            </ScrollArea>
            <div className="mt-4 relative">
                <Input
                    placeholder="Select a phrase and get insight"
                    value={selectedText}
                    onKeyDown={handleKeyDown}
                    className="pr-20"
                />
                <ToastContainer />
                <div className="absolute right-0 top-0 bottom-0 flex">
                    {selectedText && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-full"
                            onClick={clearSelectedText}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                    <Button
                        className="
                            h-full rounded-l-none 
                            bg-gradient-to-r from-blue-400 to-blue-600 
                            hover:from-blue-600 hover:to-blue-800 
                            text-white 
                            transition-all duration-300 
                            transform hover:scale-105 
                            active:scale-95 
                            shadow-lg hover:shadow-2xl 
                            active:shadow-none
                        "
                        disabled={!selectedText}
                        onClick={!selectedText ? undefined : () => { handleSubmit() }}
                    >
                        <Send className="h-8 w-12" />
                    </Button>

                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col md:flex-row h-screen bg-white text-foreground">
            {/* Mobile Sidebar */}
            {isMobile && (
                <div className='bg-white'>
                    <Drawer open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                        <div className='bg-white'>
                            <DrawerContent>
                                <div className='bg-white'>
                                    <DrawerHeader>
                                        <DrawerTitle>PDF Reader</DrawerTitle>
                                    </DrawerHeader>
                                </div>

                                <div className="bg-white h-full">
                                    <SidebarContent />
                                </div>
                            </DrawerContent>
                        </div>

                    </Drawer>
                </div>

            )}

            {/* Desktop Sidebar */}
            {!isMobile && (
                <div className="w-64 bg-secondary p-4 flex flex-col hidden md:flex">
                    <SidebarContent />
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:flex-row relative">
                {/* PDF Viewer */}
                <div className={`flex-1 bg-background p-4 flex flex-col ${isMobile && showChat ? 'hidden' : ''}`}>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                            {isMobile && (
                                <Button variant="outline" size="icon" className="mr-2" onClick={() => setIsSidebarOpen(true)}>
                                    <Menu className="h-4 w-4" />
                                </Button>
                            )}

                        </div>
                        <div className="flex items-center">
                            <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
                                {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1 bg-muted rounded-lg p-4 md:p-8 overflow-auto" ref={pdfViewerRef}>
                        {loading ? (
                            <div>
                                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js" >
                                    <div style={{ height: '80vh' }}>{pdfUrl && <Viewer fileUrl={pdfUrl} plugins={[defaultLayoutPluginInstance]} onLoadSuccess={() => console.log("PDF Loaded Successfully")} style={{ height: '100vh' }} />}
                                    </div>
                                </Worker>
                            </div>
                        ) : error ? (
                            <div className="text-red-500">{error}</div>
                        ) : pdfFile ? (
                            <Document
                                file={pdfFile.data}
                                onLoadSuccess={onDocumentLoadSuccess}
                                onLoadError={(error) => setError("Failed to load PDF. Please check the file and try again.")}
                            >
                                <Page
                                    pageNumber={pageNumber}
                                    scale={scale}
                                    renderTextLayer={true}
                                    renderAnnotationLayer={true}
                                    width={isMobile ? window.innerWidth - 32 : undefined}
                                />
                            </Document>
                        ) : (
                            <div className="text-center text-muted-foreground">Please select a PDF file to view.</div>
                        )}
                    </div>
                </div>

                {/* Chat Interface */}
                <div className={`w-full md:w-80 bg-background p-4 flex flex-col ${isMobile && !showChat ? 'hidden' : ''}`}>
                    <ChatInterface />
                </div>

                {/* Floating Chat Button and Selected Text */}
                {isMobile && (
                    <div className="fixed bottom-4 right-4 flex items-center space-x-2 z-50">
                        {selectedText && (
                            <div className="flex items-center bg-secondary p-2 rounded-lg shadow-lg max-w-[200px]">
                                <div className="truncate mr-2">{selectedText}</div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 shrink-0"
                                    onClick={clearSelectedText}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                        <Button
                            className="rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 active:from-blue-700 active:to-purple-700 text-white transition-all duration-300 ease-in-out px-4"
                            size="lg"
                            onClick={() => {
                                if (pdfFile) {
                                    setShowChat(!showChat)
                                    if (!showChat && selectedText) {
                                        // If opening chat and there's selected text, you might want to trigger a search here
                                    }
                                } else {
                                    setIsUploadDialogOpen(true)
                                }
                            }}
                        >
                            {pdfFile ?
                                (showChat ? <FileText className="h-10 w-10 mr-2" /> : <MessageCircle className="h-10 w-10 mr-2" />)
                                : <Upload className="h-10 w-10 mr-2" />
                            }
                            {pdfFile ? (showChat ? "View PDF" : "Chat") : "Upload PDF"}
                        </Button>


                    </div>
                )}
            </div>
        </div>
    )
}