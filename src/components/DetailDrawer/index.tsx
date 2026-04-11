import type { ReactNode } from 'react'
import { Drawer } from 'antd'
import type { DrawerProps } from 'antd'

type Props = Pick<DrawerProps, 'open' | 'onClose' | 'title' | 'width' | 'extra'> & {
  children: ReactNode
}

export function DetailDrawer({ open, onClose, title, extra, children }: Props) {
  return (
    <Drawer title={title} size="large" open={open} onClose={onClose} destroyOnHidden extra={extra}>
      {children}
    </Drawer>
  )
}
