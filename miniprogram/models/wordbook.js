 /**
  * 词书相关接口封装 
  * 1. 切换词书
  * 2. 列出所有词书及其信息
  */

 import {
   HTTP
 } from '../utils/http.js'

 class WordBook extends HTTP {
   /**
    * 切换词书
    * @POST 
    * @Authorization
    * @param {bookCode} 目标词书的代码
    * @return {bookInfo} 词书的信息: { 词书代码bookCode, 总词量totalNum } 
    * @errcode -6 : 词书代码不存在
    */
   switchCurBook(bookCode) {
     return new Promise((resolve, reject) => {
       this.request({
           url: '/wordbook/switch/' + bookCode,
           method: 'POST'
         }).then(res => {
           resolve(res)
         })
         .catch(console.error)
     })
   }
 }


 export {
   WordBook
 }