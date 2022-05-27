import { Link, useNavigate } from 'react-router-dom'
import { Card, Breadcrumb, Form, Button, Radio, DatePicker, Select, Table, Tag, Space, message, Popconfirm } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import 'moment/locale/zh-cn'
import locale from 'antd/es/date-picker/locale/zh_CN'
import './index.scss'
import img404 from '@/assets/error.png'
import { observer } from 'mobx-react-lite'
import { http } from '@/utils'
import { useEffect, useState } from 'react'
import { useStore } from '@/store'

const { Option } = Select
const { RangePicker } = DatePicker

const Article = () => {
  const onFinish = (value) => {
    console.log(value)
    const { status, date, channel_id } = value
    let newParams = {}
    // 数据处理
    if (status !== -1) {
      newParams.status = status
    }
    if (channel_id) {
      newParams.channel_id = channel_id
    }
    if (date) {
      newParams.begin_pubdate = date[0].format('YYYY-MM-DD')
      newParams.end_pubdate = date[1].format('YYYY-MM-DD')
    }
    setParams({
      ...params,
      ...newParams
    })
  }
  // 分页器改变page 又会重新发起请求
  const pageChange = (page) => {
    setParams({
      ...params,
      page
    })
  }
  // 删除文章
  const delArticle = async (data) => {
    await http.delete(`mp/articles/${data.id}`)
    // 删除完刷新一下列表
    setParams({
      ...params,
      page: 1
    })
  }
  // 取消删除
  const cancel = (e) => {
    console.log(e)
    message.error('取消删除')
  }
  // 编辑文章
  const navigate = useNavigate()
  const goPublish = (data) => {
    navigate(`/publish?id=${data.id}`)
  }
  // 频道下拉框数据
  const { channelStore } = useStore()
  //console.log(channelStore.channelList)

  // const [channels, setChannels] = useState([])
  // const getChannels = async () => {
  //   const res = await http.get('/channels')
  //   setChannels(res.data.channels)
  // }
  // useEffect(() => {
  //   getChannels()
  // }, [])

  // 文章列表数据
  const [article, setArticle] = useState({
    list: [],
    count: 0
  })
  // 文章参数管理，分页，每页的条数
  const [params, setParams] = useState({
    page: 1,
    per_page: 2
  })

  // 如果异步请求函数需要依赖一些数据的变化重新执行，统一不抽离函数到外面，都放在useEffect内部
  // 函数写在外面，每次组件更新都会重新进行函数初始化，这本身就是一次性能消耗
  //写到useEffect中，只会在依赖项发生变化的时候 函数才会进行重新初始化
  // 避免性能损失
  useEffect(() => {
    const getArticleList = async () => {
      const res = await http.get('/mp/articles', { params })
      setArticle({
        list: res.data.results,
        count: res.data.total_count
      })
    }
    getArticleList()
  }, [params])

  const columns = [
    {
      title: '封面',
      dataIndex: 'cover',
      width: 120,
      render: cover => {
        return <img src={cover || img404} width={80} height={60} alt="" />
      }
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 220
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: data => <Tag color="green">审核通过</Tag>
    },
    {
      title: '发布时间',
      dataIndex: 'pubdate'
    },
    {
      title: '阅读数',
      dataIndex: 'read_count'
    },
    {
      title: '评论数',
      dataIndex: 'comment_count'
    },
    {
      title: '点赞数',
      dataIndex: 'like_count'
    },
    {
      title: '操作',
      render: data => {
        return (
          <Space size="middle">
            <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => goPublish(data)} />

            <Popconfirm title="确定删除吗？" onConfirm={() => delArticle(data)} onCancel={cancel}>
              <Button
                type="primary"
                danger
                shape="circle"
                className='delicon'
                icon={<DeleteOutlined />}
              >
              </Button>
            </Popconfirm>

          </Space>
        )
      }
    }
  ]

  const data = [
    {
      id: '8218',
      comment_count: 0,
      cover: {
        images: ['http://geek.itheima.net/resources/images/15.jpg'],
      },
      like_count: 0,
      pubdate: '2019-03-11 09:00:00',
      read_count: 2,
      status: 2,
      title: 'wkwebview离线化加载h5资源解决方案'
    }
  ]
  return (
    <div>
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>内容管理</Breadcrumb.Item>
          </Breadcrumb>
        }
        style={{ marginBottom: 20 }}
      >
        <Form onFinish={onFinish} initialValues={{ status: null }}>
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value={null}>全部</Radio>
              <Radio value={0}>草稿</Radio>
              <Radio value={1}>待审核</Radio>
              <Radio value={2}>审核通过</Radio>
              <Radio value={3}>审核失败</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="频道" name="channel_id" rules={[{ required: true, message: '请选择文章频道' }]}>
            <Select
              placeholder="请选择文章频道"
              style={{ width: 120 }}
            >
              {channelStore.channelList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
            </Select>
          </Form.Item>

          <Form.Item label="日期" name="date">
            {/* 传入locale属性 控制中文显示*/}
            <RangePicker locale={locale}></RangePicker>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 80 }}>
              筛选
            </Button>
          </Form.Item>
        </Form>
      </Card>
      {/* 表格区域 */}
      <Card title={`根据筛选条件共查询到 ${article.count} 条结果：`}>
        <Table rowKey="id"
          columns={columns}
          dataSource={article.list}
          pagination={{
            pageSize: params.per_page,
            total: article.count,
            onChange: pageChange
          }}
        />
      </Card>
    </div>
  )
}

export default observer(Article)