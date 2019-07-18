import '../themes/schinfo.css';
import React, {Component} from 'react';
import store from '../utils/store';
import storekeyname from '../utils/storeKeyName';
import myUtils, {KL} from '../utils/myUtils';

import {Table, Divider, Tag, Button} from 'antd';

import {withRouter} from 'react-router-dom';

//路由
class GrdAndCls extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading:true
        }
    }


    componentDidMount() {

        const data = [
            {
                key: '1',
                name: 'John Brown',
                age: 32,
                address: 'New York No. 1 Lake Park',
                tags: ['nice', 'developer'],
            },
            {
                key: '2',
                name: 'Jim Green',
                age: 42,
                address: 'London No. 1 Lake Park',
                tags: ['loser'],
            },
            {
                key: '3',
                name: 'Joe Black',
                age: 32,
                address: 'Sidney No. 1 Lake Park',
                tags: ['cool', 'teacher'],
            },
            {
                key: '4',
                name: 'Joe Black',
                age: 32,
                address: 'Sidney No. 1 Lake Park',
                tags: ['cool', 'teacher'],
            },
            {
                key: '5',
                name: 'Joe Black',
                age: 32,
                address: 'Sidney No. 1 Lake Park',
                tags: ['cool', 'teacher'],
            },
        ];
        setTimeout(()=>{
            let json=store.get(storekeyname.PERMISSIONSWHYNOTALLOW);
            KL.debug(json)
            KL.debug(myUtils.Json2Map(json))
            this.setState({data,loading:false});
            },1000)

    }

    render() {
        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                render: text => <a href="javascript:;">{text}</a>,
            },
            {
                title: 'Age',
                dataIndex: 'age',
                key: 'age',
            },
            {
                title: 'Address',
                dataIndex: 'address',
                key: 'address',
            },
            {
                title: 'Tags',
                key: 'tags',
                dataIndex: 'tags',
                render: tags => (
                    <span>
                        {tags.map(tag => {
                            let color = tag.length > 5 ? 'geekblue' : 'green';
                            if (tag === 'loser') {
                                color = 'volcano';
                            }
                            return (
                                <Tag color={color} key={tag}>
                                    {tag.toUpperCase()}
                                </Tag>
                            );
                        })}
                    </span>
                ),
            },
            {
                title: 'Action',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <a href="javascript:;">Invite {record.name}</a>
                        <Divider type="vertical"/>
                        <a href="javascript:;">Delete</a>
                    </span>
                ),
            },
        ];
        return (
            <div className={"info"}>
                <Button className={"info-button"} type="primary" icon="plus-circle">添加</Button>
                <Table className={"info-table"}
                       columns={columns}
                       dataSource={this.state.data}
                       bordered
                       loading={this.state.loading}
                       rowClassName={(record,index)=>index %2 ===0 ? "odd":"even"}
                       locale={{emptyText: '暂无数据'}}
                />
            </div>
        )
    }
}

let _GrdAndCls = withRouter(GrdAndCls)
export default _GrdAndCls;
