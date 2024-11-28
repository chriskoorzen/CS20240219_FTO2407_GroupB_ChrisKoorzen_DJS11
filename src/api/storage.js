/**
 * LocalStorage object structure
 * 
 * settings: {
 *      volume: <float>
 * }
 * 
 * users : {
 *      userID: {
 *          userName: string,
 *          password: string,
 *          loggedIn: Boolean,
 *          data: {             // app context
 *              favorites, progress, history
 *          }
 *      }
 * }
 * 
 * ----
 * showUUID: showId-seasonID-episodeID
 * 
 * favorites : {
 *      UUID: datestamp
 * }
 * 
 * progress : {
 *      UUID: progress
 * }
 * 
 * history : {
 *      dateStamp: UUID
 * }
 * 
 */

export const showUUID = {
    get: (showID, seasonID, episodeID) => {
        return `${showID}-${seasonID}-${episodeID}`;
    },

    parse: (UUID) => {
        const ids = UUID.split("-");
        return {
            showID: String(ids[0]),         // Expect string ids for shows
            seasonID: parseInt(ids[1]),     // Expect number ids for seasons
            episodeID: parseInt(ids[2])     // Expect number ids for episodes
        };
    }
};


// Settings
const settingsKey = "settings";

export const settings = {
    update: (key, value) => {
        let settingData = JSON.parse(localStorage.getItem(settingsKey));

        if (settingData === null) settingData = new Object();

        settingData[key] = value;

        localStorage.setItem(settingsKey, JSON.stringify(settingData));
    },

    get: (key) => {
        const settingData = JSON.parse(localStorage.getItem(settingsKey));

        if (settingData === null) return undefined;

        return settingData[key];
    }
};

// User
const usersKey = "users";

export const users = {
    logIn: (username, password, stayLoggedIn) => {
        const userData = JSON.parse(localStorage.getItem(usersKey));

        if (userData === null) return false;

        const request = Object.entries(userData).find(el => el[1].username === username);
        if (request === undefined) return false;                // username does not match
        if (request[1].password !== password) return false;     // password does not match

        userData[request[0]].stayLoggedIn = stayLoggedIn;           // set user login persistence preference
        localStorage.setItem(usersKey, JSON.stringify(userData));   // save
        return request[0];                                          // return userID
    },

    signUp: (name, username, password, stayLoggedIn) => {
        let userData = JSON.parse(localStorage.getItem(usersKey));

        if (userData === null) userData = new Object();     // Init usersData
        else {
            const exists = Object.values(userData).find(
                el => el.username === username
            );

            if (exists !== undefined) return false;         // This username already exists
        };

        const newID = Date.now();                           // Generate new user ID
        userData[newID] = {                                 // Create new user object
            name: name,
            username: username,
            password: password,
            stayLoggedIn: stayLoggedIn,
            data : {
                favorites: {},
                history: {},
                progress: {}
            },
        };

        localStorage.setItem(usersKey, JSON.stringify(userData));   // save
        return newID;                                               // And return id
    },

    logOut: (userID) => {
        const userData = JSON.parse(localStorage.getItem(usersKey));

        if (userData === null) throw new Error("Log out failed. userData is not initialized");

        if (userData[userID] === undefined) throw new Error("Log out failed. This user does not exist.");

        userData[userID].stayLoggedIn = false;
        localStorage.setItem(usersKey, JSON.stringify(userData));   // save
        return true;                                                // And return success
    },

    updateData: (userID, data) => {
        const userData = JSON.parse(localStorage.getItem(usersKey));

        if (userData === null) throw new Error("Update failed. userData is not initialized");

        if (userData[userID] === undefined) throw new Error("Update failed. This user does not exist.");

        userData[userID].data = data;

        localStorage.setItem(usersKey, JSON.stringify(userData));   // save
    },

    findLoggedInUser: () => {
        const userData = JSON.parse(localStorage.getItem(usersKey));

        if (userData === null) return false;    // No user data yet

        const user = Object.entries(userData).find(el => el[1].stayLoggedIn);

        if (user === undefined) return false;   // No user found

        return user[0];                         // Return ID
    },

    getUserData: (userID) => {
        const userData = JSON.parse(localStorage.getItem(usersKey));

        if (userData === null) return null;

        if (userData[userID] === undefined) return null;

        return userData[userID].data;
    },

    getUserCredentials: (userID) => {
        const userData = JSON.parse(localStorage.getItem(usersKey));

        if (userData === null) return null;

        if (userData[userID] === undefined) return null;

        return userData[userID];
    },
};