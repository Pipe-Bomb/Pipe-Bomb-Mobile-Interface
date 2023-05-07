import User from "pipebomb.js/dist/User"
import styles from "../styles/PlaylistTop.module.scss"
import Image from "./Image"
import { Button, Dropdown, Text } from "@nextui-org/react"
import { Link } from "react-router-dom"
import { MdMoreHoriz, MdPlayArrow, MdShuffle } from "react-icons/md"
import IconButton2 from "./IconButton2"
import { IconContext } from "react-icons"
import useIsSelf from "../hooks/IsSelfHook"
import { ContextMenuInfo, openContextMenu } from "./ContextMenu"

export interface PlaylistTopProps {
    name: string
    trackCount?: number
    onPlay: () => void
    onShuffle: () => void
    contextMenu: ContextMenuInfo
    owner?: User
    image: string | JSX.Element
}

export default function PlaylistTop(props: PlaylistTopProps) {
    const self = useIsSelf(props.owner);

    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <div className={styles.image}>
                    {typeof props.image == "string" ? (
                        <div className={styles.imageBorder}>
                            <Image src={props.image} />
                        </div>
                    ) : props.image}
                </div>
                <div className={styles.info}>
                    <Text h1 className={styles.title}>{ props.name }</Text>
                    {!self && props.owner && (
                        <Text h4 className={styles.playlistAuthor}>by { props.owner.username }</Text>
                    )}
                    {props.trackCount !== undefined && (
                        <Text h5 className={styles.trackCount}>{props.trackCount} track{props.trackCount == 1 ? "" : "s"}</Text>
                    )}
                </div>
            </div>
            <div className={styles.buttons}>
                <IconButton2 size="xl" onClick={props.onPlay} color="gradient"><MdPlayArrow /></IconButton2>
                <IconButton2 size="lg" onClick={props.onShuffle} bordered><MdShuffle /></IconButton2>
                <IconButton2 size="lg" onClick={() => openContextMenu(props.contextMenu)} light><MdMoreHoriz /></IconButton2>
            </div>
        </div>
    )
}