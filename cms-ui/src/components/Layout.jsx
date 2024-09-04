import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Layout.css";
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Outlet } from "react-router-dom";
import { CmsMenu } from "./CmsMenu";
import { Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fromStorage, removeStorage } from "@/lib";
import { setUser } from "@/store";
import { Loading } from "./Loading";
import http from "@/http";

export const Layout = () => {
    const user = useSelector(state => state.user.value);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!user) {
            const token = fromStorage("accessToken");

            if (token) {
                setLoading(true);

                http.get('/profile')
                    .then(({ data }) => {
                        dispatch(setUser(data));
                    })
                    .catch(err => removeStorage("accessToken"))
                    .finally(() => {
                        setLoading(false);
                    });
            } else {
                setLoading(false);
            }
        } else {
            setLoading(false); 
        }
    }, [user, dispatch]);

    return (
        <>
            <CmsMenu />
            <Container>
                {loading ? (
                    <Loading />
                ) : (
                    <Row>
                        <Outlet />
                    </Row>
                )}
            </Container>
        </>
    );
};
