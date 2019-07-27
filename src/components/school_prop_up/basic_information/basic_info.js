import '../../../themes/basic_info.css';
import React, {Component} from 'react';
import store from '../../../utils/store';
import storekeyname from '../../../utils/storeKeyName';
import myUtils from '../../../utils/myUtils';
import {Table, Button, Icon, Form, Input, Select, message,Row,Col} from 'antd';
import {withRouter} from 'react-router-dom';

class AdvancedSearchForm extends React.Component {
    handleSearch = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
        });
    };

    handleReset = () => {
        this.props.form.resetFields();
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
                <Row gutter={24} className={"form-item-search"}>
                    <Col span={6} >
                        <Form.Item label={"省"}>
                            {getFieldDecorator("province", {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Input something!',
                                    },
                                ],
                            })(<Input placeholder="placeholder" />)}
                        </Form.Item>
                    </Col>
                    <Col span={6}  >
                        <Form.Item label={"市"}>
                            {getFieldDecorator("city", {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Input something!',
                                    },
                                ],
                            })(<Input placeholder="placeholder" />)}
                        </Form.Item>
                    </Col>
                    <Col span={6}  >
                        <Form.Item label={"区/县"}>
                            {getFieldDecorator("area", {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Input something!',
                                    },
                                ],
                            })(<Input placeholder="placeholder" />)}
                        </Form.Item>
                    </Col>
                    <Col span={6}  >
                        <Form.Item label={"关键字"}>
                            {getFieldDecorator("keywords", {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Input something!',
                                    },
                                ],
                            })(<Input placeholder="placeholder" />)}
                        </Form.Item>
                    </Col>
                </Row>
                <Row className={"form-item-btn"}>
                    <Col span={3} offset={21}  style={{ textAlign: 'right',background:"#fff" }}>
                        <Button type="primary" htmlType="submit">
                            查找
                        </Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
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
            visible_add:false,//显示新增对话框
            visible_edit:false,//显示编辑对话框
            pagesize:10,//每页显示条数
            pageindex:1,//默认当前页
            total:0,//数据总数
        }
    }

    componentDidMount() {
        function getPersionalInfo(callback){
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

        function getArea(callback){
            let list= store.get(storekeyname.PROVINCE_CITY_AREA);
            if(list){
                console.log("已经有数据了");
                callback();
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
                        let provList=[]
                        list.map(item=>{
                            let code =item.code;
                            if(code.indexOf("0000")!=-1){
                                provList.push(item);
                            }
                        })
                        // //TODO 根据省代码获取市代码
                        // let cityList=[]
                        // list.map(item=>{
                        //     let code=item.code;
                        //     if(code.substr(0,2).indexOf("37")!=-1&&code.substr(2,2).indexOf("00")==-1&&code.substr(4,6).indexOf("00")!=-1){
                        //         cityList.push(item)
                        //     }
                        // })
                        // //TODO 根据省代码  市代码获取区县城 代码
                        // let areaList=[]
                        // list.map(item=>{
                        //     let code=item.code;
                        //     if(code.substr(0,4).indexOf("3716")!=-1&&code.substr(4,6).indexOf("00")==-1){
                        //         areaList.push(item)
                        //     }
                        // })
                        // console.log(JSON.stringify(provList))
                        // console.log(JSON.stringify(cityList))
                        // console.log(JSON.stringify(areaList))
                        callback();
                    }else{
                        message.error(res.msg)
                    }
                });
            }
        }

        function  getTableData(){
            console.log("获取数据表格")
        }
        getPersionalInfo(()=>{
            getArea(()=>{
                getTableData();
            });
        });
    }

    render() {
        return (
            <div>
                <Row>
                    <Col span={24}>
                        <WrappedAdvancedSearchForm />
                    </Col>
                </Row>
            </div>
        )
    }
}

let _BasicInfo = withRouter(BasicInfo)
export default _BasicInfo;
