import '../../../themes/grd_cls_sub.css';
import React, {Component} from 'react';
import store from '../../../utils/store';
import storekeyname from '../../../utils/storeKeyName';
import myUtils from '../../../utils/myUtils';
import {Table, Modal, Button, Icon, Form, Input, Select, message, Row, Col,Switch} from 'antd';
import {withRouter} from 'react-router-dom';



class GrdClsSub extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],//列表数据
            loading:true,//正在加载中
            add_edit:false,//显示编辑对话框
            showFk:false,//是否显示分科设置
            rowId:0,
        }
    }

    fenKeChange=(isFk,e)=>{
        if(isFk){
            this.setState({
                showFk:true
            })
        }else{
            this.setState({
                showFk:false
            })
        }
    }

    onClickRow = (record) => {
        return {
            onClick: () => {
                this.setState({
                    rowId: record.key,
                });
            },
        };
    }

    setRowClassName = (record) => {
        return record.key === this.state.rowId ? 'clickRowStyl' : '';
    }

    componentDidMount() {
    }


    render() {


        const columns1 = [
            {
                title: '学段',
                dataIndex: 'name',
                render: text => <a href="javascript:;">{text}</a>,
            }
        ];
        const columns1_2 = [
            {
                title: '年级',
                dataIndex: 'name',
                render: text => <a href="javascript:;">{text}</a>,
            }
        ];
        const columns2 = [
            {
                title: '学校开设科目',
                dataIndex: 'name',
                render: text => <a href="javascript:;">{text}</a>,
            }
        ];
        const columns3 = [
            {
                title: '班级属性',
                dataIndex: 'name',
                render: text => <a href="javascript:;">{text}</a>,
            }
        ];

        const columns4 = [
            {
                title: '综合科目包含',
                dataIndex: 'name',
                render: text => <a href="javascript:;">{text}</a>,
            }
        ];

        const data1 = [];
        for (let i = 0; i < 3; ++i) {
            data1.push({
                key: i,
                name: 'Screem',
                platform: 'iOS',
                version: '10.3.4.5654',
                upgradeNum: 500,
                creator: 'Jack',
                createdAt: '2014-12-24 23:12:00',
            });
        }
        const data2 = [];
        for (let i = 0; i < 10; ++i) {
            data2.push({
                key: i,
                name: 'Screem',
                platform: 'iOS',
                version: '10.3.4.5654',
                upgradeNum: 500,
                creator: 'Jack',
                createdAt: '2014-12-24 23:12:00',
            });
        }
        const data3 = [];
        for (let i = 0; i < 23; ++i) {
            data3.push({
                key: i,
                name: 'Screem',
                platform: 'iOS',
                version: '10.3.4.5654',
                upgradeNum: 500,
                creator: 'Jack',
                createdAt: '2014-12-24 23:12:00',
            });
        }

        let fk=null;
        if(this.state.showFk){
            fk=<Row >
                <Col span={12}>
                    <Table
                        columns={columns3}
                        dataSource={data1}
                        bordered
                        size='middle'
                        pagination={false}
                        scroll={{ y: 350 }}
                        footer={() => '编辑'}
                        rowClassName={this.setRowClassName}
                        onRow={this.onClickRow}
                    />
                </Col>
                <Col span={12}>
                    <Table
                        columns={columns4}
                        dataSource={data1}
                        bordered
                        size='middle'
                        pagination={false}
                        scroll={{ y: 350 }}
                        footer={() => '编辑'}
                    />
                </Col>
            </Row>
        }
        return (
            <Row style={{marginLeft:15,marginRight:15}}>
                <Row style={{textAlign:"center",marginTop:25}}>
                    <h1>济南第三职业中专</h1>
                </Row>
                <Row gutter={16} style={{marginTop:25}}>
                    <Col span={9}>
                        <Row>
                            <h3>1、学段与年级</h3>
                        </Row>
                        <Row style={{marginTop:10}}>
                            <Col span={12}>
                                <Table
                                    columns={columns1}
                                    dataSource={data1}
                                    bordered
                                    size='middle'
                                    defaultExpandAllRows={true}
                                    pagination={false}
                                    footer={() => '编辑'}
                                    scroll={{ y: 350 }}
                                    rowClassName={this.setRowClassName}
                                    onRow={this.onClickRow}
                                />
                            </Col>
                            <Col span={12}>
                                <Table
                                    columns={columns1_2}
                                    dataSource={data2}
                                    bordered
                                    size='middle'
                                    defaultExpandAllRows={true}
                                    pagination={false}
                                    footer={() => <span>&nbsp;</span>}
                                    scroll={{ y:350 }}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col span={5}>
                        <Row>
                            <h3>2、学校开设科目</h3>
                        </Row>
                        <Row style={{marginTop:10}}>
                            <Table
                                columns={columns2}
                                dataSource={data3}
                                bordered
                                size='middle'
                                pagination={false}
                                scroll={{ y: 350 }}
                                footer={() => "编辑"}
                            />
                        </Row>
                    </Col>
                    <Col span={9}>
                        <Row>
                            <h3>3、学校分科选择 <Switch checkedChildren={`  分科`} unCheckedChildren="不分科" defaultChecked={false} style={{width:75}} onClick={this.fenKeChange}/></h3>
                        </Row>
                        <Row style={{marginTop:8}}>
                            {fk}
                        </Row>
                    </Col>
                </Row>
            </Row>
        )
    }
}

let _GrdClsSub = withRouter(GrdClsSub)
export default _GrdClsSub;
