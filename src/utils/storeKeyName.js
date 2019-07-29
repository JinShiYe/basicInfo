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
    PROVINCE_CITY_AREA:'province_city_area',//省市区json
    //权限
    //统一信息
    common_add:"Baseinfo:add",//添加
    common_edit:"Baseinfo:edit",//编辑
    //学校后台管理
    student_card_add:"sch#School:StudentCard:add",
    student_card_edit:"sch#School:StudentCard:edit",
    student_card_delete:"sch#School:StudentCard:delete",
    teacher_card_add:"sch#School:TeacherCard:add",
    teacher_card_edit:"sch#School:TeacherCard:edit",
    teacher_card_delete:"sch#School:TeacherCard:delete",
};
switch (key) {
    case 0:
        break;
    case 1:
        storeKeyName.INTERFACEZENG="http://139.129.252.49:8080/sup2/";//广西接口
        storeKeyName.INTERFACEMENG="http://139.129.252.49:8080/sys/";//广西接口
        storeKeyName.INTERFACEGU = 'http://jsypay.jiaobaowang.net/nwifbaseapi/api/Data/'; //顾工接口
            break;
    default:
        break;
}

export default storeKeyName;
