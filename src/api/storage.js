/**
 * LocalStorage object structure
 * {
 *      history: Array<[Episode, datestamp]>
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
const historyKey = "history";

export function getHistory(){
    return getStorageObject(historyKey);
};

export function clearHistory(){
    updateStorage(historyKey, new Array());  // Just replace with new array
};

export function pushToHistory(episode, datestamp){
    const history = getStorageObject(historyKey);

    history.push([episode, datestamp]);

    updateStorage(historyKey, history);
};


//  Listening Progress
const progressKey = "progress";

export function getListeningProgress(){
    getStorageObject(progressKey);
};

export function resetListeningProgress(episode){
    const progress = getStorageObject(progressKey);

    const index = progress.findIndex((element)=>{
        let isEpisode = true;

        isEpisode = (isEpisode && element[0].showID === episode.showID);
        isEpisode = (isEpisode && element[0].seasonID === episode.seasonID);
        isEpisode = (isEpisode && element[0].episodeID === episode.episodeID);

        return isEpisode;
    });

    progress.splice(index, 1);

    updateStorage(progressKey, progress);
};

export function resetListeningProgressAll(){
    updateStorage(progressKey, new Array());
};

export function updateListeningProgress(episode, timestamp){
    const progress = getStorageObject(progressKey);

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

    updateStorage(progressKey, progress);
};

// Favorites
const favoritesKey = "favorites";

export function getFavorites(){
    return getStorageObject(favoritesKey);
};

export function saveFavorites(episode){
    const favorites = getStorageObject(favoritesKey);

    favorites.push(episode);

    updateStorage(favoritesKey, favorites);
};

export function removeFavorites(episode){
    const favorites = getStorageObject(favoritesKey);

    const index = favorites.findIndex((element)=>{
        let isEpisode = true;

        isEpisode = (isEpisode && element.showID === episode.showID);
        isEpisode = (isEpisode && element.seasonID === episode.seasonID);
        isEpisode = (isEpisode && element.episodeID === episode.episodeID);

        return isEpisode;
    });

    favorites.splice(index, 1);

    updateStorage(favoritesKey, favorites);
};

export function clearFavorites(){
    updateStorage(favoritesKey, new Array());
};
