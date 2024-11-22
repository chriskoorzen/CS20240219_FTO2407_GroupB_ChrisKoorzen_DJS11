import { useRef, useState, useEffect } from "react";
import { 
    IconButton,
    Menu,
    MenuHandler,
    MenuList,
    Button,
} from "@material-tailwind/react";

import placeholderAudio from "../dev/placeholder-audio.mp3";
// import placeholderAudio from "../dev/pitch.mp3";


export function AudioPlayer({ audioURL, progress=0 }){
    const audioElement = useRef(null);
    const audioSlider = useRef(null);
    const [playbackSliderMax, setPlaybackSliderMax] = useState(progress);
    const [play, setPlay] = useState(false);

    console.log("reload parent")
    useEffect(()=>{
        audioElement.current.fastSeek(progress);
    }, [progress])


    function audioSliderDrag(event){
        audioElement.current.fastSeek(event.target.value)
        console.log("audioSliderDrag: Now at", event.target.value)
    };

    function handlePlayPause(event){
        if (play){  // Asking for pause action
            console.log("paused!")
            audioElement.current.pause();

        } else {    // Asking for play action
            console.log("playing!")
            audioElement.current.play()
            .catch((error)=>{console.error("playback button failed", error)});
        };

        setPlay(val=> !val);
    };

    function audioSliderUpdate(event){
        audioSlider.current.value = event.target.currentTime;
    };

    function audioMetaDataLoad(event){
        console.log("Total duration", event.target.duration);
        if (isNaN(event.target.duration) || !isFinite(event.target.duration)){
            throw new Error("Expected a number for duration")
        };

        setPlaybackSliderMax(Math.round(event.target.duration));
    };

    function slideRelease(event){
        console.log("audio slideRelease", event.target.value);
    };

    return (

        <div className="flex flex-row items-center px-4 mt-72 h-16 w-full bg-gray-700">

            <IconButton onClick={handlePlayPause} >
                <i className={play ? "fas fa-pause": "fas fa-play"} />
            </IconButton>
            
            <input
                ref={audioSlider}
                className="mx-5 w-72 h-2 rounded-lg cursor-pointer dark:bg-gray-700"
                type="range"
                defaultValue={progress}
                min={0}
                max={playbackSliderMax}
                onChange={audioSliderDrag}
                onMouseUp={slideRelease}
            />

            <VolumeControl audioElement={audioElement}/>

            <audio
                ref={audioElement}
                src={placeholderAudio}
                onLoadedMetadata={audioMetaDataLoad}
                onTimeUpdate={audioSliderUpdate}
                onEnded={handlePlayPause}
            ></audio>
        </div>
    );
};


function VolumeControl({audioElement}){
    const [volume, setVolume] = useState(0.5);
    const volumeSlider = useRef(null);

    function volumeSliderDrag(event){
        audioElement.current.volume = event.target.value;
        setVolume(parseFloat(event.target.value));
        console.log("volumeSliderDrag: Now at", event.target.value)
    };

    function slideRelease(event){
        console.log("volume slideRelease", event.target.value);
    };

    return (
        <Menu placement="top" allowHover={true}>
            <MenuHandler>
                <Button className="flex items-center gap-3">
                    <i className={
                        volume > 0.35 ? "fas fa-volume-up w-4": 
                        volume > 0 ? "fas fa-volume-down w-4":
                        "fas fa-volume-off w-4"
                    }/>
                    Volume
                </Button>
            </MenuHandler>
            <MenuList className="h-fit min-w-fit">
                    <input
                        ref={volumeSlider}
                        className="h-28"
                        orient="vertical"
                        type="range"
                        defaultValue={volume}
                        min={0}
                        max={1}
                        step={0.05}
                        onChange={volumeSliderDrag}
                        onMouseUp={slideRelease}
                    />
            </MenuList>
        </Menu>
    )
}