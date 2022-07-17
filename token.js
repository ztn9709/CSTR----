const axios = require('axios')

async function getToken() {
  try {
    const { data: res } = await axios({
      url: 'https://oauth.escience.org.cn/oauth/token',
      method: 'post',
      params: {
        client_id: '4a7zbf3cg7tzhgik',
        client_secret: '45IlLv4JJh8qugbEjoOMHtf1kqioyR6IYUrdmwWr',
        username: 'zhutiannian15@mails.ucas.ac.cn',
        password: 'ZWYYJFztn212324',
        grant_type: 'password',
        scope: 'metadata_add'
      }
    })
    console.log(res)
  } catch (err) {
    console.log('wrong with', err)
  }
}
getToken()
