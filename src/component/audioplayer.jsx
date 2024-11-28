import { useRef, useState, useEffect, useContext } from "react";
import { 
    IconButton,
    Menu,
    MenuHandler,
    MenuList,
    Button,
} from "@material-tailwind/react";

import { settings, users, showUUID } from "../api/storage";
import { AudioContext } from "../page/layouts";


export function AudioPlayer({ audio }){
    // audio obj = {URL, progress}
    const { userID, episode } = useContext(AudioContext);
    const autoPlay = false;
    const audioElement = useRef(null);
    const audioSlider = useRef(null);
    const [maxPlaybackDuration, setMaxPlaybackDuration] = useState(audio.progress);
    const [currentPlayback, setCurrentPlayback] = useState(audio.progress);
    const [play, setPlay] = useState(false);

    console.log("reload AudioPlayer")
    useEffect(()=>{
        console.log("useEffect")
        audioElement.current.load();
        audioElement.current.fastSeek(audio.progress);
        // pauseAudio();
    }, [audio])


    function audioSliderDrag(event){
        audioElement.current.fastSeek(event.target.value)
        console.log("audioSliderDrag", event.target.value)
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

    function pauseAudio(){
        console.log("pauseAudio")
        audioElement.current.pause();
        setPlay(false);
    };

    function playAudio(){
        console.log("playAudio")
        audioElement.current.play()
        .catch((error)=>{console.error("playback failed", error)});
        setPlay(true);
    };

    function audioSliderUpdate(event){      // when playing
        console.log("audioSliderUpdate")
        audioSlider.current.value = event.target.currentTime;
        setCurrentPlayback(audioSlider.current.value);
        saveProgress(currentPlayback, maxPlaybackDuration);
    };

    function audioMetaDataLoad(event){      // when metadata is known
        console.log("audioMetaDataLoad", event.target.duration);
        if (isNaN(event.target.duration) || !isFinite(event.target.duration)){
            throw new Error("Expected a number for duration")
        };

        setMaxPlaybackDuration(Math.round(event.target.duration));
    };

    function saveProgress(currentTime, totalTime){
        if (userID){
            const data = users.getUserData(userID);
            data.progress[showUUID.get(episode.showID, episode.seasonID, episode.episodeID)] = (currentTime / totalTime).toFixed(2);
            users.updateData(userID, data);
        };
    };

    return (

        <div className="flex flex-row gap-4 items-center px-4 h-16 w-1/2 bg-gray-900">

            <IconButton onClick={handlePlayPause} className="bg-gray-800">
                <i className={play ? "fas fa-pause": "fas fa-play"} />
            </IconButton>
            
            <input
                ref={audioSlider}
                className="grow h-2 rounded-lg cursor-pointer dark:bg-gray-700"
                type="range"
                defaultValue={audio.progress}
                min={0}
                max={maxPlaybackDuration}
                onChange={audioSliderDrag}
                onMouseUp={slideRelease}
            />
            <div className="flex text-white">
                <p>{transformSeconds(currentPlayback)}</p>
                <p>/</p>
                <p>{transformSeconds(maxPlaybackDuration)}</p>
            </div>

            <VolumeControl audioElement={audioElement}/>

            <audio            
                ref={audioElement}
                src={audio.URL}
                onLoadedMetadata={audioMetaDataLoad}
                onTimeUpdate={audioSliderUpdate}
                onEnded={handlePlayPause}
                onLoadStart={()=>{console.log("audio loaidng resource")}}
                onCanPlay={()=>{if(autoPlay)playAudio()}}
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
