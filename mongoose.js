const mongoose = require('mongoose')
const Schema = mongoose.Schema
const fs = require('fs')
const path = require('path')
const axios = require('axios')

mongoose.connect('mongodb://localhost/nonlinear')

const materialSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  formula: {
    type: String,
    required: true
  }
})
const Material = mongoose.model('Material', materialSchema)

async function getData() {
  let data = await Material.find().select({ _id: 0, id: 1, formula: 1, soc_topo_class: 1, nsoc_topo_class: 1 }).limit(5).lean()
  let metaData = data.map(item => {
    let template = {
      type: 'BaseMetadata',
      resourceChineseName: '',
      resourceName: '',
      resourceNameType: '01',
      identifier: '',
      urls: [],
      identificationStatus: 0,
      descriptionCN: '',
      descriptionEN: '',
      resourceType: '11',
      creators: [
        {
          creatorNameCN: '中国科学院物理研究所',
          creatorNameEN: ''
        }
      ],
      submitOrgName: '中国科学院凝聚态物质科学数据中心',
      submitOrgAddress: '北京市海淀区中关村南三街8号',
      submitOrgPostcode: '100190',
      submitOrgPhone: '13811570964',
      submitOrgEmail: 'hmweng@iphy.ac.cn',
      registerOrganizationCN: '中国科学院凝聚态物质科学数据中心',
      registerOrganizationEN: 'Condensed Matter Physics Data Center,CAS',
      publicationDate: '2022-07-01',
      shareChannel: '1',
      shareRange: '02',
      process: '网站提供链接',
      contributors: null,
      subjectClassifications: [
        {
          subjectName: ['140'],
          subjectNameStandard: '01',
          keyWordsCN: ['晶体结构', '拓扑分类', '对称性指标'],
          keyWordsEN: []
        }
      ]
    }
    template.resourceChineseName = item.formula + '材料的拓扑性质'
    template.resourceName = 'The properties of topological material ' + item.formula
    template.identifier = '32321.11.' + '000001.' + item.id + '.test001'
    let url = 'http://materiae.iphy.ac.cn/materials/' + item.id
    template.urls = [url]
    template.descriptionCN =
      '晶体材料拓扑性质数据库记录了' +
      item.formula +
      '的相关拓扑性质，' +
      '该材料的拓扑分类为' +
      item.nsoc_topo_class +
      '(Non-SOC)/' +
      item.soc_topo_class +
      '(SOC)。' +
      '详情页面展示了该材料的晶体结构，包括空间群、晶格常数等以及可视化的三维原胞球棍模型，另外还有该材料的对称性指标、态密度、能带等计算信息。'
    return template
  })
  let result = {
    metadatas: metaData,
    prefix: '32321'
  }
  // const p = path.join(__dirname, 'TopoCSTR.json')
  // fs.writeFileSync(p, JSON.stringify(result))
  //发送axios请求注册
  const res = await axios({
    url: 'https://www.cstr.cn/openapi/v2/pid-cstr-service/cstr.batch.register',
    method: 'post',
    data: result,
    headers: {
      clientId: '202202111123',
      secret: '7e3102752251a111b40ffea4e65480b3'
    }
  })
  console.log(res)

  let metaData2 = data.map(item => {
    let template2 = {
      chineseTitle: '',
      englishTitle: '',
      id: '',
      subjectCategory: '物理学',
      themeCategory: '凝聚态物理',
      keyword: '晶体结构;拓扑分类;对称性指标',
      description: '',
      serviceOrganizationName: '中国科学院凝聚态物质科学数据中心',
      serviceOrganizationAddress: '北京市海淀区中关村南三街8号',
      serviceOrganizationPostalCode: '100190',
      serviceOrganizationPhoneNumber: '13811570964',
      serviceOrganizationMail: 'hmweng@iphy.ac.cn',
      date: '2022-07-01',
      sharingMode: {
        sharePathway: ['线上共享'],
        shareScope: '完全共享'
      },
      onlineAddress: ''
    }
    template2.chineseTitle = item.formula + '材料的拓扑性质'
    template2.englishTitle = 'The properties of topological material ' + item.formula
    template2.id = '32321.11.' + '000001.' + item.id + '.test001'
    let url = 'http://materiae.iphy.ac.cn/materials/' + item.id
    template2.onlineAddress = url
    template2.description =
      '晶体材料拓扑性质数据库记录了' +
      item.formula +
      '的相关拓扑性质，' +
      '该材料的拓扑分类为' +
      item.nsoc_topo_class +
      '(Non-SOC)/' +
      item.soc_topo_class +
      '(SOC)。' +
      '详情页面展示了该材料的晶体结构，包括空间群、晶格常数等以及可视化的三维原胞球棍模型，另外还有该材料的对称性指标、态密度、能带等计算信息。'
    return template2
  })
  const res2 = await axios({
    url: 'https://api.escience.org.cn/cstr/metadata/record/edit',
    method: 'post',
    data: metaData2,
    headers: {
      clientId: '4a7zbf3cg7tzhgik',
      Authorization:
        'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsaWNlbnNlIjoibWFkZSBieSBlc2NpZW5jZSIsInVzZXJfbmFtZSI6IlpodXRpYW5uaWFuX2NvbmRtYXR0Iiwic2NvcGUiOlsibWV0YWRhdGFfYWRkIl0sImV4cCI6MTY1ODA5NDI1NywiYXV0aG9yaXRpZXMiOlsidXNlcl9mYXZvcml0ZSIsIlJPTEVfNTY0Il0sImp0aSI6IjNlODZkNDgwLTMyYmQtNDlmYy1iYTNmLTMzMmVmMzFkNzYzMSIsImNsaWVudF9pZCI6IjRhN3piZjNjZzd0emhnaWsifQ.xONXsNFFjM6D_02r6ATlCm0t1-zTa9-Ocob24dnjvCg'
    }
  })
  console.log(res2)
}
getData()

module.exports = Material
