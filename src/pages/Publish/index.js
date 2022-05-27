import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select,
  message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import './index.scss'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
import { useState, useRef, useEffect } from 'react'
import { http } from '@/utils'
import { useSearchParams } from 'react-router-dom'
const { Option } = Select

const Publish = () => {

  const navigator = useNavigate()
  const { channelStore } = useStore()

  const [fileList, setFileList] = useState([])

  // 编辑文案适配 如果路由后面有id，则是编辑文章，否则是发布文章
  const [params] = useSearchParams()
  const id = params.get('id')

  // 数据回填，根据id调用接口 1.填充表单 2.填充fileList图片展示 3.填充暂存仓库
  const form = useRef(null)
  useEffect(() => {
    const loadDetail = async () => {
      const res = await http.get(`/mp/articles/${id}`)
      const { cover } = res.data
      // setFieldsValue填充数据
      form.current.setFieldsValue({ ...res.data, type: cover.type })
      const imageList = cover.images.map(url => ({ url }))
      setFileList(imageList)
      cacheImgList.current = imageList
    }
    // 必须是编辑状态才发送请求
    if (id) {
      loadDetail()

    }
  }, [id])

  // 使用一个useRef暂存仓库
  const cacheImgList = useRef()
  const onUploadChange = ({ fileList }) => {
    const formatList = fileList.map(file => {
      if (file.response) {
        return {
          url: file.response.data.url
        }
      }
      return file
    })
    setFileList(formatList)
    // 把图片列表也存入仓库一份
    cacheImgList.current = formatList
    console.log(cacheImgList)
  }

  // 切换单图无图三图
  const [imgCount, setImgCount] = useState(1)
  const radioChange = (e) => {
    // useState修改后的值无法同步获取修改后的新值，
    // 所以if判断时，要用e.target.value原始值来判断
    const count = e.target.value
    setImgCount(count)
    if (count === 1) {
      const img = cacheImgList.current ? cacheImgList.current[0] : []
      setFileList([img])
    } else if (count === 3) {

      setFileList(cacheImgList.current)
    }
  }

  const onFinish = async (values) => {
    console.log(values)
    const { channel_id, content, title, type } = values
    const params = {
      ...values,
      cover: {
        type: values.type,
        images: fileList.map(item => item.url)
      }
    }
    if (id) {
      await http.put(`/mp/articles/${id}?draft=false`, params)
    } else {
      await http.post('/mp/articles?draft=false', params)
    }
    navigator('/article')
    message.success(`${id ? '更新成功' : '发布成功'}`)

  }

  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{id ? '编辑' : '发布'}文章</Breadcrumb.Item>
          </Breadcrumb>
        }
      >
        <Form
          onFinish={onFinish}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 1 }}
          ref={form}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入文章标题' }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: '请选择文章频道' }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              <option value="jack">Jack</option>
              {channelStore.channelList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}

            </Select>
          </Form.Item>
          <Form.Item label="封面">
            <Form.Item name="type" defaultValue={1}>
              <Radio.Group onChange={radioChange}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {imgCount > 0 && <Upload
              name="image"
              listType="picture-card"
              className="avatar-uploader"
              action='http://geek.itheima.net/v1_0/upload'
              showUploadList
              fileList={fileList}
              onChange={onUploadChange}
              multiple={imgCount > 1}  // 支持多选文件，开启后按住 ctrl 可选择多个文件
              maxCount={imgCount}
            >
              <div style={{ marginTop: 8 }}>
                <PlusOutlined />
              </div>
            </Upload>}
          </Form.Item>
          {/* 富文本组件已经被Form.Item控制，输入的内容会在onFinish中收集起来 */}
          <Form.Item
            initialValue=''
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入文章内容' }]}
          >
            <ReactQuill
              theme="snow"
              placeholder="请输入文章内容"
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                {id ? '编辑' : '发布'}文章
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default observer(Publish)