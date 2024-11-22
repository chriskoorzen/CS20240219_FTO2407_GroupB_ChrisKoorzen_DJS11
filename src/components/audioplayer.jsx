import { useRef, useState, useEffect } from "react";
import { IconButton, slider, Slider } from "@material-tailwind/react";

// import placeholderAudio from "../dev/placeholder-audio.mp3";
import placeholderAudio from "../dev/pitch.mp3";


export function AudioPlayer({ audioURL, progress=0 }){
    const audioElement = useRef(null);
    // const [playbackSliderPosition, setPlaybackSliderPosition] = useState(progress);
    // const [playbackSliderMax, setPlaybackSliderMax] = useState(1);
    const [play, setPlay] = useState(false);
    // const durationRatio = useRef();

    // function handleSliderClick(event){
    //     if (play) audioElement.current.pause();

    //     console.log("Clicked", event.target.value)
    // };

    // function handleSliderRelease(event){
    //     const sliderPos = event.target.value;
    //     console.log("release poistion", sliderPos)
    //     // console.log("trying to set", (sliderPos * durationRatio.current))
    //     audioElement.current.fastSeek(sliderPos);

    //     setPlaybackSliderPosition(sliderPos);

    //     if (play) {
    //         audioElement.current.play()
    //         .catch((error)=>{console.error("playback slider release failed", error)});
    //     };
    // };

    // function sliderChange(event){
    //     console.log("sliderChange: Now at", event.target.value)
    //     setPlaybackSliderPosition(event.target.value)
    // };

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

    // function handlePlaybackUpdate(event){
    //     setPlaybackSliderPosition(event.target.currentTime);
    // };

    // function handleLoaded(event){   // When ready to play
    //     console.log("Total duration", event.target.duration);
    //     if (isNaN(event.target.duration) || !isFinite(event.target.duration)){
    //         throw new Error("Expected a number for duration")
    //     };

    //     setPlaybackSliderMax(Math.round(event.target.duration));
    // };

    return (

        <div className="h-16 w-full bg-gray-700">

            <IconButton
                onClick={handlePlayPause}    
            >
                <i className={play ? "fas fa-pause": "fas fa-play"} />
            </IconButton>
            
            {/* <input
                className="w-72 h-2 rounded-lg cursor-pointer dark:bg-gray-700"
                type="range"
                value={playbackSliderPosition}
                min={0}
                max={playbackSliderMax}
                onChange={sliderChange}
                onMouseDown={handleSliderClick}
                onMouseUp={handleSliderRelease}
            /> */}
            

            <audio 
                ref={audioElement}
                src={placeholderAudio}
                // onCanPlay={handleLoaded}
                // onTimeUpdate={handlePlaybackUpdate}
            >

            </audio>
        </div>
    );
};


function ActiveSlider(){

};