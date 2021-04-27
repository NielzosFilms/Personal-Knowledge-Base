export function getDateString(input) {
    const split = input.split("T");
    const date = split[0].split("-");
    const timeString = split[1].split(".");
    const time = timeString[0].split(":");
    return `${time[0]}:${time[1]} ${date[2]}-${date[1]}-${date[0]}`;
}
