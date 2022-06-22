import { Text } from '@chakra-ui/react'

export function findBg(item) {
    if (item.status == "completed")
        return "gray.200"
    else if (item.status == "cancelled")
        return "red.200"
    else if (item.status == "current" && item.timeOut)
        return "gray.200"
    else if (item.status == "current")
        return "green.100"
    else return "white"
}

export function filterList(list, showCompleted) {
    return list.filter(item => {
        if ((item.status == "completed" || item.status == "cancelled") && showCompleted) {
            return true
        }
        else if ((item.status == "completed" || item.status == "cancelled") && !showCompleted) {
            return false
        }
        else return true

    })
}

export function DiffMinutes({ time1, time2, item }) {

    const start = new Date("2020-01-01 " + time1)
    const end = new Date("2020-01-01 " + time2)
    let difference, color, sign
    if (end.getTime() > start.getTime()) {
        difference = end.getTime() - start.getTime();
        color = "green"
    }
    else {
        difference = start.getTime() - end.getTime()
        color = "red"
    }
    difference = difference / 1000;
    let hourDifference = Math.floor(difference / 3600);
    difference -= hourDifference * 3600;
    let minuteDifference = Math.floor(difference / 60);
    difference -= minuteDifference * 60;
    let time
    if (hourDifference == 0)
        time = `${minuteDifference}m`
    else
        time = `${hourDifference}:${minuteDifference}`
    return (
        <Text color={color}>{item.timeIn ? time : ""} </Text>
    )
    // return (`${sign}${hourDifference}:${minuteDifference}`); // Can use Math.floor or Math.ceil depends up to you
}
