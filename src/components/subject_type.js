import '../themes/schinfo.css';
import React, {Component} from 'react';
import {HashRouter, Route,  Switch, Redirect} from 'react-router-dom';
import store from '../utils/store';
import myUtils from '../utils/myUtils';
import storekeyname from '../utils/storeKeyName';
import GrdAndCls from './grd-cls';

//路由
class SchInfoMain extends Component {
    componentDidMount() {
        window.addEventListener('message', function(ev) {
            let data = ev.data;
            console.log(ev)
            console.info('message from parent page:', data);
        }, false);

        let search=myUtils.getUrlSearch();
        if(search){
            let utoken=search.access_token;
            store.set(storekeyname.TOKEN, utoken);
        }else{
            let utoken="MDRlZjE4MzEtY2MxNy00ODA3LWE3YWUtN2M4OWFkNDgwMmE3";
            store.set(storekeyname.TOKEN, utoken);
        }
    }

    render() {
        return (
            <div>
                <HashRouter>
                    <Switch>
                        <Route exact path='/grd_cls' component={GrdAndCls}/>{/*学段及年级*/}
                        <Route exact path='/college_department' component={GrdAndCls}/>{/*院系*/}
                        <Route exact path='/major' component={GrdAndCls}/>{/*专业*/}
                        <Route exact path='/subject' component={GrdAndCls}/>{/*科目*/}
                        <Route exact path='/teaching_edition' component={GrdAndCls}/>{/*教版*/}
                        <Route exact path='/fascicle' component={GrdAndCls}/>{/*教材分册*/}
                        <Route exact path='/semester' component={GrdAndCls}/>{/*季期*/}
                        <Route exact path='/additional_information' component={GrdAndCls}/>{/*计费系统附加信息*/}
                        <Route exact path='/roles' component={GrdAndCls}/>{/*计费系统角色*/}
                        <Route exact path='/subject_type' component={GrdAndCls}/>{/*分科*/}
                        <Route exact path='/equipment_type' component={GrdAndCls}/>{/*设备类型*/}
                    </Switch>
                </HashRouter>
            </div>
        )
    }
}
export default SchInfoMain;
