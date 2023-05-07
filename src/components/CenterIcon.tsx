import { IconContext } from "react-icons"
import styles from "../styles/CenterIcon.module.scss"
import { Text } from "@nextui-org/react"

export interface CenterIconProps {
    icon: JSX.Element,
    text: string
}

export default function CenterIcon({ icon, text }: CenterIconProps) {
    return (
        <div className={styles.container}>
            <IconContext.Provider value={{size: "100px"}}>
                { icon }
            </IconContext.Provider>
            <Text h3>{ text }</Text>
        </div>
    )
}