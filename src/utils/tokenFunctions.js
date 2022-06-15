export function findBg(item) {
    if (item.status == "completed")
        return "gray.200"
    else if (item.status == "cancelled")
        return "red.400"
    else if (item.status == "current")
        return "green.100"
    else return "white"
}

export function filterList(list, showCompleted) {
    return list.filter(item => {
        if (item.status != "cancelled") {
            if ((item.status == "completed") && showCompleted) {
                return true
            }
            else if ((item.status == "completed") && !showCompleted) {
                return false
            }
            else return true
        }
        return false
    })
}