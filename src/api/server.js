

export async function getPreviews(){
    return fetch(
        "https://podcast-api.netlify.app"
    ).then(
        response => {
            if (response.ok) return response.json();

            else throw new Error(`Failed to fetch Previews.\nServer code ${response.status}.`);
        }
    ).then(                 // Index show previews by id
        dataArray => {
            const dataObject = {};

            dataArray.forEach(element => {
                dataObject[element.id] = element
            });

            return dataObject;
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
