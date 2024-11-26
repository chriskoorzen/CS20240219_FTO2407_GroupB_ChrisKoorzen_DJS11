

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

export const genreStockImages = [
    {id: 1, image: "public/images/personal-growth.jpg"},
    {id: 2, image: "public/images/investigative-journalism.jpg"},
    {id: 3, image: "public/images/history.jpg"},
    {id: 4, image: "public/images/comedy.jpg"},
    {id: 5, image: "public/images/entertainment.jpg"},
    {id: 6, image: "public/images/business.jpg"},
    {id: 7, image: "public/images/fiction.jpg"},
    {id: 8, image: "public/images/news.jpg"},
    {id: 9, image: "public/images/kids-and-family.jpg"},
];


export async function loadInitialData() {
    const previews = getPreviews();
    return {
        previews: previews,
        previewsByIndex: previews.then(
            previews => previews.reduce(((obj, show) => {
                obj[show.id] = show;
                return obj;
            }), {})
        ),
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