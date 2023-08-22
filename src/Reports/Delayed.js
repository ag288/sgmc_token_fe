import api from "../api"

export const DelayedReport = ({ doctor }) => {


    const [list, setList] = useState([])

    useEffect(() => {

        api.token.fetchDelayedReport(doctor).then((res) => {
            setList(JSON.parse(res.data).result)
        })
    }, [])
    return (
        <>
            <Table>

            </Table>
        </>
    )
}