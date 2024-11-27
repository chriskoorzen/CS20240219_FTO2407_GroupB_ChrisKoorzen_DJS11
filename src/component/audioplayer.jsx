import { useRef, useState, useEffect } from "react";
import { 
    IconButton,
    Menu,
    MenuHandler,
    MenuList,
    Button,
} from "@material-tailwind/react";

import { settings } from "../api/storage";

// import placeholderAudio from "../dev/placeholder-audio.mp3";
import placeholderAudio from "../dev/pitch.mp3";


export function AudioPlayer({ audioURL, progress=0 }){
    const audioElement = useRef(null);
    const audioSlider = useRef(null);
    const [maxPlaybackDuration, setMaxPlaybackDuration] = useState(progress);
    const [currentPlayback, setCurrentPlayback] = useState(progress);
    const [play, setPlay] = useState(false);

    console.log("reload AudioPlayer")
    useEffect(()=>{
        audioElement.current.fastSeek(progress);
    }, [progress])


    function audioSliderDrag(event){
        audioElement.current.fastSeek(event.target.value)
        console.log("audioSliderDrag: Now at", event.target.value)
    };

    function slideRelease(event){
        console.log("audio slideRelease", event.target.value);
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

    function audioSliderUpdate(event){      // when playing
        audioSlider.current.value = event.target.currentTime;
        setCurrentPlayback(audioSlider.current.value);
    };

    function audioMetaDataLoad(event){      // when metadata is known
        console.log("Total duration", event.target.duration);
        if (isNaN(event.target.duration) || !isFinite(event.target.duration)){
            throw new Error("Expected a number for duration")
        };

        setMaxPlaybackDuration(Math.round(event.target.duration));
    };

    return (

        <div className="flex flex-row gap-4 items-center px-4 h-16 w-fit bg-gray-700">

            <IconButton onClick={handlePlayPause} >
                <i className={play ? "fas fa-pause": "fas fa-play"} />
            </IconButton>
            
            <input
                ref={audioSlider}
                className="w-72 h-2 rounded-lg cursor-pointer dark:bg-gray-700"
                type="range"
                defaultValue={progress}
                min={0}
                max={maxPlaybackDuration}
                onChange={audioSliderDrag}
                onMouseUp={slideRelease}
            />
            <div className="flex">
                <p>{transformSeconds(currentPlayback)}</p>
                <p>/</p>
                <p>{transformSeconds(maxPlaybackDuration)}</p>
            </div>

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


function VolumeControl({ audioElement }){
    const savedVolume = settings.get("volume");
    const [volume, setVolume] = useState(
        savedVolume ? savedVolume : 0.5         // Do not assume "volume" setting exists yet
    );
    const volumeSlider = useRef(null);

    console.log("reload VolumeControl")
    function volumeSliderDrag(event){
        audioElement.current.volume = event.target.value;
        setVolume(parseFloat(event.target.value));
        console.log("volumeSliderDrag: Now at", event.target.value)
    };

    function slideRelease(event){
        console.log("volume slideRelease", event.target.value);
        settings.update("volume", event.target.value);
    };

    return (
        <Menu placement="top" allowHover={true}>
            <MenuHandler>
                <Button className="flex items-center gap-3 outline-none">
                    <i className={
                        volume > 0.35 ? "fas fa-volume-up w-4 text-left":
                        volume > 0 ? "fas fa-volume-down w-4 text-left":
                        "fas fa-volume-off w-4 text-left"
                    }/>
                    Volume
                </Button>
            </MenuHandler>
            <MenuList className="h-fit min-w-fit">
                    <input
                        ref={volumeSlider}
                        className="h-28 outline-none"
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


function transformSeconds(seconds){
    const hours = Math.floor(seconds / 3600);
    seconds = (seconds - hours*3600);

    const minutes = Math.floor(seconds / 60);
    seconds = (seconds - minutes*60);

    if (hours){
        return `${hours}:${minutes > 9 ? minutes: `0${minutes}`}:${seconds > 9 ? seconds: `0${seconds}`}`;
    };
    return `${minutes}:${seconds > 9 ? seconds: `0${seconds}`}`;
};
