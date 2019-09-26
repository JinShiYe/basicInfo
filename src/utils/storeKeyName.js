import React from "react";

//公共参数
const storeKeyName={
    build:"release",//是否console.log  单独测试( debug )：true  发布联调( joint )：true  正式发布( release )：false            ******************
    INTERFACEZENG:"http://develop.jiaobaowang.net/sup/",//顾工新发接口 单点登录系统接口
    INTERFACEMENG:"http://139.129.252.49:8080/sys_new/",//广西接口 人事系统
    INTERFACEGU : 'http://develop.jiaobaowang.net/baseapi/api/Data/', //顾工 统一信息、中小学校园卡接口
    QNGETUPLOADTOKEN :"https://jbyc.jiaobaowang.net:8504/Api/QiNiu/GetUpLoadToKen",//七牛token获取接口


    timeout:15*1000,//post 连接超时时间
    sha1key : "jsy309",//sha1 加密的秘钥
    PERSONALINFO :'personInfo_notice', //个人信息，登录成功后返回值
    TOKEN:'token',//从框架URL 得到的token
    PERMISSIONSWHYNOTALLOW:'permissionsWHY',//权限 存储的变量名 得到的是个msp string 需转换为json
    PROVINCE_CITY_AREA:'province_city_area',//省市区json
    BREADCRUMBS:'breadcrumbs',//面包屑

    //权限
    //统一信息
    common_add:"Baseinfo:add",//添加
    common_edit:"Baseinfo:edit",//编辑
    //学校后台管理
    student_card_add:"SchoolCard:Student:Operation:add",
    student_card_edit:"SchoolCard:Student:Operation:edit",
    student_card_delete:"SchoolCard:Student:Operation:delete",
    teacher_card_add:"SchoolCard:Teacher:Operation:add",
    teacher_card_edit:"SchoolCard:Teacher:Operation:edit",
    teacher_card_delete:"SchoolCard:Teacher:Operation:delete",
    //中小学支撑
    schoolInfo_baseInfo_add:'School:Operation:add',//
    schoolInfo_baseInfo_edit:'School:Operation:edit',//
    schoolInfo_baseInfo_delete:'School:Operation:delete',//

    //七牛
    QINIUAPPID:4,//七牛APPID 由管理员分配
    QNPUBSPACE : "pb", //七牛公开空间
    QNPRISPACE : "pv", //七牛私有空间
    XXTNOTICE : 'notice/', //笔校讯通、通知
    QNPUBXXT : "jsy@180526",//校讯通
    FIRSTZ:'?vframe/jpg/offset/1',//视频第一帧图片
};

export default storeKeyName;
