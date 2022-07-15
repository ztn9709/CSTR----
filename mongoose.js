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
  let data = await Material.find().select('id formula')
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
      creators: null,
      submitOrgName: '中国科学院凝聚态物质科学数据中心',
      submitOrgAddress: '北京市海淀区中关村南三街8号',
      submitOrgPostcode: '100190',
      submitOrgPhone: '13811570964',
      submitOrgEmail: 'hmweng@iphy.ac.cn',
      registerOrganizationCN: '中国科学院凝聚态物质科学数据中心',
      registerOrganizationEN: 'CAS Condensed Matter Science Data Center',
      publicationDate: '2022-06-20',
      shareChannel: '1',
      shareRange: '01',
      process: '网站提供链接',
      contributors: [
        {
          contributorNameCN: '',
          contributorNameEN: '',
          contributorType: '',
          contributorIdentifier: '',
          contributorIdentifierType: '',
          contributorOrganizationCN: '',
          contributorOrganizationEN: '',
          contributorOrganizationIdentifier: '',
          contributorOrganizationIdentifierType: '',
          contributionType: ''
        }
      ],
      alternativeIdentifiers: [
        {
          identifierValue: '',
          identifierType: ''
        }
      ],
      subjectClassifications: [
        {
          subjectName: ['140'],
          subjectNameStandard: '01',
          keyWordsCN: [],
          keyWordsEN: []
        }
      ],
      associationIdentifiers: [
        {
          identifierValue: '',
          identifierType: '',
          relationType: ''
        }
      ],
      copyrights: [
        {
          copyrightDescription: '',
          copyrightCertificateNumber: ''
        }
      ],
      funders: [
        {
          funderName: '',
          funderProjectName: '',
          funderProjectNumber: ''
        }
      ],
      labelingSuggestions: ''
    }
    template.resourceChineseName = item.formula + '材料的拓扑性质'
    template.resourceName = item.formula
    template.identifier = '32321.11.' + '000001.' + item.id + '.test'
    let url = 'http://materiae.iphy.ac.cn/materials/' + item.id
    template.urls = [url]
    template.descriptionCN = '来自晶体材料拓扑性质数据库,记录了' + item.formula + '的相关拓扑性质，包括该材料的晶体结构、拓扑分类、对称性指标、态密度、能带等。'
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
}
getData()

module.exports = Material
