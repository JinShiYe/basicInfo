import React from "react";

const key =1;
//公共参数
const storeKeyName={
    build:"release",//是否console.log  单独测试( debug )：true  发布联调( joint )：true  正式发布( release )：false
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
    student_card_add:"School:StudentCard:add",
    student_card_edit:"School:StudentCard:edit",
    student_card_delete:"School:StudentCard:delete",
    teacher_card_add:"School:TeacherCard:add",
    teacher_card_edit:"School:TeacherCard:edit",
    teacher_card_delete:"School:TeacherCard:delete",
    //中小学支撑

    //七牛
    QINIUAPPID:4,//七牛APPID 由管理员分配
    QNPUBSPACE : "pb", //七牛公开空间
    QNPRISPACE : "pv", //七牛私有空间
    XXTNOTICE : 'notice/', //笔校讯通、通知
    QNPUBXXT : "jsy@180526",//校讯通
    FIRSTZ:'?vframe/jpg/offset/1',//视频第一帧图片
};
switch (key) {
    case 0:
        break;
    case 1:
        storeKeyName.INTERFACEZENG="http://139.129.252.49:8080/sup2/";//广西接口
        storeKeyName.INTERFACEMENG="http://139.129.252.49:8080/sys/";//广西接口
        storeKeyName.INTERFACEGU = 'http://jsypay.jiaobaowang.net/nwifbaseapi/api/Data/'; //顾工接口
        storeKeyName.QNGETUPLOADTOKEN ="https://jbyc.jiaobaowang.net:8504/Api/QiNiu/GetUpLoadToKen";//七牛token获取接口
            break;
    default:
        break;
}
storeKeyName.testType=storeKeyName.build==="debug"?0:1//测试类型 0 单独测试  1联调

export default storeKeyName;
