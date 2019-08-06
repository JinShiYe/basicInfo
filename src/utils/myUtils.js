import axios from "axios";
import storekeyname from "./storeKeyName";
import {HmacSHA1, enc} from 'crypto-js';
import uuid from 'node-uuid';
import RSAKey from './encrypt/rsa'
import desEncrypt from "./encrypt/des";
import store from "./store";
import {message} from "antd";
const myUtils = {
    // 获取url params参数
    getUrlSearch: () => {
        var urlcan = decodeURIComponent(window.location);
        urlcan = urlcan.split("?")[1];//数组
        if (urlcan) {
            urlcan = urlcan.replace(/\s/g, "");
            var arr = urlcan.split("&");//数组
            var obj = {};
            for (var i = 0; i < arr.length; i++) {
                var arritem = arr[i].split("=");
                if (arritem[1]) {
                    obj[arritem[0]] = arritem[1];
                } else {
                    obj[arritem[0]] = "";
                }
            }
        }
        return obj;
    },
    // POST 请求公共方法
    post: (flag, requestUrl, params, callback) => {
        axios.defaults.timeout = storekeyname.timeout;
        axios.defaults.headers = {'Content-type': 'application/json'}
        let url = "";
        if (flag == 0) {
            url = storekeyname.INTERFACEZENG + requestUrl;
        }else if (flag == 1) {
            url = storekeyname.INTERFACEGU + requestUrl;
        }else if (flag == 2) {
            url = storekeyname.INTERFACEMENG + requestUrl;
        }else {
            url = requestUrl;
        }
        let noNullObj={};
        Object.keys(params).forEach(function(key){
            if(!(params[key]==="" || params[key]===null)){
                noNullObj[key]=params[key];
            }
        });
        let signTemp = myUtils.sortParams(noNullObj);
        console.log("noNullObj sign: %c \n" + JSON.stringify(noNullObj),"color:#ff0000")
        let signT = HmacSHA1(signTemp, storekeyname.sha1key).toString(enc.Base64);
        params.sign = signT;
        let data=params;
        console.log("requestUrl: %c \n" + url,"color:#fff")
        console.log("requestParams: %c \n" + JSON.stringify(params),"color:#ff0000")
        axios({
            url: url,
            method: 'post',
            data: data,
        }).then(function (res) {
            // if (res.data.code === 'sup_0006') {
            //     window.location.href = "http://192.168.1.114:3000/#/error/0006"
            // }else{
                callback(res.data);
            // }
        }).catch(function (error) {
            console.log(error)
            let res ={
                code:-1,
                msg:"网络错误，请稍后重试"
            }
            callback(res);
        })
    },
    //数组排序
    sortParams: (params) => {
        let arr1 = [];
        for (let item in params) {
            if (params[item] instanceof Array) {
                arr1.push(item + '=' + JSON.stringify(params[item]) + '');
            } else {
                arr1.push(item + '=' + params[item]);
            }
        }
        let signTemp = arr1.sort().join('&');
        return signTemp;
    },
    //获取uuid
    uid: () => {
        return uuid.v1();
    },
    //JSON 转 Map
    Json2Map: (objStr) => {
        let obj=JSON.parse(objStr)
        let strMap = new Map();
        for (let k of Object.keys(obj)) {
            strMap.set(k, obj[k]);
        }
        return strMap;
    },
    //Map 转 JSON
    Map2Json: (strMap) => {
        let obj = Object.create(null);
        for (let [k, v] of strMap) {
            obj[k] = v;
        }
        return JSON.stringify(obj);
    },
    //    JS 浅拷贝
    shallowCopy: (obj)=> {
        if (typeof obj !== 'object') return;
        var newObj = obj instanceof Array ? [] : {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                newObj[key] = obj[key];
            }
        }
        return newObj;
    },
    //    JS 深拷贝
    deepCopy:(obj)=> {
        if (typeof obj !== 'object') return;
        if (obj == null) return;
        var newObj = obj instanceof Array ? [] : {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                newObj[key] = typeof obj[key] === 'object' ? myUtils.deepCopy(obj[key]) : obj[key];
            }
        }
        return newObj;
    },
    //一个数组是否包含另一个数组
    includes:(arr1, arr2)=> {
        return arr2.every(val => arr1.includes(val));
    },
    contains:(arr, obj)=> {
        let i = arr.length;
        while (i--) {
            if (arr[i] === obj) {
                return true;
            }
        }
        return false;
    },
    //encrypt 加密
    encrypt_rsa:(Exponent,Modulus,data)=>{
        let ConsultPublicKey = {n:Modulus,e:Exponent};
        let rsaPublicKey = new RSAKey();
        rsaPublicKey.setPublicString(JSON.stringify(ConsultPublicKey));
        let newdata = rsaPublicKey.encrypt(data);
        return newdata;
    },
    //数组去重
    unique:(arr)=>{
        var result = [],
            hash = {};
        for(var i = 0, elem;
            (elem = arr[i]) != null; i++) {
            if(!hash[elem]) {
                result.push(elem);
                hash[elem] = true;
            }
        }
        return result;
    },
    //des加密
    encrypt_des:(desKey,params)=>{
        let value=desEncrypt(desKey, JSON.stringify(params))
        return value;
    },

};

['log', 'info', 'warn', 'error'].forEach(function(method) {
    if(storekeyname.build==="debug" || storekeyname.build==="joint"){
        console[method] = console[method].bind(
            console
        );
    }else{
        console[method] = ()=>{}
    }
});
export default myUtils;
