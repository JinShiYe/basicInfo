import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MainRouter from './components/main-router';
import * as serviceWorker from './serviceWorker';
import './common_from_baseframe/less/override.less'
import storekeyname from "./utils/storeKeyName";
import store from "./utils/store";


if(storekeyname.build==='debug'){
    let breadcrumbs= "debug模式"
    console.log(breadcrumbs);
    store.set(storekeyname.BREADCRUMBS, breadcrumbs);
    ReactDOM.render(<MainRouter />, document.getElementById('root'));
    serviceWorker.unregister();
}else{
    window.addEventListener('message', (message) => {
        let data=message.data;
        if(data!=""&&data!=undefined&&data!=null){
            let personal=JSON.parse(data.cache);
            let utoken=personal.access_token;
            store.set(storekeyname.TOKEN, utoken);
            store.set(storekeyname.PERSONALINFO, personal);
            // 设置默认面包屑文本列表
            let breadcrumbs= message.data.breadcrumbs
            console.log(breadcrumbs);
            console.log("personal:"+JSON.stringify(personal))
            store.set(storekeyname.BREADCRUMBS, breadcrumbs);
            ReactDOM.render(<MainRouter />, document.getElementById('root'));
            serviceWorker.unregister();
        }
    })
}



