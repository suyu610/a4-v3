 /**
  * 词书相关接口封装 
  * 1. 切换词书
  * 2. 列出所有词书及其信息
  */

 import {
   HTTP
 } from '../utils/http.js'

 class CustomBook extends HTTP {
   /**
    * 获取所有自定义词书
    * @POST 
    * @Authorization
    * @param {bookCode} 目标词书的代码
    * @return {bookInfo} 词书的信息: { 词书代码bookCode, 总词量totalNum } 
    * @errcode -6 : 词书代码不存在
    */
   getCustomBook(bookCode) {
     return new Promise((resolve, reject) => {
       this.request({
           url: '/custom-book/list/',
           method: 'GET'
         }).then(res => {
           resolve(res)
         })
         .catch(console.error)
     })
   }
 }


 export {
   CustomBook
 }