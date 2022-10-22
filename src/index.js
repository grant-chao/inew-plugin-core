import React from 'react';
import ReactDOM from 'react-dom';
import '@/assets/style/reset.css';
import INewPluginApp from "@/inew";

const App = () => {
    return <INewPluginApp />
}

ReactDOM.render(<App />, document.getElementById('root'));
