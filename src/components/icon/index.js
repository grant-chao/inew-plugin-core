import React from "react";

const Icon = (props) => {
    const { type } = props;
    return <i className={`inewfont inew-${type}`} />
}

export default Icon;
