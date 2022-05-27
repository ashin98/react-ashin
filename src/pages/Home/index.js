import Bar from '@/components/Bar'

export default function Home () {

  return (
    <div>
      <Bar title="主流框架使用满意度" xData={['Vue', 'React', 'Angular']} yData={[20, 50, 30]} style={{ width: '500px', height: '400px' }}></Bar>
      <Bar title="前端技术栈使用满意度2" xData={['JS', 'HTML', 'CSS']} yData={[100, 50, 60]} style={{ width: '600px', height: '600px' }}></Bar>
    </div>
  )
}
