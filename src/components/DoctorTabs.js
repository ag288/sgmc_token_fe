import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import { useContext } from "react"
import { TokenList } from "../Admin/HomePage/TokenList"
import { AppContext } from "../App"
import { filterDoctor } from "../utils/tokenFunctions"

export const DoctorTabs = ({component}) => {

    const {user, doctors} = useContext(AppContext)
    return(
<Tabs  variant="solid-rounded">
<TabList>
  {filterDoctor(doctors, user.userID).map((doctor, index) => <Tab>{doctor.name}</Tab>)}
</TabList>

<TabPanels>
  {filterDoctor(doctors, user.userID).map((doctor, index) => <TabPanel>
    <>
    {component }
    </>
  </TabPanel>)}
</TabPanels>
</Tabs>
    )
}