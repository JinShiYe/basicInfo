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
            <div className='common-search-form'>
                <Form onSubmit={this.handleSearch} layout="inline" >
                    <Form.Item label={"省"}>
                        {getFieldDecorator("province", {
                            initialValue:'000000',
                        })(
                            <Select onChange={this.handleChangeProvince}>
                                {provOptions}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label={"市"}>
                        {getFieldDecorator("city", {
                            initialValue:'000000',
                        })(
                            <Select onChange={this.handleChangeCity}>
                                {cityOptions}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label={"区/县"}>
                        {getFieldDecorator("area", {
                            initialValue:'000000',
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
            add:false,//添加权限
            edit:false,//编辑权限
            searchData:{
                province:0,//省
                city:0,//市
                area:0,//县/区
                keywords:"",//
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
            myUtils.post(storekeyname.INTERFACEGU+"SysArea", paramsUserInfo, res => {
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
        let provList=[{code:'000000',name:"全部省"}]
        list.map(item=>{
            let code =item.code;
            if(code.indexOf("0000")!=-1){
                provList.push(item);
            }
        })
        let cityList=[{code:'000000',name:"全部城市"}];
        let areaList=[{code:'000000',name:"全部县/区"}];
        this.setState({
            proList:list,
            province:provList,
            city:cityList,
            area:areaList,
        })
    }
    //获取列表数据
    getTableData=(searchData,page)=>{

        let utoken =store.get(storekeyname.TOKEN);
        let paramsUserInfo = {
            access_token: utoken,
            keyword:searchData.keywords,
            page_number:page,
            page_size: this.state.pagesize,
        };
        myUtils.post(storekeyname.INTERFACEMENG+"api/sch/page", paramsUserInfo, res => {
            console.log(res);
            if (res.code == 0) {
                let data =res.data.list;
                console.log(JSON.stringify(data));
                this.setState({
                    loading:false,
                    data,
                    total:res.totalRow
                })
            }else{
                message.error(res.msg)
            }
        });

    }

    //获取权限
    getPermission=()=>{
        //1.9: 查询权限符（前端调用，判断按钮是否显示）
        let utoken =store.get(storekeyname.TOKEN);
        let personal=store.get(storekeyname.PERSONALINFO);
        let permissions = [
            storekeyname.schoolInfo_baseInfo_add,storekeyname.schoolInfo_baseInfo_edit,
        ]
        let access = [];
        permissions.map(item => {
            access.push(personal.app_code +item)
        });
        let paramsPermissions = {
            platform_code: personal.platform_code, //平台代码
            app_code: personal.app_code, //应用系统代码
            grd_code: 0, //年级id，全部年级则传-1,不需要判断年级则传0
            cls_code: 0, //班级id，年级下全部班级则传-1，不需要判断班级则传0
            stu_code: 0, //学生id，全部学生则传-1，不需要判断学生则传0
            sub_code: 0, //科目代码，全部科目则传“-1”，不需要判断年级则传“0”
            access: access.join(","), //权限符，需要判断权限的权限符，多个则用逗号拼接
            access_token: utoken //用户令牌
        };
        myUtils.post(storekeyname.INTERFACEZENG+"api/acl/permissionByPosition", paramsPermissions, res => {
            console.log(JSON.stringify(res))
            if (res.code == 0) {
                let rspList = res.data.result.split(",");
                let permissionsObj = new Map();
                rspList.map((item, index) => {
                    if (item == 1) {
                        permissionsObj.set(permissions[index], true);
                    } else {
                        permissionsObj.set(permissions[index], false);
                    }
                });
                this.setState({
                    add:permissionsObj.get(storekeyname.schoolInfo_baseInfo_add),
                    edit:permissionsObj.get(storekeyname.schoolInfo_baseInfo_edit),
                })
            } else {
                message.error(res.msg)
            }
        });
    }

    //数据字典
    getDictList=()=>{
        let utoken =store.get(storekeyname.TOKEN);
        let params = {
            access_token: utoken //用户令牌
        };
        myUtils.post(storekeyname.INTERFACEMENG+"api/dict", params, res => {
            console.log(JSON.stringify(res))
            if (res.code == 0) {
                console.log(JSON.stringify(res.data.list));
            } else {
                message.error(res.msg)
            }
        });
    }

    //选择模块选项改变事件，用于省市区选择器三级联动
    onSelectChange=(id,type)=>{
        let proList=this.state.proList;
        if(type==="province"){//根据省代码获取市列表
            let cityList=[{code:'000000',name:"全部城市"}]
            console.log(id);
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
            let areaList=[{code:'000000',name:"全部县/区"}]
            this.setState({
                city:cityList,
                area:areaList
            })
        }else if(type==="city"){//根据市代码获取区县列表
            let areaList=[{code:'000000',name:"全部县/区"}]
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
        this.getArea();
        this.getDictList();
        this.getPermission()
        this.getTableData(this.state.searchData,this.state.pageindex);
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
                           rowKey={record=>record.code}
                           loading={this.state.loading}
                           pagination={{
                               current:this.state.pageindex,
                               onChange: page => {
                                   this.getTableData(this.state.searchData,page);
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
