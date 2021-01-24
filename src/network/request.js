import axios from 'axios'

export function request(config){
  const instance = axios.create({

    timeout:5000
  })

  instance.interceptors.request.use(config =>{
    return config
  },error => {

  })
  instance.interceptors.response.use(res=>{
    return res.data
  },err=>{
    console.log(err)
  })
  return instance(config)
}
