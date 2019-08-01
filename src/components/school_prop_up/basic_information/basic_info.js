import '../../../themes/basic_info.css';
import React, {Component} from 'react';
import store from '../../../utils/store';
import storekeyname from '../../../utils/storeKeyName';
import myUtils from '../../../utils/myUtils';
import {Table, Button, Icon, Form, Input, Select, message,Row,Col} from 'antd';
import {withRouter} from 'react-router-dom';
import {getColumns} from "../../../utils/commom-colums";

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
            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
                <Row gutter={24} className={"form-item-search"}>
                    <Col span={6} >
                        <Form.Item label={"省"}>
                            {getFieldDecorator("province", {
                                initialValue:-1,
                            })(
                                <Select onChange={this.handleChangeProvince}>
                                    {provOptions}
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={6}  >
                        <Form.Item label={"市"}>
                            {getFieldDecorator("city", {
                                initialValue:-1,
                            })(
                                <Select onChange={this.handleChangeCity}>
                                    {cityOptions}
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={6}  >
                        <Form.Item label={"区/县"}>
                            {getFieldDecorator("area", {
                                initialValue:-1,
                            })(
                                <Select>
                                    {areaOptions}
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={6}  >
                        <Form.Item label={"关键字"}>
                            {getFieldDecorator("keywords", {

                            })(<Input placeholder="请输入“名称”关键字" />)}
                        </Form.Item>
                    </Col>
                </Row>
                <Row className={"form-item-btn"}>
                    <Col span={24} style={{ textAlign: 'right' }}>
                        <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>
                            查找
                        </Button>
                        <Button  onClick={this.handleReset} style={{ marginLeft: 8 }}>
                            重置
                        </Button>
                    </Col>
                </Row>
            </Form>
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
            add_edit:false,//显示编辑权限
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
            visible_edit:false,//显示编辑对话框
            pagesize:10,//每页显示条数
            pageindex:1,//默认当前页
            total:0,//数据总数
        }
    }
    //获取个人信息
    getPersionalInfo=(callback)=>{
        let utoken =store.get(storekeyname.TOKEN);
        let paramsUserInfo = {
            access_token: utoken,
        };
        myUtils.post(0, "api/user/currentUserInfo", paramsUserInfo, res => {
            console.log(JSON.stringify(res))
            if (res.code == 0) {
                let personal = res.data;
                if(personal.app_code==""){
                    personal.app_code="aaabbbccc"
                }
                store.set(storekeyname.PERSONALINFO, personal);
                callback();
            }else{
                message.error(res.msg)
            }
        });
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

        console.log("获取数据表格")
        this.setState({
            loading:false
        })
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


        // console.log(JSON.stringify(provList))
        // console.log(JSON.stringify(cityList))
        // console.log(JSON.stringify(areaList))
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

    componentDidMount() {
        this.getPersionalInfo(()=>{
            this.getArea();
            this.getTableData();
        });
    }

    render() {
        let columns= getColumns("stu_card",this)
        return (
            <Row className={"search-box"}>
                <Col span={24}>
                    <WrappedAdvancedSearchForm province={this.state.province} city={this.state.city} area={this.state.area} changeSearchData={this.changeSearchData} onSelectChange={this.onSelectChange} />
                </Col>
                <Col span={24} style={{marginTop:30}}>
                    <Table className={"info-table"}
                           columns={columns}
                           dataSource={this.state.data}
                           bordered
                           rowKey={record=>record.uid}
                           loading={this.state.loading}
                           rowClassName={(record,index)=>index %2 ===0 ? "odd":"even"}
                           locale={{emptyText: '暂无数据'}}
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
        )
    }
}

let _BasicInfo = withRouter(BasicInfo)
export default _BasicInfo;
