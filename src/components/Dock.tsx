import styles from "../styles/Dock.module.scss";
import iconStyle from "../styles/Icon.module.scss";
import { Grid } from "@nextui-org/react";
import { Link, useLocation } from "react-router-dom";
import { MdExplore, MdHome, MdLibraryMusic, MdOutlineExplore, MdOutlineHome, MdOutlineLibraryMusic } from "react-icons/md";

export default function Dock() {
    const { pathname } = useLocation();

    return (
        <>
            <Grid.Container className={styles.container} justify="space-evenly" alignItems="center">
                <Grid className={iconStyle.icon}>
                    <Link to="/" className={styles.button}>
                        { pathname == "/" ? (
                            <MdHome />
                        ) : (
                            <MdOutlineHome />
                        )}
                    </Link>
                </Grid>
                <Grid className={iconStyle.icon}>
                    <Link to="/explore" className={styles.button}>
                        { ["/explore", "/search"].includes(pathname) ? (
                            <MdExplore />
                        ) : (
                            <MdOutlineExplore />
                        )}
                    </Link>
                </Grid>
                <Grid className={iconStyle.icon}>
                    <Link to="/library" className={styles.button}>
                        { pathname == "/library" ? (
                            <MdLibraryMusic />
                        ) : (
                            <MdOutlineLibraryMusic />
                        )}
                    </Link>
                </Grid>
            </Grid.Container>
        </>
    )
}