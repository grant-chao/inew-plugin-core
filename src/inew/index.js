import styles from "./index.scss";
import Wallpaper from "inew-plugin-core/wallpaper";
import Main from "inew-plugin-core/main";
import { useRef } from "react";
import React from "react";

const INewPluginApp = (props) => {
    const {
        apps = [],
        searchEngines = []
    } = props;
    const mainRef = useRef();

    return <div className={styles.container}>
        <Wallpaper />
        <Main
            apps={apps}
            searchEngines={searchEngines}
            ref={mainRef}
        />
    </div>
};

export default INewPluginApp;
