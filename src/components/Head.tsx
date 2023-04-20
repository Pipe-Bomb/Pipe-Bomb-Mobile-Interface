import styles from "../styles/Head.module.scss";
import logo from "../assets/logo no background.png";
import { useEffect, useState } from "react";
import Account, { UserDataFormat } from "../logic/Account"
import { Avatar, Grid, Loading } from "@nextui-org/react";
import { IoSearch } from "react-icons/io5";
import IconButton from "./IconButton";
import { Link, useNavigate } from "react-router-dom";

export default function Head() {
    const navigator = useNavigate();
    const [userData, setUserData] = useState<UserDataFormat | null>(null);

    useEffect(() => {
        Account.getInstance().getUserData().then(setUserData);
    }, []);

    function generateAvatar() {
        if (userData) {
            return <Avatar
                src={Account.getAvatarUrl(userData.userID)}
                size="lg"
            />
        }
        return (
            <Loading size="lg" />
        )
    }

    function search() {
        navigator("/search");
    }

    return (
        <Grid.Container className={styles.container} alignItems="center" justify="space-between">
            <Grid>
                <Link to="/">
                    <img className={styles.logo} src={logo} />
                </Link>
            </Grid>
            <Grid className={styles.right}>
                <IconButton small onPress={search}>
                    <IoSearch />
                </IconButton>
                <div className={styles.avatar}>
                    <Link to="/connect">
                        { generateAvatar() }
                    </Link>
                </div>
            </Grid>
            
        </Grid.Container>
    )
}