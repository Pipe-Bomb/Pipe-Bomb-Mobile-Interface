import { Input } from "@nextui-org/react";
import { useRef } from "react";
import styles from "../styles/Explore.module.scss";
import { useNavigate } from "react-router-dom";

let value = "";

export default function Explore() {
    const navigator = useNavigate();
    
    function search() {
        navigator("/search");
    }

    return (
        <>
            <div className={styles.search}>
                <Input
                    size="xl"
                    placeholder="Search"
                    clearable
                    bordered
                    fullWidth
                    className={styles.bar}
                    initialValue={value}
                    onFocus={search}
                />
        </div>
        </>
    )
}