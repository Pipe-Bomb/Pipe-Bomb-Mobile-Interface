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
import ExternalCollection from "pipebomb.js/dist/collection/ExternalCollection";
import { useNavigate } from "react-router-dom";
import { Text } from "@nextui-org/react"
import SideScrollWrapper from "../components/SideScrollWrapper";
import CenterIcon from "../components/CenterIcon";
import { TbMoodEmpty } from "react-icons/tb";

interface storedResults {
    tracks: Track[],
    playlists: ExternalCollection[]
}

let value = "";
let lastSearch = "";
let storedTrackList: storedResults = {
    tracks: [],
    playlists: []
};
let storedPlatform = "Youtube Music";

export default function Search() {
    const [loading, setLoading] = useState(false);
    const input = useRef<HTMLInputElement>(null);
    const [trackList, setTrackList] = useState(storedTrackList.tracks);
    const [playlists, setPlaylists] = useState(storedTrackList.playlists)
    const [currentPlatform, setCurrentPlatform] = useState(storedPlatform);
    const [services, setServices] = useState<ServiceInfo[] | null>(null);
    const navigate = useNavigate();

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
        .then(response => {
            if (response.responseType == "found object") {
                if (response.objectType == "playlist") {
                    return navigate("/collection/playlist/" + response.id);
                }
                if (response.objectType == "track") {
                    return navigate("/track/" + response.id);
                }
            } else {
                storedTrackList.tracks.splice(0, storedTrackList.tracks.length);
                storedTrackList.playlists.splice(0, storedTrackList.playlists.length);

                for (let item of response.results) {
                    if (item instanceof Track) {
                        storedTrackList.tracks.push(item);
                    } else if (item instanceof ExternalCollection) {
                        storedTrackList.playlists.push(item);
                    }
                }
                setTrackList(storedTrackList.tracks);
                setPlaylists(storedTrackList.playlists);
                setLoading(false);
            }
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
                    <Loader text="Searching"></Loader>
                </div>
            );
        } else if (!trackList.length) {
            if (!value) return null;
            return (
                <CenterIcon icon={<TbMoodEmpty />} text="No Results" />
            )
        } else {
            const newTracklist = Array.from(trackList);
            const firstTracks = newTracklist.splice(0, 5);
            if (playlists.length) {
                return <>
                    <Text h2 className={styles.title}>Top Results</Text>
                    {firstTracks.map((item, index) => (
                        <ListTrack key={index} track={item} />
                    ))}
                    <SideScrollWrapper externalCollections={playlists} title="Playlists" />
                    {!!newTracklist.length && (
                        <Text h2 className={styles.title}>More Results</Text>
                    )}
                    {newTracklist.map((item, index) => (
                        <ListTrack key={index} track={item} />
                    ))}
                </>
            } else {
                return <>
                    <Text h2 className={styles.title}>Top Results</Text>
                    {firstTracks.map((item, index) => (
                        <ListTrack key={index} track={item} />
                    ))}
                    {!!newTracklist.length && (
                        <Text h2 className={styles.title}>More Results</Text>
                    )}
                    {newTracklist.map((item, index) => (
                        <ListTrack key={index} track={item} />
                    ))}
                </>
            }




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
            return <Loader text="Loading Services"></Loader>;
        } else {
            const serverUrl = PipeBombConnection.getInstance().getUrl();
            return <>
                <div className={styles.buttonGroup}>
                    { services.map(service => (
                        <Button className={styles.serviceButton} key={service.name} disabled={currentPlatform == service.name} onPress={() => setPlatform(service.name)} light={currentPlatform != service.name} auto>
                            <img className={styles.icon} src={`${serverUrl}/v1/serviceicon/${service.name}`} />
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