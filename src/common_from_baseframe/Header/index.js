/**
 * 子系统页面默认顶部导航
 *
 * <Header/>
 *   @params {array|function} breadcrumbs 面包屑
 *     breadcrumbs={['一级标题', '二级标题', ...]}
 *     breadcrumbs={(defaultBreadcrumbs) => [...defaultBreadcrumbs, '追加标题', ...]}
 *
 *   @params {boolean} refresh 是否显示刷新按钮
 *   @params {boolean} back 是否显示后退按钮
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Breadcrumb, Icon, Button } from 'antd'
import { withRouter } from 'react-router-dom'

import './index.less'

class Header extends React.Component {
  static propTypes = {
    breadcrumbs: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.func
    ])
  }

  constructor() {
    super()
    this.state = {
      breadcrumbs: window.breadcrumbs ? window.breadcrumbs.split(',') : []
    }
  }

  /**
   * 调用刷新
   */
  invokeRefresh = () => {
    window.location.reload()
  }

  /**
   * 调用后退
   */
  invokeBack = () => {
    window.history.back()
  }

  componentDidMount() {
  }

  render() {
    const { refresh, back, breadcrumbs: propBreadcrumbs, children } = this.props
    const { breadcrumbs: stateBreadcrumbs } = this.state
    let breadcrumbs = []

    if (typeof propBreadcrumbs === 'function') {
      breadcrumbs = propBreadcrumbs(stateBreadcrumbs)
    } else {
      breadcrumbs = propBreadcrumbs || stateBreadcrumbs
    }

    return (
      <Row className="header">
        <Col span={12}>
          <Breadcrumb separator="/">
            <Icon type="home"/>
            {Array.isArray(breadcrumbs) && breadcrumbs.map((breadcrumb, index) => (
              <Breadcrumb.Item key={index}>{breadcrumb}</Breadcrumb.Item>
            ))}
          </Breadcrumb>
        </Col>
        <Col className="header-actions" span={12}>
          {back && (
            <Button icon="arrow-left" title="返回" onClick={this.invokeBack}/>
          )}
          {refresh && (
            <Button icon="sync" title="刷新" onClick={this.invokeRefresh}/>
          )}
          {children}
        </Col>
      </Row>
    )
  }
}

export default withRouter(Header)
