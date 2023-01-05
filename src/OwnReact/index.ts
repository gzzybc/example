/**
 * Description：index
 * Created by aio on 2023/1/5.
 */

export const TEXT_ELEMENT = 'TEXT ELEMENT'
class OwnReact {
  static createTextElement (value:any) {
    console.log(value)
  }
  static createElement (type:any, config:any, ...args:any) {
    console.log(type, 'type')
    console.log( config, 'config')
    console.log( ...args, 'args')
    console.log('====')
    console.log('\n')

  }
}


export default OwnReact
