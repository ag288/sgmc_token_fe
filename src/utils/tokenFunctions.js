
import { Text, Toast } from '@chakra-ui/react'
import api from '../api'

export const types = {
    "Review": "R",
    "New consultation": 'F',
    "Other": "O",
    "Long slot": "L"
}

export function compareFn(a, b) {
    /// console.log(a)
    // const start1 = new Date()
    // start1.setHours(a.split(":")[0], a.split(":")[1], 0)
    // //const end1 = new Date()
    let difference1

    difference1 = b.getTime() - a.getTime();

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

    if (item.status == "completed")
        return "gray.200"
    else if (item.status == "cancelled")
        return "red.200"
    else if (item.status == "current")
        return "green.100"
    else if (item.slot.includes("W"))
        return "yellow.100"
    // else if ((!item.time_of_arrival) && compareFn(item.timeInEst, new Date())) {
    //     if (item.status != "delayed") {
    //         item.status = "delayed"
    //         api.token.setAsDelayed({ item }).then((res) => {
    //         })
    //     }
    //     return "white"
    // }
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
    return list

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




export function onCall(item, current, doctor, toast, setIsLoading) {
    // if (current) {
    //     setOrigin("call")
    //     onOpenReview()
    // }
    // else {
    // setTimeout(() => {
    // playActive()
    //  }, 2000)
    // const confirm = window.confirm(`You are going to call ${item.name}`)
    // if (confirm) {
    //     //  playActive()
    call(item, current, doctor, toast, setIsLoading)
    //  }
    // }
}

export function call(item, current, doctor, toast, setIsLoading) {
    //console.log(doctor)
    //  playActive()
    toast({
        title: `Calling ${item.name}`,
        status: 'info',
        duration: 3000,
        isClosable: false,
        position: "top"
    })
    setIsLoading(true)
    api.token.callNewToken({ current, item, doctor }).then((res) => {
        // setCurrent(item)
        setIsLoading(false)
        window.location.reload()
    }).catch(err => {
        toast({
            title: "An error occured",
            status: 'error',
            duration: 3000,
            isClosable: false,
            position: "top"
        })
    })
}

export function onCompleted(item, settings, onOpenReview, doctor, setIsLoading, user) {

    if (settings.enableReview && user == 1) {

        onOpenReview()

    }
    else {
        // const confirm = window.confirm(`You are going to mark ${item.name} as completed`)
        // if (confirm) {
        completed(doctor, setIsLoading)
        //  }
    }

}

function completed(doctor, setIsLoading) {

    setIsLoading(true)
    api.token.setAsCompleted({ doctor }).then((res) => {
        setIsLoading(false)
        window.location.reload()
    }
    )

}

export function findPatientInitials(item) {
    const name = item.name.split(" ")
    let patientInitials = ""
    for (var i = 0; i < name.length; i++) {
        patientInitials += `${name[i].substring(0, 1)}`
    }
    return patientInitials
}