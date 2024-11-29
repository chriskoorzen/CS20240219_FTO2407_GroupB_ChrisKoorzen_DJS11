

export function generateUserSuggestions(favoriteShowIDs, previewsByIndex, genreArray){
    const interestedGenres = favoriteShowIDs.reduce((set, showID)=>{
        previewsByIndex[showID].genres.forEach(element => {     // get unique genres from fav shows
            set.add(element);
        });
        return set;
    }, new Set);

    let similarShows = [...interestedGenres].map(genreID => genreArray[genreID-1].shows );  // get shows of similar genre
    similarShows = similarShows.flat();     // flatten
    similarShows = new Set(similarShows);   // filter

    similarShows = similarShows.difference(new Set(favoriteShowIDs));   // remove fav shows

    return [...similarShows].map(showID => previewsByIndex[showID]);    // return array of shows
};