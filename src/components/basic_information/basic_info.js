import '../../themes/basic_info.css';
import React, {Component} from 'react';
import store from '../../utils/store';
import storekeyname from '../../utils/storeKeyName';
import myUtils,{getTableData,add_editData} from '../../utils/myUtils';
import {Table, Button, Icon, Form, Input, Select, message,Row,Col} from 'antd';
import {withRouter} from 'react-router-dom';

class AdvancedSearchForm extends React.Component {
    state = {
        expand: false,
    };

    // To generate mock Form.Item
    getFields() {
        const count = this.state.expand ? 10 : 8;
        const { getFieldDecorator } = this.props.form;
        const children = [];
        for (let i = 0; i < 10; i++) {
            children.push(
                <Col span={6} key={i} style={{ display: i < count ? 'block' : 'none' }}>
                    <Form.Item label={`Field ${i}`}>
                        {getFieldDecorator(`field-${i}`, {
                            rules: [
                                {
                                    required: true,
                                    message: 'Input something!',
                                },
                            ],
                        })(<Input placeholder="placeholder" />)}
                    </Form.Item>
                </Col>,
            );
        }
        return children;
    }

    handleSearch = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
        });
    };

    handleReset = () => {
        this.props.form.resetFields();
    };

    toggle = () => {
        const { expand } = this.state;
        this.setState({ expand: !expand });
    };

    render() {
        return (
            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
                <Row gutter={24}>{this.getFields()}</Row>
                <Row>
                    <Col span={24} style={{ textAlign: 'right' }}>
                        <Button type="primary" htmlType="submit">
                            Search
                        </Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                            Clear
                        </Button>
                        <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
                            Collapse <Icon type={this.state.expand ? 'up' : 'down'} />
                        </a>
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
                    <Col span={20} offset={2}>
                        <WrappedAdvancedSearchForm />
                    </Col>
                </Row>
            </div>
        )
    }
}

let _BasicInfo = withRouter(BasicInfo)
export default _BasicInfo;
