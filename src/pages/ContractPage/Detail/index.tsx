import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  Descriptions,
  Typography,
  Button,
  Space,
  Spin,
  Form,
  Input,
  InputNumber,
  Select,
  Row,
  Col,
  message
} from 'antd'
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'
import { contractService } from '@/apis/contractService'
import { userService } from '@/apis/userService'
import { projectService } from '@/apis/projectService'
import type { ContractResponse } from '@/types/contract'

const { Title, Text } = Typography

const ContractDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [contract, setContract] = useState<ContractResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form] = Form.useForm()

  const fetchDetail = async () => {
    if (!id) return
    try {
      setLoading(true)
      const res = await contractService.getContractById(id)
      const contractData = res.data

      // Fetch names
      if (contractData.contractor_id?._id) {
        try {
          const userRes = await userService.getUserById(contractData.contractor_id._id)
          contractData.contractorName = userRes.data?.fullName || '—'
        } catch (error) {
          console.error('Error fetching contractor user:', error)
        }
      }

      if (contractData.freelancer_id?._id) {
        try {
          const userRes = await userService.getUserById(contractData.freelancer_id._id)
          contractData.freelancerName = userRes.data?.fullName || '—'
        } catch (error) {
          console.error('Error fetching freelancer user:', error)
        }
      }

      if (contractData.project_id) {
        try {
          const projectRes = await projectService.getProjectById(contractData.project_id)
          contractData.projectName = projectRes.data?.title || '—'
        } catch (error) {
          console.error('Error fetching project:', error)
        }
      }

      setContract(contractData)
      form.setFieldsValue({
        total_amount: contractData.total_amount,
        admin_fee: contractData.admin_fee,
        status: contractData.status,
        description: contractData.description
      })
    } catch (error) {
      console.error('Failed to fetch contract detail:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDetail()
  }, [id])

  const handleSave = async (values: any) => {
    if (!id) return
    try {
      setSaving(true)
      await contractService.updateContract(id, values)
      message.success('Cập nhật hợp đồng thành công')
      fetchDetail()
    } catch (error: any) {
      console.error('Failed to update contract:', error)
      message.error(error?.response?.data?.message || 'Thao tác thất bại')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!contract) {
    return <div>Không tìm thấy hợp đồng</div>
  }

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
        Quay lại
      </Button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}>
          Chi tiết hợp đồng: {contract._id}
        </Title>
        <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={() => form.submit()}>
          Lưu thay đổi
        </Button>
      </div>

      <Card>
        <Form form={form} layout="vertical" onFinish={handleSave} requiredMark="optional">
          <Row gutter={24}>
            <Col xs={24} md={16}>
              <Form.Item label="Mô tả" name="description">
                <Input.TextArea rows={4} />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Tổng giá trị" name="total_amount">
                    <InputNumber
                      style={{ width: '100%' }}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Phí nền tảng" name="admin_fee">
                    <InputNumber
                      style={{ width: '100%' }}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Trạng thái" name="status">
                <Select
                  options={[
                    { label: 'Nháp (Draft)', value: 'draft' },
                    { label: 'Đang chờ duyệt (Pending)', value: 'pending' },
                    { label: 'Chờ thanh toán (Waiting Payment)', value: 'waiting_payment' },
                    { label: 'Đang thi công (Running)', value: 'running' },
                    { label: 'Đã nộp (Submitted)', value: 'submitted' },
                    { label: 'Đã hoàn thành (Completed)', value: 'completed' },
                    { label: 'Tranh chấp (Dispute)', value: 'dispute' },
                    { label: 'Đã hủy (Cancelled)', value: 'cancelled' }
                  ]}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Card size="small" title="Thông tin đối tác" style={{ background: '#fafafa' }}>
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Mã hợp đồng">
                    <Text copyable>{contract._id}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Dự án">
                    {contract.projectName}
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      ({contract.project_id})
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Chủ đầu tư">
                    {contract.contractorName}
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      ({contract.contractor_id?._id})
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Nhà thầu">
                    {contract.freelancerName}
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      ({contract.freelancer_id?._id})
                    </Text>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>
        </Form>
      </Card>
    </Space>
  )
}

export default ContractDetail
