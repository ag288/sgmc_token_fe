import React, { useEffect, useState } from 'react';
import {
  Text
} from '@chakra-ui/react';

// countdown timer component  (for otp)

export const Timer = (props) => {

  const [minutes, setMinutes] = useState(props.min);
  const [seconds, setSeconds] = useState(props.sec);  
  console.log(props.min)     // Countdown starts from 40 sec

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval)
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);

        }
      }
    }, 1000)
    return () => {

      clearInterval(myInterval);
      // go back to phone number input page when code expires
      if (minutes === 0 && seconds === 1) { props.setState(false) }
    };
  });

  return (
    <div>
      {minutes === 0 && seconds === 0 ? null
        : <Text fontSize={14} color={'red'}> Code expires in {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</Text>}
    </div>
  )
}










