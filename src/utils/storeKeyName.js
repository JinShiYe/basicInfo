const key =1;
//公共参数
const storeKeyName={
    debug:true,//是否显示toast
    timeout:15*1000,//post 连接超时时间
    sha1key : "jsy309",//sha1 加密的秘钥
    APPID:"HBuilder",
    PERSONALINFO :'personInfo_notice', //个人信息，登录成功后返回值
    TOKEN:'token',//从框架URL 得到的token
    PERMISSIONSWHYNOTALLOW:'permissionsWHY',//通知权限 存储的变量名 得到的是个msp string 需转换为json
    LOCATIONNOTICEITEM:'locationnoticeitem',//通知item 储存的信息
    USERTYPE:0,//用户类型，0老师,1家长,2学生
    SCHNOTICE_ADD:'schInfoApp#schInfo:schNotice:index:add',//学校通知新建通知权限
    SCHNOTICE_AllGRD:'schInfoApp#schInfo:schNotice:index:allGrd',//学校通知全部年级权限
    SCHNOTICE_ALLCLASS:'schInfoApp#schInfo:schNotice:index:allCls',//学校通知年级下所有班级权限
    SCHNOTICE_SINGLEPARENT:'schInfoApp#schInfo:schNotice:index:singleParent',//学校通知单个家长权限
    //七牛
    QINIUAPPID:4,//七牛APPID 由管理员分配
    QNPUBSPACE : "pb", //七牛公开空间
    QNPRISPACE : "pv", //七牛私有空间
    XXTNOTICE : 'notice/', //笔校讯通、通知
    QNPUBXXT : "jsy@180526",//校讯通
};
switch (key) {
    case 0:
        break;
    case 1:
        storeKeyName.INTERFACEZENG="http://139.129.252.49:8080/sup/";//广西接口
        storeKeyName.INTERFACEMENG = 'http://139.129.252.49:8080/sys/';//广西接口
        storeKeyName.INTERFACEKONG = 'https://jbyj.jiaobaowang.net/SchoolCommunicationServiceNew/schoolNotice/';//孔工接口
        storeKeyName.INTERFACEGU = 'https://jsypay.jiaobaowang.net/useradminwebapi/api/data/'; //顾工接口
        storeKeyName.QNGETUPLOADTOKEN ="https://jbyc.jiaobaowang.net:8504/Api/QiNiu/GetUpLoadToKen";//七牛token获取接口
            break;
    default:
        break;
}

export default storeKeyName;
