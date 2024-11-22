

export async function getPreviews(){
    return fetch(
        "https://podcast-api.netlify.app"
    ).then(
        response => {
            if (response.ok) return response.json();

            else throw new Error(`Server code ${response.status}. Failed to fetch Previews.`);
        }
    );
};


export async function getGenre(genreID){
    return fetch(
        `https://podcast-api.netlify.app/genre/${genreID}`
    ).then(
        response => {
            if (response.ok) return response.json();

            else throw new Error(`Server code ${response.status}. Failed to fetch Genre Data.`);
        }
    );
};

export async function getShowInfo(showID){
    return fetch(
        `https://podcast-api.netlify.app/id/${showID}`
    ).then(
        response => {
            if (response.ok) return response.json();

            else throw new Error(`Server code ${response.status}. Failed to fetch Show Data.`);
        }
    );
};