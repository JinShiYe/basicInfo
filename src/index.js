import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MainRouter from './components/main-router';
import * as serviceWorker from './serviceWorker';
import './common_from_baseframe/less/override.less'
import storekeyname from "./utils/storeKeyName";
import store from "./utils/store";


if(storekeyname.testType===0){
    let personal =
        {"access_token":"YTk3OTk3MWMtMDFjZS00YzU2LWJkNTUtYWVjMThlNWJiYTlh","id":null,"img_url":"http://qn-educds.jiaobaowang.net/xiaoxuntong/headimageundefined.png","login_name":"zxxadmin","platform_code":"PT0001","platform_name":"中小学平台","sex":0,"type_code":"YHLX0001","app_code":"support#","unit_code":"-1","system_url":"http://localhost:3000","error_page_url":"http://localhost:3000/#/error/","modifyFlag":999}
    ;
    let utoken=personal.access_token;
    store.set(storekeyname.TOKEN, utoken);
    store.set(storekeyname.PERSONALINFO, personal);

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
            console.log("personal:"+JSON.stringify(personal))
            let utoken=personal.access_token;
            store.set(storekeyname.TOKEN, utoken);
            store.set(storekeyname.PERSONALINFO, personal);
            // 设置默认面包屑文本列表
            let breadcrumbs= message.data.breadcrumbs
            console.log(breadcrumbs);
            store.set(storekeyname.BREADCRUMBS, breadcrumbs);
            ReactDOM.render(<MainRouter />, document.getElementById('root'));
            serviceWorker.unregister();
        }
    })
}


