import React, {Component} from 'react';
import store from '../../../utils/store';
import storekeyname from '../../../utils/storeKeyName';
import myUtils from '../../../utils/myUtils';
import {Table, Button, Icon, Form, Input, Select, message,Row,Col} from 'antd';
import {withRouter} from 'react-router-dom';
import {getColumns} from "../../../utils/commom-colums";
import Container from "../../../common_from_baseframe/Container";
import Header from "../../../common_from_baseframe/Header";
import {ContentDark} from "../../../common_from_baseframe/Content";

class AdvancedSearchForm extends React.Component {
    handleSearch = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            this.props.changeSearchData(values);
        });
    };

    handleReset = () => {
        this.props.form.resetFields();
    };

    handleChangeProvince=(value)=> {
        console.log(`selected ${value}`);
        this.props.onSelectChange(value,"province")
        this.props.form.resetFields("city");
        this.props.form.resetFields("area");
    }
    handleChangeCity=(value)=> {
        console.log(`selected ${value}`);
        this.props.onSelectChange(value,"city")
        this.props.form.resetFields("area");
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { Option } = Select;
        let provinces=this.props.province;
        let provOptions=[];
        if(provinces!==undefined){
            provinces.map(item=>{
                let option=<Option key={item.code} value={item.code}>{item.name}</Option>;
                provOptions.push(option)
            })
        }
        let citys=this.props.city;
        let cityOptions=[];
        if(citys!==undefined){
            citys.map(item=>{
                let option=<Option key={item.code} value={item.code}>{item.name}</Option>;
                cityOptions.push(option)
            })
        }
        let areas=this.props.area;
        let areaOptions=[];
        if(provinces!==undefined){
            areas.map(item=>{
                let option=<Option key={item.code} value={item.code}>{item.name}</Option>;
                areaOptions.push(option)
            })
        }
        return (
            <div className='divSearch'>
                <Form onSubmit={this.handleSearch} layout="inline" >
                    <Form.Item label={"省"}>
                        {getFieldDecorator("province", {
                            initialValue:-1,
                        })(
                            <Select onChange={this.handleChangeProvince}>
                                {provOptions}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label={"市"}>
                        {getFieldDecorator("city", {
                            initialValue:-1,
                        })(
                            <Select onChange={this.handleChangeCity}>
                                {cityOptions}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label={"区/县"}>
                        {getFieldDecorator("area", {
                            initialValue:-1,
                        })(
                            <Select>
                                {areaOptions}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label={"关键字"}>
                        {getFieldDecorator("keywords", {

                        })(<Input placeholder="请输入“名称”关键字" />)}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>
                            查找
                        </Button>
                        <Button  onClick={this.handleReset} style={{ marginLeft: 8 }}>
                            重置
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

const WrappedAdvancedSearchForm = Form.create({ name: 'advanced_search' })(AdvancedSearchForm);

class BasicInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],//列表数据
            loading:true,//正在加载中
            add_edit:true,//显示编辑权限
            searchData:{
                province:0,//省
                city:0,//市
                area:0,//县/区
                keywords:"",//年级ID
            },//搜索框数据
            proList:[],//省市县区所有数据，传过来是平级的
            province:[],//省 列表
            city:[],//市 列表
            area:[],//县/区 列表
            pagesize:10,//每页显示条数
            pageindex:1,//默认当前页
            total:0,//数据总数
        }
    }
    //获取个人信息
    // getPersionalInfo=(callback)=>{
    //     let utoken =store.get(storekeyname.TOKEN);
    //     let paramsUserInfo = {
    //         access_token: utoken,
    //     };
    //     myUtils.post(0, "api/user/currentUserInfo", paramsUserInfo, res => {
    //         console.log(JSON.stringify(res))
    //         if (res.code == 0) {
    //             let personal = res.data;
    //             if(personal.app_code==""){
    //                 personal.app_code="aaabbbccc"
    //             }
    //             store.set(storekeyname.PERSONALINFO, personal);
    //             callback();
    //         }else{
    //             message.error(res.msg)
    //         }
    //     });
    // }
    //获取省市区数据
    getArea=()=>{
        let list= store.get(storekeyname.PROVINCE_CITY_AREA);
        if(list){
            console.log("已经有数据了");
            this.setDefaultProvinceData(list)
        }else{
            console.log("请求吧");
            let personal=store.get(storekeyname.PERSONALINFO);
            let utoken =store.get(storekeyname.TOKEN);
            let paramsUserInfo = {
                platform_code:personal.platform_code,
                app_code:personal.app_code,
                type: 5,
                areano:"",
                access_token: utoken,
            };
            myUtils.post(1, "SysArea", paramsUserInfo, res => {
                if (res.code == 0) {
                    let list =res.data.list;
                    store.set(storekeyname.PROVINCE_CITY_AREA,list);
                    this.setDefaultProvinceData(list)
                }else{
                    message.error(res.msg)
                }
            });
        }
    }
    //设置默认的省市县数据
    setDefaultProvinceData=(list)=>{
        let provList=[{code:-1,name:"全部省"}]
        list.map(item=>{
            let code =item.code;
            if(code.indexOf("0000")!=-1){
                provList.push(item);
            }
        })
        let cityList=[{code:-1,name:"全部城市"}];
        let areaList=[{code:-1,name:"全部县/区"}];
        this.setState({
            proList:list,
            province:provList,
            city:cityList,
            area:areaList,
        })
    }
    //获取列表数据
    getTableData=(searchData,page)=>{
        if(searchData==undefined){
            searchData=this.state.searchData;
        }
        if(page===undefined){
            page=this.state.pageindex;
        }

        let resData={"totalRow":12,"pageNumber":1,"lastPage":true,"firstPage":true,"totalPage":1,"pageSize":20,"list":[{"tempcolumn":0,"edit":true,"open_month":1,"name":"南宁二中","sort":0,"id":100000,"area_id":450100,"type":1,"delete":true,"temprownumber":1,"status":1},{"tempcolumn":0,"edit":true,"open_month":9,"name":"天桥一中","sort":0,"id":100008,"area_id":370105,"type":1,"delete":true,"temprownumber":2,"status":1},{"tempcolumn":0,"edit":true,"open_month":null,"name":"中小学服务学校","sort":0,"id":100010,"area_id":0,"type":0,"delete":true,"temprownumber":3,"status":1},{"tempcolumn":0,"edit":true,"open_month":null,"name":"济南第十三中学","sort":0,"id":100011,"area_id":0,"type":0,"delete":true,"temprownumber":4,"status":1},{"tempcolumn":0,"edit":true,"open_month":null,"name":"实验中学","sort":0,"id":100012,"area_id":0,"type":0,"delete":true,"temprownumber":5,"status":1},{"tempcolumn":0,"edit":true,"open_month":null,"name":"试验","sort":0,"id":100013,"area_id":0,"type":0,"delete":true,"temprownumber":6,"status":1},{"tempcolumn":0,"edit":true,"open_month":null,"name":"测试学校123","sort":0,"id":100016,"area_id":0,"type":0,"delete":true,"temprownumber":7,"status":1},{"tempcolumn":0,"edit":true,"open_month":null,"name":"PT0001","sort":0,"id":100029,"area_id":0,"type":0,"delete":true,"temprownumber":8,"status":0},{"tempcolumn":0,"edit":true,"open_month":null,"name":"南宁三中（新建测试）","sort":0,"id":100030,"area_id":0,"type":0,"delete":true,"temprownumber":9,"status":1},{"tempcolumn":0,"edit":true,"open_month":null,"name":"四中","sort":0,"id":100032,"area_id":0,"type":0,"delete":true,"temprownumber":10,"status":1},{"tempcolumn":0,"edit":true,"open_month":null,"name":"新学校测试","sort":0,"id":100033,"area_id":0,"type":0,"delete":true,"temprownumber":11,"status":1},{"tempcolumn":0,"edit":true,"open_month":null,"name":"八中","sort":0,"id":100034,"area_id":0,"type":0,"delete":true,"temprownumber":12,"status":1}]}
        let datas=resData.list;
        let data=[];
        datas.map((item,index)=>{
            item.xh=index+1;
            data.push(item)
        });
        this.setState({
            loading:false,
            data,
            total:resData.totalRow
        })
    }

    //获取权限
    getPermission=(callback)=>{
        //1.9: 查询权限符（前端调用，判断按钮是否显示）
        let utoken =store.get(storekeyname.TOKEN);
        let personal=store.get(storekeyname.PERSONALINFO);
        let permissions = [
            storekeyname.teacher_card_add,
        ]
        let access = [];
        permissions.map(item => {
            access.push(item)
        });
        let paramsPermissions = {
            platform_code: personal.platform_code, //平台代码
            app_code: personal.app_code, //应用系统代码
            grd_id: 0, //年级id，全部年级则传-1,不需要判断年级则传0
            cls_id: 0, //班级id，年级下全部班级则传-1，不需要判断班级则传0
            stu_id: 0, //学生id，全部学生则传-1，不需要判断学生则传0
            sub_code: 0, //科目代码，全部科目则传“-1”，不需要判断年级则传“0”
            access: access.join(","), //权限符，需要判断权限的权限符，多个则用逗号拼接
            access_token: utoken //用户令牌
        };
        myUtils.post(0, "api/acl/permissionByPosition", paramsPermissions, res => {
            console.log(JSON.stringify(res))
            if (res.code == 0) {
                let rspList = res.data.split(",");
                let permissionsObj = new Map();
                rspList.map((item, index) => {
                    if (item == 1) {
                        permissionsObj.set(permissions[index], true);
                    } else {
                        permissionsObj.set(permissions[index], false);
                    }
                });
                this.setState({
                    add_edit:permissionsObj.get(storekeyname.teacher_card_add),
                })
                callback();
            } else {
                message.error(res.msg)
            }
        });
    }

    //选择模块选项改变事件，用于省市区选择器三级联动
    onSelectChange=(id,type)=>{
        let proList=this.state.proList;
        if(type==="province"){//根据省代码获取市列表
            let cityList=[{code:-1,name:"全部城市"}]
            let selectId=id.substr(0,2)
            proList.map(item=>{
                let code=item.code;
                if(code.substr(0,2).indexOf(selectId)!=-1&&code.substr(2,2).indexOf("00")==-1&&code.substr(4,6).indexOf("00")!=-1){
                    if(item.name.indexOf("北京")!=-1||item.name.indexOf("天津")!=-1||item.name.indexOf("上海")!=-1||item.name.indexOf("重庆")!=-1){
                        item.name="市辖区";
                    }
                    cityList.push(item)
                }
            })
            let areaList=[{code:-1,name:"全部县/区"}]
            this.setState({
                city:cityList,
                area:areaList
            })
        }else if(type==="city"){//根据市代码获取区县列表
            let areaList=[{code:-1,name:"全部县/区"}]
            let selectId=id.substr(0,4)
            proList.map(item=>{
                let code=item.code;
                if(code.substr(0,4).indexOf(selectId)!=-1&&code.substr(4,6).indexOf("00")==-1){
                    areaList.push(item)
                }
            })
            this.setState({
                area:areaList
            })
        }
    }

    //查找模块点击事件
    changeSearchData=data=>{
        console.log(data)
        let searchData={}
        searchData.province=data.province//省
        searchData.city=data.city//市
        searchData.area=data.area//县/区
        searchData.keywords=data.keywords//关键字
        console.log(JSON.stringify(searchData))
        this.getTableData(searchData,1);
    }
    //行数据排序输入改变事件
    onValueChange=(e,record)=>{
        console.log(e.target.value)
    }

    componentDidMount() {
        // this.getPersionalInfo(()=>{
        //     this.getArea();
        //     this.getTableData();
        // });
        if(storekeyname.testType===1){
            let that=this;
            window.addEventListener('message', function(ev) {
                let data=ev.data.cache;
                if(data){
                    let personal=JSON.parse(data);
                    console.log("personal:"+JSON.stringify(personal))
                    let utoken=personal.access_token;
                    store.set(storekeyname.TOKEN, utoken);
                    store.set(storekeyname.PERSONALINFO, personal);
                    that.getArea();
                    // that.getPermission(()=>{})
                    that.getTableData();
                }else{

                }
            }, false);
        }else if(storekeyname.testType===0){
            this.getArea();
            // this.getPermission(()=>{})
            this.getTableData();
        }
    }

    render() {
        let columns= getColumns("base_info",this)
        return (
            <Container>
                <Header refresh={true}/>
                <ContentDark>
            <Row className={"search-box"}>
                <Col span={24}>
                    <WrappedAdvancedSearchForm province={this.state.province} city={this.state.city} area={this.state.area} changeSearchData={this.changeSearchData} onSelectChange={this.onSelectChange} />
                </Col>
                <Col span={24}>
                    <Table className={"info-table"}
                           columns={columns}
                           dataSource={this.state.data}
                           bordered
                           size='middle'
                           rowKey={record=>record.id}
                           loading={this.state.loading}
                           rowClassName={(record,index)=>index %2 ===0 ? "odd":"even"}
                           pagination={{
                               current:this.state.pageindex,
                               onChange: page => {
                                   let searchData=this.state.searchData;
                                   this.getTableData(searchData,page);
                               },
                               pageSize: this.state.pagesize,
                               hideOnSinglePage:true,
                               total:this.state.total
                           }}
                    />
                </Col>
            </Row>
                </ContentDark>
            </Container>
        )
    }
}

let _BasicInfo = withRouter(BasicInfo)
export default _BasicInfo;
