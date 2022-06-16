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

export function diffMinutes(time1, time2) {
    const start = new Date("2020-01-01 " + time1)
    const end = new Date("2020-01-01 " + time2)
    let hours = end.getHours() - start.getHours()
    let minutes = end.getMinutes() - start.getMinutes()
    if (start <= end)
        return (`${Math.abs(hours)}:${Math.abs(minutes)}`); // Can use Math.floor or Math.ceil depends up to you
    else
        return (`-${Math.abs(hours)}:${Math.abs(minutes)}`)

}
