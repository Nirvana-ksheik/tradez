
export const convertUtcToClientDate = ({utcDate}) => {
    console.log("date in utc: ", utcDate);
    var date = new Date(Date.parse(utcDate));
    return date.toLocaleString();
}