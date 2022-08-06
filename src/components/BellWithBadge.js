import { Box, Circle, IconButton } from "@chakra-ui/react"
import { css } from "@emotion/react"
import { FaBell, FaFile } from "react-icons/fa"

export const BellWithBadge = ({ onClick, count }) => {
    return (
        <Box>
            <IconButton
                css={css`
              position: relative !important;
            `}
                py={'2'}
                colorScheme={'gray'}
                aria-label={'Notifications'}
                size={'lg'}
                onClick={onClick}
                icon={<>
                    <FaBell color={'gray.750'} />
                    {count > 0 ? <Circle size='14px' color={'white'} position={'absolute'} top={'8px'} right={'9px'} fontSize={'0.8rem'}
                        bgColor={'red'} zIndex={9999} p={'3px'}>
                        {count}
                    </Circle> : null}
                </>}
            />
        </Box>
    )
}


export const DuplicatePatientsNotif = ({ onClick, count }) => {
    return (
        <Box>
            <IconButton
                css={css`
              position: relative !important;
            `}
                py={'2'}
                colorScheme={'gray'}
                aria-label={'Notifications'}
                size={'lg'}
                onClick={onClick}
                icon={<>
                    <FaFile color={'gray.750'} />
                    {count > 0 ? <Circle size='14px' color={'white'} position={'absolute'} top={'8px'} right={'9px'} fontSize={'0.8rem'}
                        bgColor={'red'} zIndex={9999} p={'3px'}>
                        {count}
                    </Circle> : null}
                </>}
            />
        </Box>
    )
}