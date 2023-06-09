import ServerIndex from "../logic/ServerIndex.js";
import { useEffect, useState, useRef } from "react";
import Server from "../components/Server";
import styles from "../styles/Connect.module.scss";
import { Button, Grid, Input } from "@nextui-org/react";

export default function Connect() {
    const serverIndex = ServerIndex.getInstance();
    const [servers, setServers] = useState(serverIndex.getServers());
    const input = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState("");

    useEffect(() => {
        serverIndex.registerUpdateCallback(setServers);
        return () => {
            serverIndex.unregisterUpdateCallback(setServers);
        }
    }, []);

    function addServer() {
        if (!value) return;

        ServerIndex.getInstance().addServer(value);
        if (input.current) input.current.blur();
        setValue("");
    }

    function keyPress(event: React.KeyboardEvent) {
        if (event.key !== "Enter") return;
        addServer();
    }

    return (
        <>
            <h2 className={styles.title}>Connect to Server</h2>
            <Grid.Container className={styles.addContainer} alignItems="center" gap={3}>
                <Grid style={{flexGrow: 1}}>
                    <Input ref={input} clearable underlined labelPlaceholder="Server URL" size="xl" fullWidth onKeyDown={keyPress} onChange={e => setValue(e.target.value)} initialValue={value} />
                </Grid>
                <Grid>
                    <Button auto size="lg" bordered onPress={addServer}>Add</Button>
                </Grid>
            </Grid.Container>
            {servers.map(server => (
                <Server key={server.host} hostInfo={server} status={serverIndex.getServerStatus(server)}></Server>
            ))}
        </>
    )
}