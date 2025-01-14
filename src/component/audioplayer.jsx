import { useRef, useState, useEffect, useContext } from "react";
import { 
    IconButton,
    Menu,
    MenuHandler,
    MenuList,
    Button,
} from "@material-tailwind/react";

import { settings, users, showUUID } from "../api/storage";
import { secondsToClockDisplay } from "../utils/datetime";
import { AudioContext } from "../page/layouts";


export function AudioPlayer({ audioUrl, progress, autoplay }){

    const { userID, episode } = useContext(AudioContext);
    const [maxPlaybackDuration, setMaxPlaybackDuration] = useState(0);
    const [currentPlayback, setCurrentPlayback] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(
        settings.get("volume") ? settings.get("volume") : 0.5         // Do not assume "volume" setting exists yet
    );

    const audioElement = useRef(null);
    const audioSlider = useRef(null);
    const volumeSlider = useRef(null);

    window.onbeforeunload = (event) => {
        if (isPlaying) event.preventDefault();
    };


    // -- Audio Element functionality --
    function handleLoadingProgress(){           // when still downloading data
    };
    
    function handleMetaDataLoaded(audioEvent){       // when metadata is known eg. audio duration
        setMaxPlaybackDuration(Math.round(audioEvent.target.duration));
        setCurrentPlayback(Math.round(audioEvent.target.duration * progress));
        audioElement.current.fastSeek(Math.round(audioEvent.target.duration * progress));
    };

    function handleFirstFrameReady(){           // current frame is loaded
        audioElement.current.volume = volume;
        playAudio();             // sync audioElement with comp state
    };

    function handleAudioPlayPartlyReady(){      // when enough data has buffered to start playing
    };

    function handleAudioTimeUpdate(audioEvent){      // when playing or seeking
        setCurrentPlayback(audioEvent.target.currentTime);
        audioSlider.current.value = audioEvent.target.currentTime;
        if(userID){
            const data = users.getUserData(userID);
            data.progress[showUUID.get(episode.showID, episode.seasonID, episode.episodeID)] = (currentPlayback/maxPlaybackDuration).toFixed(2);
            users.updateData(userID, data);
        };
    };

    // -- Audio Element user interactions --
    function playAudio(){
        audioElement.current.play()
            .catch((error)=>{console.error("audio play button click failed.", error)});
        setIsPlaying(true);
    };

    function stopAudio(){
        audioElement.current.pause();
        setIsPlaying(false);
    };


    // -- Audio Slider functionality --
    function handleUserDraggingSlider(sliderEvent){
        // update Audio time: will also trigger a timeUpdate event
        audioElement.current.fastSeek(sliderEvent.target.value);
    };


    // -- Audio Volume functionality
    function volumeSliderDrag(volumeEvent){
        audioElement.current.volume = volumeEvent.target.value;
        setVolume(parseFloat(volumeEvent.target.value));
    };

    function volumeSlideRelease(volumeEvent){
        settings.update("volume", volumeEvent.target.value);
    };

    return(
        <div className="flex flex-row gap-4 items-center px-4 h-16 w-1/2 bg-gray-900">
            <audio
                key={showUUID.get(episode.showID, episode.seasonID, episode.episodeID)}
                ref={audioElement}
                src={audioUrl}

                onProgress={handleLoadingProgress}
                onLoadedMetadata={handleMetaDataLoaded}
                onLoadedData={handleFirstFrameReady}
                onCanPlay={handleAudioPlayPartlyReady}

                onTimeUpdate={handleAudioTimeUpdate}
                onEnded={stopAudio}
            ></audio>

            {isPlaying ? 
                <IconButton onClick={stopAudio} className="bg-gray-800">
                    <i className="fas fa-pause" />
                </IconButton>
                :
                <IconButton onClick={playAudio} className="bg-gray-800">
                    <i className="fas fa-play" />
                </IconButton>
            }

            <input
                className="grow h-2 rounded-lg cursor-pointer dark:bg-gray-700 accent-purple-600"
                ref={audioSlider}
                type="range"
                min={0}
                max={maxPlaybackDuration}
                onChange={handleUserDraggingSlider}
            />

            <div className="flex text-white">
                <p>{secondsToClockDisplay(currentPlayback)}</p>
                <p>/</p>
                <p>{secondsToClockDisplay(maxPlaybackDuration)}</p>
            </div>

            <Menu placement="top" allowHover={true}>
                <MenuHandler>
                    <Button className="flex items-center gap-3 outline-none bg-gray-800">
                        <i className={
                            volume > 0.4 ? "fas fa-volume-up w-4 text-left":
                            volume > 0 ? "fas fa-volume-down w-4 text-left":
                            "fas fa-volume-off w-4 text-left"
                        }/>
                        Volume
                    </Button>
                </MenuHandler>
                <MenuList className="h-fit min-w-fit bg-gray-800">
                    <input
                        ref={volumeSlider}
                        className="h-28 outline-none accent-purple-600"
                        orient="vertical"
                        type="range"
                        defaultValue={volume}
                        min={0}
                        max={1}
                        step={0.05}
                        onChange={volumeSliderDrag}
                        onMouseUp={volumeSlideRelease}
                    />
                </MenuList>
            </Menu>
        </div>
    );
};
