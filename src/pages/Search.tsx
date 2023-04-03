import { Button, Input } from "@nextui-org/react";
import styles from "../styles/Search.module.scss";
import { IconContext } from "react-icons";
import { IoSearch } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import Loader from "../components/Loader";
import Track from "pipebomb.js/dist/music/Track";
import PipeBombConnection from "../logic/PipeBombConnection";
import ListTrack from "../components/ListTrack";
import ServiceInfo from "pipebomb.js/dist/ServiceInfo";

let value = "";
let lastSearch = "";
let storedTrackList: Track[] = [];
let storedPlatform = "Youtube Music";

export default function Search() {
    const [loading, setLoading] = useState(false);
    const input = useRef<HTMLInputElement>(null);
    const [trackList, setTrackList] = useState(storedTrackList);
    const [currentPlatform, setCurrentPlatform] = useState(storedPlatform);
    const [services, setServices] = useState<ServiceInfo[] | null>(null);

    function keyPress(event: React.KeyboardEvent) {
        if (event.key !== "Enter") return;
        search();
    }

    useEffect(() => {
        if (services === null) {
            PipeBombConnection.getInstance().getApi().v1.getServices()
            .then(setServices)
            .catch(e => {
                console.error(e);
            });
        }
    }, []);

    function search() {
        const target = input.current?.value;

        if (!target) return;

        lastSearch = target;
        const usingPlatform = storedPlatform;
        setLoading(true);
        if (input.current) input.current.blur();
        PipeBombConnection.getInstance().getApi().v1.search(storedPlatform, target)
        .then((tracks) => {
            if (usingPlatform != storedPlatform || lastSearch != target) return;

            storedTrackList = tracks;
            setTrackList(tracks);
            setLoading(false);
        }).catch((error) => {
            console.error(error);
            if (usingPlatform != storedPlatform || lastSearch != target) return;
            setTrackList([]);
            setLoading(false);
        });
    }

    function generateList() {
        if (loading) {
            return (
                <div className={styles.loaderContainer}>
                    <Loader text="Searching..."></Loader>
                </div>
            );
        } else {
            return (
                <div className={styles.list}>
                    {trackList.map((track, index) => (
                        <ListTrack key={index} track={track} />
                    ))}
                </div>
            )
        }
    }

    function setPlatform(platform: string) {
        if (storedPlatform == platform) return;
        storedPlatform = platform;
        setCurrentPlatform(storedPlatform);
        search();
    }

    function generateServices() {
        if (services === null) {
            return <Loader text="Loading Services..."></Loader>;
        } else {
            return <>
                <div className={styles.buttonGroup}>
                    { services.map(service => (
                        <Button className={styles.serviceButton} key={service.name} disabled={currentPlatform == service.name} onPress={() => setPlatform(service.name)} light={currentPlatform != service.name} auto>
                            <img className={styles.icon} src={`/music-services/${service.prefix}.png`} />
                        </Button>
                    )) }
                </div>
                { generateList() }
            </>;
        }
    }

    return (
        <>
            <div className={styles.search}>
                <Input
                    ref={input}
                    size="xl"
                    placeholder="Search"
                    clearable
                    bordered
                    fullWidth
                    onKeyDown={keyPress}
                    onChange={e => value = e.target.value}
                    className={styles.bar}
                    initialValue={value}
                    autoFocus
                />
                <Button
                    size="lg"
                    bordered onPress={search}
                    className={styles.searchButton}
                    auto
                >
                    <IconContext.Provider value={{size: "30px"}}>
                        <IoSearch />
                    </IconContext.Provider>
                </Button>
            </div>
            { generateServices() }
        </>
    )
}