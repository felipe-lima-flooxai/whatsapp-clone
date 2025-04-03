import { ClassEvent } from "../util/ClassEvent";

export class MicrophoneController extends ClassEvent {
    constructor(){
        super();

        this._available = false; 
        this._mymeType = "audio/webm";

        navigator.mediaDevices.getUserMedia({
            audio: true
        }).then(stream=>{

            this._available = true; 
            
            this._stream = stream;

            this.trigger("ready", this._stream);

        }).catch(error=>{
            console.log(error);
        })
    }

    stop(){
        this._stream.getTracks().forEach(track=>{
            track.stop;
        });
    }

    startRecorder(){
        //comece ligando o audio
        if(this.isAvailable()){

            this._mediaRecorder = new MediaRecorder(this._stream, {
                mymeType: this._mymeType
            });
            this._recordedChunks = [];

            this._mediaRecorder.addEventListener("dataavailable", e=>{
                if(e.data.size) this._recordedChunks.push(e.data);
            });
        }

        //quando parar o audio, faça isso
        this._mediaRecorder.addEventListener("stop", e=>{
            let blob = new Blob(this._recordedChunks, {
                type: this._mymeType
            });

            let filename = `rec${Date.now()}.webm`


            let audioContext = new AudioContext();

            let reader = new FileReader();
            reader.onload = e =>{
                audioContext.decodeAudioData(reader.result).then(decode=>{

                    //o cara falou: abraçar esse file aqui kkkk
                    let file = new File([blob], filename, {
                        type: this._mymeType,
                        lastModified: Date.now()
                    });

                    this.trigger("recorded", file, decode);
                });

                

            }

            reader.readAsArrayBuffer(blob);

            
        });

        this._mediaRecorder.start();

        this.startTimer();
    }

    stopRecorder(){
        if(this.isAvailable()){
            this._mediaRecorder.stop();
            this.stop();
            this.stopTimer();
        }
    }

    isAvailable(){
        return this._available;
    }

    startTimer(){
        let start = Date.now();
        this._recordMicrophoneInterval = setInterval(()=>{

            this.trigger("recordtimer", (Date.now() - start))

        }, 100);
    }

    stopTimer(){
        clearInterval(this._recordMicrophoneInterval);
    }
}