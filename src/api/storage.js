/**
 * LocalStorage object structure
 * {
 *      history: Array<[datestamp, Episode]>
 *      favorites: Array<Episode>
 *      progress: Array<[Episode, timestamp]>
 * }
 */

const storageKey = "QCast_data";

function getStorageObject(subKey){
    const data = JSON.parse(localStorage.getItem(storageKey));

    if (data[subKey] === undefined){
        return new Array();
    };

    return data[subKey];
};

function updateStorage(subKey, newData){
    const data = JSON.parse(localStorage.getItem(storageKey));
    
    data[subKey] = newData;
    
    localStorage.setItem(storageKey,JSON.stringify(data));
};


// History
export function clearHistory(){
    updateStorage("history", new Array());  // Just replace with new array
};

export function pushToHistory(episode, datestamp){
    const history = getStorageObject("history");

    history.push([datestamp, episode]);

    updateStorage("history", history);
};


//  Listening Progress
export function resetListeningProgress(episode){
    const progress = getStorageObject("progress");

    const index = progress.findIndex((element)=>{
        let isEpisode = true;

        isEpisode = (isEpisode && element[0].showID === episode.showID);
        isEpisode = (isEpisode && element[0].seasonID === episode.seasonID);
        isEpisode = (isEpisode && element[0].episodeID === episode.episodeID);

        return isEpisode;
    });

    progress.splice(index, 1);

    updateStorage("progress", progress);
};

export function resetListeningProgressAll(){
    updateStorage("progress", new Array());
};

export function updateListeningProgress(episode, timestamp){
    const progress = getStorageObject("progress");

    const index = progress.findIndex((element)=>{
        let isEpisode = true;

        isEpisode = (isEpisode && element[0].showID === episode.showID);
        isEpisode = (isEpisode && element[0].seasonID === episode.seasonID);
        isEpisode = (isEpisode && element[0].episodeID === episode.episodeID);

        return isEpisode;
    });

    if (index === -1){      // This is a new "progress"
        progress.push(
            [episode, timestamp]
        );
        return;
    };

    progress[index][1] = timestamp;

    updateStorage("progress", progress);
};

// Favorites
export function saveFavorites(episode){
    const favorites = getStorageObject("favorites");

    favorites.push(episode);

    updateStorage("favorites", favorites);
};

export function removeFavorites(episode){
    const favorites = getStorageObject("favorites");

    const index = favorites.findIndex((element)=>{
        let isEpisode = true;

        isEpisode = (isEpisode && element.showID === episode.showID);
        isEpisode = (isEpisode && element.seasonID === episode.seasonID);
        isEpisode = (isEpisode && element.episodeID === episode.episodeID);

        return isEpisode;
    });

    favorites.splice(index, 1);

    updateStorage("favorites", favorites);
};

export function clearFavorites(){
    updateStorage("favorites", new Array());
};
