import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MainRouter from './components/main-router';
import * as serviceWorker from './serviceWorker';
import './common_from_baseframe/less/override.less'
import storekeyname from "./utils/storeKeyName";
import store from "./utils/store";


if(storekeyname.build==='debug'){
    let responseData=
        {"access_token":"MmE4NTk0YWUtYzk0Yi00ZTlkLTlmM2MtMzI1OGQyMjRlMDI4","max_idle_time_in_seconds":3600,"user":{"user_name":"中小学平台管理员","sex":0,"pid":null,"unit_name":"南宁二中","login_name":"zxxadmin","platform_code":"PT0001","user_code":"1108922281310027776","img_url":"http://qn-educds.jiaobaowang.net/OfficeAutomation/temp/1568251156440_1537231894761c25b2b3cf3.jpg","platform_name":"中小学平台","unit_code":"100000","id":null,"type_code":"YHLX0001","app_code":"support#"}}
    let url=window.location.href;
    let arr=url.split("#");
    let system_url='http://localhost:3000/';
    if(arr&&arr.length>0){
        system_url=arr[0];
    }
    let personal={
        access_token: responseData.access_token,
        id: responseData.user.id,
        img_url: responseData.user.img_url,
        login_name: responseData.user.login_name,
        name: responseData.user.name,
        platform_code: responseData.user.platform_code,
        platform_name: responseData.user.platform_name,
        school_code: responseData.user.school_code,
        school_name: responseData.user.school_name,
        sex: responseData.user.sex,
        type_code: responseData.user.type_code,

        user_name: responseData.user.user_name,
        unit_name: responseData.user.unit_name,
        user_code: responseData.user.user_code,
        unit_code: responseData.user.unit_code,

        app_code: responseData.user.app_code,
        system_url: system_url,
        error_page_url: `${system_url}#/error/`,

        modifyFlag: 999,
    }
    console.log(personal,JSON.stringify(personal));
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



