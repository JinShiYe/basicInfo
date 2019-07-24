import React from "react";

const key =1;
//公共参数
const storeKeyName={
    debug:true,//是否显示toast
    timeout:15*1000,//post 连接超时时间
    sha1key : "jsy309",//sha1 加密的秘钥
    PERSONALINFO :'personInfo_notice', //个人信息，登录成功后返回值
    TOKEN:'token',//从框架URL 得到的token
    PERMISSIONSWHYNOTALLOW:'permissionsWHY',//权限 存储的变量名 得到的是个msp string 需转换为json

    //权限
    common_add:"Baseinfo:add",//添加
    common_edit:"Baseinfo:edit",//编辑
};
switch (key) {
    case 0:
        break;
    case 1:
        storeKeyName.INTERFACEZENG="http://139.129.252.49:8080/sup2/";//广西接口
        storeKeyName.INTERFACEGU = 'http://jsypay.jiaobaowang.net/nwifbaseapi/api/Data/'; //顾工接口
            break;
    default:
        break;
}

export default storeKeyName;
