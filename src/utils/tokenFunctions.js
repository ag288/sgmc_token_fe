
import { Text } from '@chakra-ui/react'
import api from '../api'



function compareFn(a, b=new Date()) {
    /// console.log(a)
    const start1 = new Date()
    start1.setHours(a.split(":")[0], a.split(":")[1], 0)
    const end1 = new Date()
    let difference1, difference2, sign

    difference1 = end1.getTime() - start1.getTime();

    // console.log(start1)
    // console.log(end1)

    if (difference1 < 0) {
        return false;
    }
    if (difference1 >= 0) {
        return true;
    }

}



export function findBg(item) {
    console.log(item.status)
    if (item.status == "completed")
        return "gray.200"
    else if (item.status == "cancelled")
        return "red.200"
    else if (item.status == "current")
        return "green.100"
    else if (item.slot.includes("W"))
        return "yellow.100"
    else if ((!item.time_of_arrival) && compareFn(item.timeInEst)) {
        item.status="delayed"
        api.token.setAsDelayed({ item }).then((res) => {
            console.log("hi")
        })
        return "white"
    }
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

export function filterDoctor(list, user) {
    //console.log(list)
    return list.filter(item => {
        if (user == 1) {
            if (item.doctorID == 1)
                return true
        }
        else {
            if (user == 3) {
                return item.department == "Orthopedics"
            }

            else return true
        }

    })

}

export function DiffMinutes({ time1, time2, item }) {

    const start = new Date("2020-01-01 " + time1)
    const end = new Date("2020-01-01 " + time2)
    let difference, color, sign
    if (end.getTime() > start.getTime() || end.getTime() == start.getTime()) {
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


export function logout(setUser) {
    setUser(null)
    localStorage.removeItem("currentUser")
}