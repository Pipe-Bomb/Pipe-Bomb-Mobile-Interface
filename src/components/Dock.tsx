import styles from "../styles/Dock.module.scss";
import iconStyle from "../styles/Icon.module.scss";
import { AiOutlineHome, AiOutlineCompass } from "react-icons/ai";
import { VscLibrary } from "react-icons/vsc";
import { Grid } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import PipeBombConnection from "../logic/PipeBombConnection";
import ServerIndex from "../logic/ServerIndex";
import { connectToHost } from "../pages/Connect";

export default function Dock() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!PipeBombConnection.getInstance().getUrl()) {
            const host = localStorage.getItem("host");
            let connected = false;
            if (host) {
                const hostInfo = ServerIndex.getInstance().getServer(host);
                if (hostInfo) {
                    connectToHost(hostInfo, "secure");   
                    connected = true;
                }
            }
            if (!connected) {
                navigate("/connect");
            }
        }
    });

    return (
        <Grid.Container className={styles.container} justify="space-evenly" alignItems="center">
            <Grid className={iconStyle.icon}>
                <Link to="/">
                    <AiOutlineHome />
                </Link>
            </Grid>
            <Grid className={iconStyle.icon}>
                <Link to="/explore">
                    <AiOutlineCompass />
                </Link>
            </Grid>
            <Grid className={iconStyle.icon}>
                <Link to="/library">
                    <VscLibrary />
                </Link>
            </Grid>
        </Grid.Container>
    )
}