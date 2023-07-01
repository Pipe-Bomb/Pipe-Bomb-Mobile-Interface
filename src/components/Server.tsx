import { Button, Grid, Loading, Text } from "@nextui-org/react";
import HostInfo from "pipebomb.js/dist/HostInfo";
import styles from "../styles/Server.module.scss";
import { MdLockOutline, MdLockOpen, MdSignalWifiBad, MdRefresh, MdOutlineDelete } from "react-icons/md";
import ServerIndex from "../logic/ServerIndex";
import { IconContext } from "react-icons";
import CustomModal from "./CustomModal";
import { useState } from "react";
import useAuthenticationStatus from "../hooks/AuthenticationStatusHook";
import { useNavigate } from "react-router-dom";
import PipeBombConnection from "../logic/PipeBombConnection";

interface Props {
    hostInfo: HostInfo,
    status: "secure" | "insecure" | "offline" | "checking" | "unknown"
}

export default function Server({ hostInfo, status }: Props) {
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const authState = useAuthenticationStatus();
    const navigate = useNavigate();
    
    const innerHTML = (() => {
        switch (status) {
            case "offline":
                return <MdSignalWifiBad className={styles.icon} />
            case "secure":
                return <MdLockOutline className={styles.icon} />
            case "insecure":
                return <MdLockOpen className={styles.icon} />
            default:
                return <Loading loadingCss={{ $$loadingSize: "24px", $$loadingBorder: "3px"}}></Loading>;
        }
    })();

    function connect(createIfMissing?: boolean) {
        setModalOpen(false);
        if (!["secure", "insecure"].includes(status) || authState == "loading") return;
        setLoading(true);
        const host = `http${hostInfo.https ? "s" : ""}://${hostInfo.host}`;
        PipeBombConnection.getInstance().setHost(host, createIfMissing)
        .then(() => {
            localStorage.setItem("host", host);
        if (navigate) navigate("/");
        }).catch(e => {
            if (e?.statusCode == 401 && e?.response == "User does not exist") {
                setModalOpen(true);
            } else {
                console.error("failed to connect to", host, e);
            }
        }).finally(() => {
            setLoading(false);
        });
    }

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
                <Button className={styles.connect} auto color="gradient" size="lg" onPress={() => connect()} disabled={!["secure", "insecure"].includes(status)}>{
                    loading ? (
                        <Loading color="white" />
                    ) : "Connect"
                }</Button>
                <Button auto light className={styles.smallButton} onPress={() => ServerIndex.getInstance().checkServer(hostInfo)}><MdRefresh className={styles.buttonIcon} /></Button>
                <Button auto light className={styles.smallButton} onPress={() => ServerIndex.getInstance().removeServer(hostInfo.host)}><MdOutlineDelete className={styles.buttonIcon} /></Button>
            </div>
            <CustomModal title="This is a new server" visible={modalOpen} onClose={() => setModalOpen(false)}>
                <p>Your account has not connected to this server before. Are you sure you want to register with <span className={styles.underline}>{hostInfo.name}</span>?</p>
                <Grid.Container justify="space-evenly">
                    <Grid>
                        <Button color="default" onPress={() => setModalOpen(false)}>Go Back</Button> 
                    </Grid>
                    <Grid>
                        <Button color="success" onPress={() => connect(true)}>Register</Button>
                    </Grid>
                </Grid.Container>
            </CustomModal>
        </div>
    )
}