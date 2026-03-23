import type { ReactNode } from 'react'
import { Drawer } from 'antd'
import type { DrawerProps } from 'antd'

type Props = Pick<DrawerProps, 'open' | 'onClose' | 'title' | 'width' | 'extra'> & {
  children: ReactNode
}

export function DetailDrawer({ open, onClose, title, width = 520, extra, children }: Props) {
  return (
    <Drawer title={title} width={width} open={open} onClose={onClose} destroyOnClose extra={extra}>
      {children}
    </Drawer>
  )
}
