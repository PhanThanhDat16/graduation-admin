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
  Select,
  InputNumber,
  Row,
  Col,
  message
} from 'antd'
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { projectService } from '@/apis/projectService'
import { userService } from '@/apis/userService'
import type { ProjectResponse } from '@/types/project'

const { Title, Text } = Typography

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [project, setProject] = useState<ProjectResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form] = Form.useForm()

  const fetchDetail = async () => {
    if (!id) return
    try {
      setLoading(true)
      const res = await projectService.getProjectById(id)
      const projectData = res.data

      // Fetch contractorName if not present
      if (projectData.contractorId) {
        try {
          const userRes = await userService.getUserById(projectData.contractorId)
          projectData.contractorName = userRes.data?.fullName || '—'
        } catch (error) {
          console.error('Error fetching contractor user:', error)
        }
      }

      setProject(projectData)
      form.setFieldsValue({
        title: projectData.title,
        description: projectData.description,
        category: projectData.category,
        budgetMin: projectData.budgetMin,
        budgetMax: projectData.budgetMax,
        status: projectData.status,
        skills: projectData.skills
      })
    } catch (error) {
      console.error('Failed to fetch project detail:', error)
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
      await projectService.updateProject(id, values)
      message.success('Cập nhật dự án thành công')
      fetchDetail()
    } catch (error: any) {
      console.error('Failed to update project:', error)
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

  if (!project) {
    return <div>Không tìm thấy dự án</div>
  }

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
        Quay lại
      </Button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}>
          Chi tiết dự án: {project._id}
        </Title>
        <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={() => form.submit()}>
          Lưu thay đổi
        </Button>
      </div>

      <Card>
        <Form form={form} layout="vertical" onFinish={handleSave} requiredMark="optional">
          <Row gutter={24}>
            <Col xs={24} md={16}>
              <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: 'Nhập tiêu đề dự án' }]}>
                <Input maxLength={200} />
              </Form.Item>

              <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Nhập mô tả dự án' }]}>
                <Input.TextArea rows={6} />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Loại dự án" name="category">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Trạng thái" name="status">
                    <Select
                      options={[
                        { label: 'Hoạt động (Open)', value: 'open' },
                        { label: 'Đã giao (Closed)', value: 'closed' },
                        { label: 'Hoàn thành (Completed)', value: 'completed' },
                        { label: 'Đã hủy (Canceled)', value: 'canceled' }
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Kỹ năng cần có" name="skills">
                <Select mode="tags" style={{ width: '100%' }} placeholder="Thêm kỹ năng" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Card size="small" title="Thông tin bổ sung" style={{ background: '#fafafa' }}>
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Mã dự án">
                    <Text copyable>{project._id}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Chủ dự án">
                    {project.contractorName}
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      ({project.contractorId})
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Lượt thích">{project.likes}</Descriptions.Item>
                  <Descriptions.Item label="Tạo lúc">
                    {dayjs(project.createdAt).format('DD/MM/YYYY HH:mm')}
                  </Descriptions.Item>
                </Descriptions>

                <div style={{ marginTop: 16 }}>
                  <Form.Item label="Ngân sách tối thiểu" name="budgetMin">
                    <InputNumber
                      style={{ width: '100%' }}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                  <Form.Item label="Ngân sách tối đa" name="budgetMax">
                    <InputNumber
                      style={{ width: '100%' }}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </div>
              </Card>
            </Col>
          </Row>
        </Form>
      </Card>
    </Space>
  )
}

export default ProjectDetail
