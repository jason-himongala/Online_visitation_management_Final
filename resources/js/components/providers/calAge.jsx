import dayjs from "dayjs";

export default function calAge(dateString) {
    let age = dayjs().format("YYYY") - dayjs(dateString).format("YYYY");
    let month = dayjs().format("MM") - dayjs(dateString).format("MM");
    let day = dayjs().format("DD") - dayjs(dateString).format("DD");

    if (month < 0 || (month === 0 && day < 0)) {
        age--;
        month = (month + 12) % 12;
    }

    if (day < 0) {
        month--;
        day = (day + 30) % 30;
    }

    return `${age} years, ${month} months, ${day} days`;
}
