

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

export const showGenres = {
    1: "Personal Growth",
    2: "Investigative Journalism",
    3: "History",
    4: "Comedy",
    5: "Entertainment",
    6: "Business",
    7: "Fiction",
    8: "News",
    9: "Kids and Family",
};


export async function loadInitialData() {
    return {
        previews: getPreviews(),
        genres: {
            1: getGenre(1),
            2: getGenre(2),
            3: getGenre(3),
            4: getGenre(4),
            5: getGenre(5),
            6: getGenre(6),
            7: getGenre(7),
            8: getGenre(8),
            9: getGenre(9),
        },
        shows: {}
    };
}