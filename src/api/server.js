

export async function getPreviews(){
    return fetch(
        "https://podcast-api.netlify.app"
    ).then(
        response => {
            if (response.ok) return response.json();

            else throw new Error(`Failed to fetch Previews.\nServer code ${response.status}.`);
        }
    );
};


export async function getGenre(genreID){
    return fetch(
        `https://podcast-api.netlify.app/genre/${genreID}`
    ).then(
        response => {
            if (response.ok) return response.json();

            else throw new Error(`Failed to fetch Genre Data.\nServer code ${response.status}.`);
        }
    );
};

export async function getShowInfo(showID){
    return fetch(
        `https://podcast-api.netlify.app/id/${showID}`
    ).then(
        response => {
            if (response.ok) return response.json();

            else throw new Error(`Failed to fetch Show Data.\nServer code ${response.status}.`);
        }
    );
};