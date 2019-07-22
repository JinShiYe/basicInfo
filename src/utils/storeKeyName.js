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
    grd_cls:"support#Baseinfo:PerGrd:Index",//学段及年级
    grd_cls_add:"support#Baseinfo:PerGrd:Index:add",//学段及年级 添加
    grd_cls_edit:"support#Baseinfo:PerGrd:Index:edit",//学段及年级 编辑
    college_department:"support#Baseinfo:Coll:Index",//院系
    college_department_add:"support#Baseinfo:Coll:Index:add",//院系  添加
    college_department_edit:"support#Baseinfo:Coll:Index:edit",//院系 编辑
    major:"support#Baseinfo:Major:Index",//专业
    major_add:"support#Baseinfo:Major:Index:add",//专业 添加
    major_edit:"support#Baseinfo:Major:Index:edit",//专业 编辑
    subject:"support#Baseinfo:Sub:Index",//科目
    subject_add:"support#Baseinfo:Sub:Index:add",//科目  添加
    subject_edit:"support#Baseinfo:Sub:Index:edit",//科目 编辑
    teaching_edition:"support#Baseinfo:Mater:Index",//教版
    teaching_edition_add:"support#Baseinfo:Mater:Index:add",//教版  添加
    teaching_edition_edit:"support#Baseinfo:Mater:Index:edit",//教版 编辑
    fascicle:"support#Baseinfo:Fasc:Index",//教材分册
    fascicle_add:"support#Baseinfo:Fasc:Index:add",//教材分册  添加
    fascicle_edit:"support#Baseinfo:Fasc:Index:edit",//教材分册 编辑
    semester:"support#Baseinfo:Term:Index",//季期
    semester_add:"support#Baseinfo:Term:Index:add",//季期 添加
    semester_edit:"support#Baseinfo:Term:Index:edit",//季期 编辑
    subject_type:"support#Baseinfo:Arts:Index",//分科
    subject_type_add:"support#Baseinfo:Arts:Index:add",//分科  添加
    subject_type_edit:"support#Baseinfo:Arts:Index:edit",//分科 编辑
    equipment_type:"support#Baseinfo:McType:Index",//设备类型
    equipment_type_add:"support#Baseinfo:McType:Index:add",//设备类型  添加
    equipment_type_edit:"support#Baseinfo:McType:Index:edit",//设备类型 编辑
};
switch (key) {
    case 0:
        break;
    case 1:
        storeKeyName.INTERFACEZENG="http://139.129.252.49:8080/sup/";//广西接口
        storeKeyName.INTERFACEGU = 'http://jsypay.jiaobaowang.net/nwifbaseapi/api/Data/'; //顾工接口
            break;
    default:
        break;
}

export default storeKeyName;
