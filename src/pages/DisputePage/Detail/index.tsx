import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  Typography,
  Button,
  Space,
  Form,
  Row,
  Col,
  Spin,
  Tag,
  Descriptions,
  Divider,
  Modal,
  Input,
  Select,
  InputNumber,
  DatePicker,
  message
} from 'antd'
import { ArrowLeftOutlined, CheckOutlined, CloseOutlined, UserAddOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import type { DisputeResponse } from '@/types/dispute'
import { disputeService } from '@/apis/disputeService'
import { useAuthStore } from '@/store/useAuthStore'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

const DisputeDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [dispute, setDispute] = useState<DisputeResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  // Modals state
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [resolveForm] = Form.useForm()
  const [cancelForm] = Form.useForm()

  const fetchDetail = async () => {
    if (!id) return
    try {
      setLoading(true)
      const res = await disputeService.getDisputeById(id)
      setDispute(res.data)
    } catch (error) {
      console.error('Failed to fetch dispute detail:', error)
      message.error('Không thể tải thông tin tranh chấp')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDetail()
  }, [id])

  const handleJoin = async () => {
    if (!id) return
    try {
      setActionLoading(true)
      await disputeService.joinDispute(id)
      message.success('Bạn đã nhận giải quyết tranh chấp này')
      fetchDetail()
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Thao tác thất bại')
    } finally {
      setActionLoading(false)
    }
  }

  const handleResolve = async (values: any) => {
    if (!id) return
    try {
      setActionLoading(true)
      await disputeService.resolveDispute(id, {
        ...values,
        newDeadline: values.newDeadline ? values.newDeadline.toDate() : undefined
      })
      message.success('Đã gửi quyết định giải quyết tranh chấp')
      setIsResolveModalOpen(false)
      fetchDetail()
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Thao tác thất bại')
    } finally {
      setActionLoading(false)
    }
  }

  const handleCancel = async (values: any) => {
    if (!id) return
    try {
      setActionLoading(true)
      await disputeService.cancelDispute(id, values)
      message.success('Đã hủy tranh chấp')
      setIsCancelModalOpen(false)
      fetchDetail()
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Thao tác thất bại')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!dispute) {
    return <div>Không tìm thấy tranh chấp</div>
  }

  const isAssignedToMe = dispute.staffId?._id === user?._id
  const isUnassigned = !dispute.staffId

  const getStatusTag = (status: string) => {
    const colors: Record<string, string> = {
      pending_reasons: 'cyan',
      waiting_escalation: 'gold',
      open: 'blue',
      negotiating: 'orange',
      admin_review: 'purple',
      resolved: 'green',
      staff_cancelled: 'red',
      auto_closed: 'default'
    }
    const labels: Record<string, string> = {
      pending_reasons: 'CHỜ LÝ DO',
      waiting_escalation: 'CHỜ CHUYỂN ADMIN',
      open: 'MỞ',
      negotiating: 'ĐANG THƯƠNG LƯỢNG',
      admin_review: 'ADMIN XEM XÉT',
      resolved: 'ĐÃ GIẢI QUYẾT',
      staff_cancelled: 'STAFF ĐÃ HỦY',
      auto_closed: 'TỰ ĐÓNG'
    }
    return <Tag color={colors[status] || 'default'}>{labels[status] || status.toUpperCase()}</Tag>
  }

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Quay lại
        </Button>
        <Space>
          {dispute.status === 'open' && (isUnassigned || isAssignedToMe) && (
            <>
              <Button type="primary" icon={<UserAddOutlined />} loading={actionLoading} onClick={handleJoin}>
                {dispute.staffDecision ? 'Tiếp tục giải quyết' : 'Nhận giải quyết'}
              </Button>
              <Button danger icon={<CloseOutlined />} onClick={() => setIsCancelModalOpen(true)}>
                Hủy Tranh Chấp
              </Button>
            </>
          )}
          {isAssignedToMe && dispute.status === 'negotiating' && (
            <>
              <Button type="primary" icon={<CheckOutlined />} onClick={() => setIsResolveModalOpen(true)}>
                Gửi Quyết Định
              </Button>
            </>
          )}
        </Space>
      </div>

      <Title level={3}>Chi tiết tranh chấp: {dispute._id}</Title>

      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Card title="Thông tin chung">
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Hợp đồng" span={2}>
                <Text strong>{dispute.contractId._id}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Dự án" span={2}>
                {dispute.contractId.projectId.title} ({dispute.contractId.projectId._id})
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">{getStatusTag(dispute.status)}</Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {dayjs(dispute.createdAt).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="Người giải quyết">
                {dispute.staffId ? (
                  <Space>
                    <Text>{dispute.staffId.fullName}</Text>
                    <Text type="secondary">({dispute.staffId._id})</Text>
                  </Space>
                ) : (
                  <Text type="secondary">Chưa có</Text>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Người mở">
                <Text>{dispute.openedBy.fullName}</Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Lý do và Yêu cầu" style={{ marginTop: 24 }}>
            <Row gutter={24}>
              <Col span={12}>
                <Divider orientation="horizontal">Từ Chủ đầu tư</Divider>
                <Paragraph>
                  <Text strong>Lý do:</Text>
                  <div className="p-2 mt-2 text-justify rounded">{dispute.contractorReason || 'N/A'}</div>
                </Paragraph>
                <Paragraph>
                  <Text strong>Yêu cầu giải quyết:</Text>
                  <div className="p-2 mt-2 text-justify rounded">{dispute.contractorRequestedResolution || 'N/A'}</div>
                </Paragraph>
                <Tag color={dispute.contractorAgreed ? 'green' : 'red'}>
                  {dispute.contractorAgreed ? 'Đã đồng ý' : 'Chưa đồng ý'}
                </Tag>
              </Col>
              <Col span={12}>
                <Divider orientation="horizontal">Từ Nhà thầu</Divider>
                <Paragraph>
                  <Text strong>Lý do:</Text>
                  <div className="p-2 mt-2 text-justify rounded">{dispute.freelancerReason || 'N/A'}</div>
                </Paragraph>
                <Paragraph>
                  <Text strong>Yêu cầu giải quyết:</Text>
                  <div className="p-2 mt-2 text-justify rounded">{dispute.freelancerRequestedResolution || 'N/A'}</div>
                </Paragraph>
                <Tag color={dispute.freelancerAgreed ? 'green' : 'red'}>
                  {dispute.freelancerAgreed ? 'Đã đồng ý' : 'Chưa đồng ý'}
                </Tag>
              </Col>
            </Row>
          </Card>

          {(dispute.status === 'resolved' || dispute.staffDecision) && (
            <Card
              title={
                dispute.status === 'resolved' ? 'Quyết định giải quyết' : 'Quyết định giải quyết trước đó (đã mở lại)'
              }
              style={{ marginTop: 24 }}
              extra={dispute.status !== 'resolved' && dispute.staffDecision ? <Tag color="warning">Lịch sử</Tag> : null}
            >
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Quyết định">{dispute.staffDecision || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Loại giải quyết">
                  {dispute.resolutionType ? (
                    <Tag
                      color={
                        dispute.resolutionType === 'extend'
                          ? 'blue'
                          : dispute.resolutionType === 'cancel'
                            ? 'red'
                            : 'orange'
                      }
                    >
                      {dispute.resolutionType.toUpperCase()}
                    </Tag>
                  ) : (
                    'N/A'
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Số tiền Freelancer nhận">
                  {dispute.freelancerAmount ?? 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Số tiền Contractor nhận">
                  {dispute.contractorAmount ?? 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian giải quyết">
                  {dispute.resolvedAt ? dayjs(dispute.resolvedAt).format('DD/MM/YYYY HH:mm') : 'N/A'}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          )}
        </Col>

        <Col span={8}>
          <Card title="Các bên liên quan">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text type="secondary">Chủ đầu tư</Text>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                  <Text strong>{dispute.contractorId.fullName}</Text>
                </div>
              </div>
              <Divider style={{ margin: '12px 0' }} />
              <div>
                <Text type="secondary">Nhà thầu</Text>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                  <Text strong>{dispute.freelancerId.fullName}</Text>
                </div>
              </div>
            </Space>
          </Card>

          <Card title="Thông tin bổ sung" style={{ marginTop: 24 }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Hết hạn gửi Admin">
                {dayjs(dispute.deadlineSendAdmin).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="Chuyển Admin lúc">
                {dispute.escalatedAt ? dayjs(dispute.escalatedAt).format('DD/MM/YYYY HH:mm') : 'N/A'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      {/* Resolve Modal */}
      <Modal
        title="Gửi Quyết Định Giải Quyết"
        open={isResolveModalOpen}
        onCancel={() => setIsResolveModalOpen(false)}
        onOk={() => resolveForm.submit()}
        confirmLoading={actionLoading}
        width={600}
      >
        <Form form={resolveForm} layout="vertical" onFinish={handleResolve} initialValues={{ resolutionType: 'split' }}>
          <Form.Item
            name="decision"
            label="Nội dung quyết định"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung quyết định' }]}
          >
            <TextArea rows={4} placeholder="Nhập chi tiết quyết định giải quyết tranh chấp..." />
          </Form.Item>

          <Form.Item
            name="resolutionType"
            label="Loại giải quyết"
            rules={[{ required: true, message: 'Vui lòng chọn loại giải quyết' }]}
          >
            <Select>
              <Select.Option value="extend">Gia hạn</Select.Option>
              <Select.Option value="cancel">Hủy hợp đồng</Select.Option>
              <Select.Option value="split">Chia tiền</Select.Option>
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="freelancerAmount" label="Số tiền Freelancer nhận">
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="contractorAmount" label="Số tiền Contractor nhận">
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="newDeadline" label="Hạn chót mới (nếu có)">
            <DatePicker style={{ width: '100%' }} showTime />
          </Form.Item>
        </Form>
      </Modal>

      {/* Cancel Modal */}
      <Modal
        title="Hủy Tranh Chấp"
        open={isCancelModalOpen}
        onCancel={() => setIsCancelModalOpen(false)}
        onOk={() => cancelForm.submit()}
        confirmLoading={actionLoading}
      >
        <Form form={cancelForm} layout="vertical" onFinish={handleCancel}>
          <Form.Item name="reason" label="Lý do hủy" rules={[{ required: true, message: 'Vui lòng nhập lý do hủy' }]}>
            <TextArea rows={4} placeholder="Nhập lý do hủy tranh chấp này..." />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  )
}

export default DisputeDetail
