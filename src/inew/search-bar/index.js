import styles from './index.scss';
import Icon from "@/components/icon";
import { Input } from "@arco-design/web-react";
import {useRef, useState} from "react";
import SearchType from "./type";
import types from '@/config/search.engines';
import React from "react";

const SearchBar = (props) => {
    const { type = "baidu" } = props;

    const [searchType, setSearchType] = useState(type);
    const [keyword, setKeyword] = useState("");
    const [typeVisible, setTypeVisible] = useState(false);
    const [focus, setFocus] = useState(false);
    const input = useRef();

    const className = [styles.searchBar];
    if(typeVisible) className.push(styles.typeOpened);
    if(focus) className.push(styles.focus);

    return <div className={className.join(' ')}>
        <div className={styles.icon}>
            <Icon type={"search"} />
        </div>
        <div className={styles.input}>
            <Input
                onFocus={()=>setFocus(true)}
                onBlur={()=>setFocus(false)}
                value={keyword}
                onChange={setKeyword}
                onPressEnter={() => {
                    if(!keyword) return;
                    const type = types.find(({id})=>(id === searchType)) || types[0];
                    window.open(type.url + encodeURIComponent(keyword));
                    setKeyword("");
                    input.current.blur();
                }}
                ref={input}
            />
        </div>
        <div className={styles.type}>
            <SearchType onClick={()=>{
                input.current.focus();
            }} onVisibleChange={setTypeVisible} value={searchType} onChange={setSearchType} />
        </div>
    </div>
};

export default SearchBar;
