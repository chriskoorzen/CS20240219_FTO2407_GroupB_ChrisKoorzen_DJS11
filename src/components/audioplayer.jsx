import { useRef, useState, useEffect } from "react";
import { IconButton, slider, Slider } from "@material-tailwind/react";

import placeholderAudio from "../dev/placeholder-audio.mp3";
// import placeholderAudio from "../dev/pitch.mp3";


export function AudioPlayer({ audioURL, progress=0 }){
    const audioElement = useRef(null);
    const audioSlider = useRef(null);
    const [playbackSliderMax, setPlaybackSliderMax] = useState(progress);
    const [play, setPlay] = useState(false);


    useEffect(()=>{
        audioElement.current.fastSeek(progress);
    }, [progress])


    function sliderChange(event){
        audioElement.current.fastSeek(event.target.value)
        console.log("sliderChange: Now at", event.target.value)
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
        audioSlider.current.value = event.target.currentTime.toString();
    };

    function handleLoaded(event){   // When ready to play
        console.log("Total duration", event.target.duration);
        if (isNaN(event.target.duration) || !isFinite(event.target.duration)){
            throw new Error("Expected a number for duration")
        };

        setPlaybackSliderMax(Math.round(event.target.duration));
    };

    return (

        <div className="h-16 w-full bg-gray-700">

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
                onChange={sliderChange}
            />


            <audio
                ref={audioElement}
                src={placeholderAudio}
                onCanPlay={handleLoaded}
                onTimeUpdate={audioSliderUpdate}
                onEnded={handlePlayPause}
            ></audio>
        </div>
    );
};
