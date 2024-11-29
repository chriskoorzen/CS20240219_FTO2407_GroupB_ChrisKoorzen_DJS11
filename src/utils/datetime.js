

export function secondsToClockDisplay(seconds){
    const hours = Math.floor(seconds / 3600);
    seconds = (seconds - hours*3600);

    const minutes = Math.floor(seconds / 60);
    seconds = Math.round(seconds - minutes*60);

    if (hours){
        return `${hours}:${minutes > 9 ? minutes: `0${minutes}`}:${seconds > 9 ? seconds: `0${seconds}`}`;
    };
    return `${minutes}:${seconds > 9 ? seconds: `0${seconds}`}`;
};


export function timestampToMonth(timestamp){
    return new Date(timestamp).toLocaleDateString(undefined, {year: "numeric",month: "short"})
}


export function timestampToDateTime(timestamp){
    return new Date(parseInt(timestamp)).toLocaleString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
};
