import request from './network' 

// 轮播图及数据
export function getMultiData(){
  return  request({
    url: '/home/multidata'
  })
}
// 商品数据
export function getGoodsData(type,page){
  return request({
    url:'/home/data',
    data:{
      type,
      page
    }
  })
}