import React from 'react'
import './index.less'

export const Content = ({ children }) => (
  <div className="content">{children}</div>
)

export const ContentDark = ({ children }) => (
  <div className="content content-dark">{children}</div>
)
