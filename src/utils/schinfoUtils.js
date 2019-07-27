import storekeyname from "./storeKeyName";
import myUtils from "./myUtils";
import store from "./store";
import {message} from "antd";
//统一信息 schinfo 获取列表数据通用请求
let getTableData=(interfaceName,that,pagesize,page)=>{
    let personal=store.get(storekeyname.PERSONALINFO);
    let utoken =store.get(storekeyname.TOKEN);
    let params = {
        platform_code:personal.platform_code,
        app_code:personal.app_code,
        pagesize:pagesize,
        pageindex:page,
        access_token: utoken,
    };
    myUtils.post(1, interfaceName, params, res => {
        console.log("res:"+JSON.stringify(res))
        if(res.code==0){
            let datas=[];
            res.data.list.map((item,index)=>{
                item.xh=index+1;
                datas.push(item)
            });
            that.setState({
                data:datas,
                loading:false,
                total: res.data.pagerowc,
            });
        }else{
            that.setState({
                data:[],
                loading:false,
                total: 0,
            });
            message.error(res.msg)
        }
    });
}

//统一信息 schinfo  添加 编辑通用请求
let add_editData=(interfaceName,requestData,callback)=>{
    let personal=store.get(storekeyname.PERSONALINFO);
    let utoken =store.get(storekeyname.TOKEN);
    requestData.platform_code=personal.platform_code;
    requestData.app_code=personal.app_code;
    requestData.access_token=utoken;
    myUtils.post(1, interfaceName, requestData, res => {
        console.log("res:"+JSON.stringify(res))
        if(res.code==0){
            message.success(res.msg)
            callback("success");
        }else{
            message.error(res.msg)
        }
    });
}
export {getTableData,add_editData}
