import { Button, Grid, Loading, Text } from "@nextui-org/react";
import HostInfo from "pipebomb.js/dist/HostInfo";
import styles from "../styles/Server.module.scss";
import { MdLockOutline, MdLockOpen, MdSignalWifiBad, MdRefresh, MdOutlineDelete } from "react-icons/md";
import ServerIndex from "../logic/ServerIndex";
import { IconContext } from "react-icons";

interface Props {
    hostInfo: HostInfo,
    status: "secure" | "insecure" | "offline" | "checking" | "unknown",
    connectCallback: (hostInfo: HostInfo, status: string) => void
}

export default function Server({ hostInfo, status, connectCallback }: Props) {
    const innerHTML = (() => {
        switch (status) {
            case "offline":
                return <MdSignalWifiBad className={styles.icon} />
            case "secure":
                return <MdLockOutline className={styles.icon} />
            case "insecure":
                return <MdLockOpen className={styles.icon} />
            default:
                return <Loading className={styles.icon} loadingCss={{ $$loadingSize: "50px", $$loadingBorder: "6px"}}></Loading>;
        }
    })();

    return (
        <div className={styles.container}>
        <Text h3 className={styles.name}>{hostInfo.name}</Text>
            <Grid.Container gap={0.5}>
                <Grid>
                    <IconContext.Provider value={{size: "1.5em"}}>
                        {innerHTML}
                    </IconContext.Provider>
                </Grid>
                <Grid>
                    <Text h5>{hostInfo.host}</Text>
                </Grid>
            </Grid.Container>
            <div className={styles.buttonContainer}>
                <Button auto color="gradient" size="lg" onPress={() => connectCallback(hostInfo, status)} disabled={!["secure", "insecure"].includes(status)}>Connect</Button>
                <Button auto light className={styles.smallButton} onPress={() => ServerIndex.getInstance().checkServer(hostInfo)}><MdRefresh className={styles.buttonIcon} /></Button>
                <Button auto light className={styles.smallButton} onPress={() => ServerIndex.getInstance().removeServer(hostInfo.host)}><MdOutlineDelete className={styles.buttonIcon} /></Button>
            </div>
        </div>
    )
}