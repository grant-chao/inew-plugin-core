import React from 'react';
import ReactDOM from 'react-dom';
import '@/assets/style/reset.css';
import "@arco-design/web-react/dist/css/arco.min.css";
import "react-resizable/css/styles.css";
import INewPluginApp from "@/inew";
import apps from "@/config/apps";

const App = () => {
    return <INewPluginApp
        apps={apps}
    />
}

ReactDOM.render(<App />, document.getElementById('root'));
