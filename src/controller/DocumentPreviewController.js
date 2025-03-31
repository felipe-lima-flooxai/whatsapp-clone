const pdfjsLib = require("pdfjs-dist");
const path = require('path');
pdfjsLib.GlobalWorkerOptions.wokerSrc = path.resolve(__dirname, "../../dist/pdf.worker.bundle.js");

export class DocumentPreviewController {
    constructor(file){
        this._file = file;

        
    }

    getPreviewData(){
            return new Promise((s,f)=>{
                let reader = new FileReader();

                switch(this._file.type){
                    case "image/png":
                    case "image/jpg":
                    case "image/jpeg":
                    case "image/gif":
                        
                        reader.onload = e =>{

                            s({
                                src: reader.result,
                                info: this._file.name
                            });
                        }

                        reader.onerror = e=>{
                            f(e);
                        }

                        reader.readAsDataURL(this._file);
                        break;

                    case "application/pdf":
                        reader.onload = e=>{

                            //promise do getDocument
                            pdfjsLib.getDocument(new Uint8Array(reader.result)).then(pdf=>{

                                //promise do pdf
                                pdf.getPage(1).then(page=>{
                                    
                                    let viewport = page.getViewport(1);
                                    let canvas = document.createElement("canvas");
                                    let canvasContext = canvas.getContext("2d");

                                    canvas.width = viewport.width;
                                    canvas.height = viewport.height;

                                    //renderizar a página
                                    page.render({
                                        canvasContext,
                                        viewport

                                    }).then(()=>{

                                        s({
                                            src:canvas.toDataURL("image/png"),
                                            info: `${pdf.numPages} Página(s)`
                                        })

                                    }).catch(err=>{
                                        f(err);
                                    });
                                    //fim da renderização
                            
                                }).catch(err=>{
                                    f(err);
                                });
                                //fim promise do pdf
                            }).catch(err=>{
                                f(err)
                            });
                            //fim promise do getDocument

                        };
                        reader.readAsArrayBuffer(this._file)
                        break;

                    default:
                        f();
                        break;
                }
            })
    }
}