import React from 'react'
import { Row, Col } from 'antd'
import errors from './errors'
import './index.less'
import SVGError from '../../images/error.svg'

export default class Error extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      second: 3
    }
  }

  redirectToLogin() {
    console.log(window.self.window)
    console.log(window.top.window);
    if (window.self.window === window.top.window) {
      this.props.history.push({
        pathname: '/login'
      })
    }
  }

  count() {
    const timer = setInterval(() => {
      this.setState(({ second }) => {
        return {
          second: second - 1
        }
      })

      // 倒计时结束停止计时器并跳转至登录页
      if (this.state.second <= 0) {
        clearInterval(timer)
        this.redirectToLogin()
      }
    }, 1000)
  }

  componentDidMount() {
    console.log(this.props);
    const { params } = this.props.match
    const code = params.code
    if (code === '0006') {
      this.count()
    }
  }

  render() {
    const { params } = this.props.match
    const code = params.code
    const message = errors[code]

    return (
      <div className="error-wrapper">
        <Row>
          <Col className="error-image-wrapper" span={12}>
            <img src={SVGError} alt="error"/>
          </Col>
          <Col offset={2} span={10}>
            <h1>{code}</h1>
            <h2>{message}</h2>
            <p>
              {this.state.second}
              &nbsp;
              秒后自动关闭 ...
            </p>
          </Col>
        </Row>
      </div>
    )
  }
}
