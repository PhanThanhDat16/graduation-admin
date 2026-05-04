import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import { Button, Popconfirm, Space, Tooltip } from 'antd'
import type React from 'react'

type ExtraAction = {
  icon: React.ReactNode
  tooltip: string
  onClick: () => void
  color?: string
}

type Props = {
  showEdit?: boolean
  showDelete?: boolean
  showView?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onView?: () => void
  extraActions?: ExtraAction[]
}

const TableAction = ({ showEdit, showDelete, showView, onEdit, onDelete, onView }: Props) => {
  return (
    <>
      <Space>
        {showView && (
          <Tooltip title="Xem chi tiết">
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              style={{
                color: '#52c41a',
                cursor: 'pointer'
              }}
              onClick={onView}
            />
          </Tooltip>
        )}

        {showEdit && (
          <Tooltip title="Chỉnh sửa">
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              style={{
                color: '#1677ff',
                cursor: 'pointer'
              }}
              onClick={onEdit}
            />
          </Tooltip>
        )}

        {showDelete && (
          <Popconfirm
            title="Xác nhận xóa?"
            description="Bạn có chắc chắn muốn xóa mục này không?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={onDelete}
          >
            <Button
              type="link"
              size="small"
              icon={<DeleteOutlined />}
              style={{
                color: 'red',
                cursor: 'pointer'
              }}
            />
          </Popconfirm>
        )}
      </Space>
    </>
  )
}

export default TableAction
